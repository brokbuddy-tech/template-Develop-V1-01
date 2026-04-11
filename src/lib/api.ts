import type { 
  Property, 
  PropertyMedia, 
  PropertyImageSource 
} from './types';

// Assuming the API is running locally on port 4000 as per backend configuration.
const API_BASE_URL = (((globalThis as any).process?.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:4000/api');
export const ORG_SLUG = 'skyline-realty';

/** Timeout-safe wrapper around fetch. Returns the Response – never throws. */
async function safeFetch(url: string, extraOpts?: RequestInit & { next?: any }, timeoutMs = 8000): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const opts: RequestInit = { ...extraOpts, signal: controller.signal };
    if (typeof window !== 'undefined') {
        delete (opts as any).next;
    }
    try {
        const res = await fetch(url, opts);
        return res;
    } catch (err) {
        console.warn(`[API] Unreachable: ${url} – ${(err as Error).message}`);
        return new Response(null, { status: 503, statusText: 'Service Unavailable' });
    } finally {
        clearTimeout(timer);
    }
}

// ── Image normalization (Aligned with Broker-OS Proxied Architecture) ───────

type ListingImage = {
    id?: string | null;
    url?: string | null;
    cdnUrl?: string | null;
    mediumUrl?: string | null;
    thumbnailUrl?: string | null;
    gcsPath?: string | null;
    format?: string | null;
    category?: string | null;
    order?: number | null;
    status?: string | null;
    isHero?: boolean | null;
};

function buildStorageImageUrl(gcsPath?: string | null): string | null {
    if (!gcsPath) return null;
    return `https://storage.googleapis.com/brokbuddy-listing-images/${gcsPath.replace(/^\/+/, '')}`;
}

const GCS_PUBLIC_BASE = 'https://storage.googleapis.com/brokbuddy-listing-images';
const BROKEN_CDN_PATTERNS = [
    /^https?:\/\/cdn\.brokbuddy\.com\//,
    /^https?:\/\/34\.160\.56\.176\//,
];

/**
 * Rewrites CDN URLs that point to non-operational CDN hosts
 * to use direct GCS public URLs instead.
 */
function rewriteCdnToGcs(url?: string | null): string | null {
    if (!url) return null;
    for (const pattern of BROKEN_CDN_PATTERNS) {
        if (pattern.test(url)) {
            return url.replace(pattern, `${GCS_PUBLIC_BASE}/`);
        }
    }
    return url;
}

/** 
 * Mimics Broker-OS getListingMediaUrl for the public API proxy.
 * COST OPTIMIZATION: Prefer direct GCS URLs when available to avoid
 * routing image bytes through the API server (the #1 networking cost driver).
 * Only falls back to the proxy URL when no direct URLs exist.
 */
function getPublicListingMediaUrl(
  image?: ListingImage | null,
  variant: 'thumbnail' | 'medium' | 'compressed' | 'original' = 'medium'
): string | null {
  if (!image) return null;

  // Force API proxy as CDN and direct GCS URLs are currently returning 403
  // due to unauthenticated bucket permissions.
  if (image.id) {
    return `/api/public/images/${image.id}/view?variant=${variant}`;
  }

  return image.url || null;
}

function normalizeAssetUrl(value?: string | null): string | null {
    const normalized = value?.trim();
    if (!normalized) return null;
    
    if (/^https?:\/\//i.test(normalized)) return normalized;

    const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
    const apiOrigin = API_BASE_URL.replace(/\/api$/i, '');

    try {
        return new URL(path, apiOrigin).toString();
    } catch {
        return normalized;
    }
}

function isRenderableImage(image?: ListingImage | null): boolean {
    if (!image) return false;
    const format = (image.format || '').toLowerCase();
    const category = (image.category || '').toUpperCase();
    if (category === 'TITLE_DEED') return false;
    if (format === 'application/pdf' || format.endsWith('pdf')) return false;
    return true;
}

// ── Mapping Helpers ─────────────────────────────────────────────────────────

export const PROPERTY_TYPES_MAPPING: Record<string, string[]> = {
    Residential_Sell: [
        'Apartment', 'Townhouse', 'Villa Compound', 'Land', 'Building', 'Villa', 'Penthouse',
        'Hotel Apartment', 'Floor', 'Mansion', 'Studio', 'Duplex Apartment', 'Residential Building',
        'Residential Floor', 'Bungalow', 'Full Floor', 'Half Floor', 'Compound'
    ],
    Residential_Rent: [
        'Apartment', 'Townhouse', 'Villa Compound', 'Land', 'Building', 'Villa', 'Penthouse',
        'Hotel Apartment', 'Residential Floor', 'Mansion', 'Residential Building', 'Whole building',
        'Bungalow', 'Duplex', 'Bulk Rent unit'
    ],
    Commercial_Sell: [
        'Office', 'Warehouse', 'Retail', 'Villa', 'Land', 'Building', 'Industrial Land', 'Showroom',
        'Bungalow', 'Shop', 'Labour Camp', 'Bulk Unit', 'Floor', 'Mixed Use Land', 'Factory',
        'Other Commercial', 'Commercial Floor', 'Commercial Building', 'Commercial Villa',
        'Staff Accommodation', 'Business Center', 'Farm', 'Co-working Space'
    ],
    Commercial_Rent: [
        'Office', 'Warehouse', 'Villa', 'Land', 'Building', 'Industrial Land', 'Showroom', 'Shop',
        'Labour Camp', 'Bulk Unit', 'Floor', 'Factory', 'Mixed Use Land', 'Business Center',
        'Co-Working space', 'Farm', 'Staff Accommodation', 'Commercial Floor', 'Commercial Villa',
        'Half Floor', 'Full floor', 'Bungalow'
    ],
};

export function getCategoryFromSlug(slug: string): string {
    const normalizedSlug = slug.toLowerCase().replace(/-/g, ' ').replace(/s$/, ''); // basic reversal

    // Find exact match in our mapping lists
    const allCategories = Object.values(PROPERTY_TYPES_MAPPING).flat();
    const match = allCategories.find(cat => {
        const catSlug = cat.toLowerCase().replace(/\s+/g, '-').replace(/s$/, '');
        return catSlug === slug.toLowerCase().replace(/s$/, '');
    });

    if (match) return match;

    // Fallback to title case
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/s$/, '');
}

function readListingFields(listing: any): Record<string, unknown> {
    return listing?.fields && typeof listing.fields === 'object'
        ? listing.fields as Record<string, unknown>
        : {};
}

function getStringValue(...values: unknown[]) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    }
    return undefined;
}

function getNumberValue(...values: unknown[]) {
    for (const value of values) {
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (typeof value === 'string' && value.trim().length > 0) {
            const parsed = Number(value.replace(/,/g, ''));
            if (Number.isFinite(parsed)) return parsed;
        }
    }
    return undefined;
}

/**
 * Maps a backend listing object to the frontend Property type.
 */
export function mapListingToProperty(listing: any): Property {
    const fields = listing.fields || {};
    const images: ListingImage[] = Array.isArray(listing.images) ? listing.images : [];

    const isRent = listing.transactionType?.toUpperCase() === 'RENT';
    const purpose: 'Buy' | 'Rent' = isRent ? 'Rent' : 'Buy';
    const isCommercial = listing.propertyType?.toUpperCase() === 'COMMERCIAL';
    const category = getStringValue(listing.category, fields.category, fields.type) || 'Property';
    let propertyGroup: 'Residential' | 'Commercial' = isCommercial ? 'Commercial' : 'Residential';

    const getCoreType = (catName: string): string => {
        const cat = catName.toLowerCase();
        if (cat.includes('villa') || cat.includes('mansion') || cat.includes('bungalow') || cat.includes('compound') || cat.includes('building')) return 'Villa';
        if (cat.includes('townhouse')) return 'Townhouse';
        if (cat.includes('penthouse')) return 'Penthouse';
        if (cat.includes('plot') || cat.includes('land')) return 'Plot';
        if (cat.includes('studio')) return 'Studio';
        if (cat.includes('office') || cat.includes('business') || cat.includes('center')) return 'Office';
        if (cat.includes('retail') || cat.includes('shop') || cat.includes('showroom')) return 'Retail';
        if (cat.includes('industrial') || cat.includes('warehouse') || cat.includes('factory')) return 'Industrial';
        return 'Apartment';
    };

    const media: PropertyMedia[] = images
        .filter(isRenderableImage)
        .sort((left, right) => {
            const heroDelta = Number(Boolean(right.isHero)) - Number(Boolean(left.isHero));
            if (heroDelta !== 0) return heroDelta;
            const orderDelta = (left.order ?? 999) - (right.order ?? 999);
            if (orderDelta !== 0) return orderDelta;
            return String(left.id || '').localeCompare(String(right.id || ''));
        })
        .map(img => {
            const thumb = getPublicListingMediaUrl(img, 'thumbnail');
            const med = getPublicListingMediaUrl(img, 'medium');
            const high = getPublicListingMediaUrl(img, 'compressed');
            const originalUrl = normalizeAssetUrl(img.url) || buildStorageImageUrl(img.gcsPath) || '';

            return {
                url: normalizeAssetUrl(med) || normalizeAssetUrl(high) || originalUrl,
                thumbnailUrl: normalizeAssetUrl(thumb) || normalizeAssetUrl(med) || originalUrl,
                mediumUrl: normalizeAssetUrl(med) || normalizeAssetUrl(high) || originalUrl,
                cdnUrl: normalizeAssetUrl(high) || normalizeAssetUrl(med) || originalUrl,
            };
        })
        .filter(m => !!m.url);

    const priceValue = getNumberValue(listing.price, fields.price) || 0;
    const builtUpArea = getNumberValue(listing.builtUpArea, listing.size, listing.areaSqFt, fields.builtUpArea) || 0;

    return {
        id: listing.id,
        name: listing.title || 'Untitled Property',
        title: listing.title,
        type: getCoreType(category),
        category,
        propertyGroup,
        purpose,
        status: listing.readiness?.toUpperCase() === 'OFFPLAN' ? 'Off-plan' : 'Ready',
        price: `${listing.currency || 'AED'} ${priceValue.toLocaleString()}`,
        priceNumeric: priceValue,
        bedrooms: getNumberValue(listing.bedrooms, fields.bedrooms) || 0,
        bathrooms: getNumberValue(listing.bathrooms, fields.bathrooms) || 0,
        areaSqFt: builtUpArea,
        builtUpArea,
        size: builtUpArea,
        imageId: media[0]?.url || 'property-1',
        primaryImage: media[0] ? {
            id: listing.id + '-main',
            src: media[0].url,
            thumbnailSrc: media[0].thumbnailUrl,
            originalSrc: media[0].cdnUrl,
            unoptimized: true
        } : null,
        location: getStringValue(listing.location, listing.area, listing.emirate) || 'Dubai',
        mapAddress: getStringValue(listing.streetAddress, listing.address),
        latitude: getNumberValue(listing.latitude, fields.latitude) || null,
        longitude: getNumberValue(listing.longitude, fields.longitude) || null,
        description: listing.description || '',
        amenities: Array.isArray(listing.amenities) ? listing.amenities : [],
        galleryImageIds: media.map(m => m.url),
        galleryImages: media.map((m, i) => ({
            id: listing.id + '-' + i,
            src: m.url,
            thumbnailSrc: m.thumbnailUrl,
            originalSrc: m.cdnUrl,
            unoptimized: true
        })),
        media,
        agent: listing.broker ? {
            name: `${listing.broker.firstName} ${listing.broker.lastName}`,
            avatarId: listing.broker.avatar || 'author-1',
            avatarUrl: normalizeAssetUrl(listing.broker.avatar),
            title: listing.broker.brokerProfile?.tagline || 'Property Consultant',
            company: 'Skyline Realty',
            orn: '12345'
        } : undefined
    };
}

// ── API Methods ─────────────────────────────────────────────────────────────

export interface PaginatedProperties {
    properties: Property[];
    total: number;
    page: number;
    totalPages: number;
}

export async function getProperties(params?: Record<string, string | undefined>): Promise<PaginatedProperties> {
    try {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') queryParams.append(key, value);
            });
        }

        const queryString = queryParams.toString();
        const url = `${API_BASE_URL}/public/org/${ORG_SLUG}/listings${queryString ? `?${queryString}` : ''}`;
        const res = await safeFetch(url, { next: { revalidate: 300 } } as any);

        if (!res.ok) return { properties: [], total: 0, page: 1, totalPages: 1 };
        const data = await res.json();

        let rawListings = Array.isArray(data) ? data : (data.listings || []);
        let total = data.total || rawListings.length;

        return {
            properties: rawListings.map(mapListingToProperty),
            total,
            page: data.page || 1,
            totalPages: data.totalPages || 1
        };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { properties: [], total: 0, page: 1, totalPages: 1 };
    }
}

export async function getPropertyById(id: string): Promise<Property | null> {
    const res = await safeFetch(`${API_BASE_URL}/public/listing/${id}`, { next: { revalidate: 300 } } as any);
    if (!res.ok) return null;
    const listing = await res.json();
    return mapListingToProperty(listing);
}

export async function getOrgConfig(): Promise<{ categories: string[], amenities: string[] }> {
    const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/config`, { next: { revalidate: 3600 } } as any, 5000);
    if (!res.ok) return { categories: [], amenities: [] };
    return await res.json();
}

export async function getAreaGuides(): Promise<any[]> {
    const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/area-guides`, { next: { revalidate: 3600 } } as any);
    return res.ok ? await res.json() : [];
}

export async function getTestimonials(): Promise<any[]> {
    const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/testimonials`, { next: { revalidate: 3600 } } as any);
    return res.ok ? await res.json() : [];
}

export async function getBlogs(): Promise<any[]> {
    const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/blogs`, { next: { revalidate: 3600 } } as any);
    return res.ok ? await res.json() : [];
}

export async function getSellerTestimonials(): Promise<any[]> {
    const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/seller-testimonials`, { next: { revalidate: 3600 } } as any);
    return res.ok ? await res.json() : [];
}
