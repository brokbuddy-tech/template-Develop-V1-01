import type { Property, PropertyImageSource } from './types';

// Assuming the API is running locally on port 4000 as per backend configuration.
// In a real production setup, this would be an environment variable.
const API_BASE_URL = (((globalThis as any).process?.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:4000/api');
export const ORG_SLUG = 'skyline-realty';

/** Timeout-safe wrapper around fetch. Returns the Response – never throws. */
async function safeFetch(url: string, extraOpts?: RequestInit & { next?: any }, timeoutMs = 8000): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const opts: RequestInit = { ...extraOpts, signal: controller.signal };
    // next.revalidate is only valid on the server side
    if (typeof window !== 'undefined') {
        delete (opts as any).next;
    }
    try {
        const res = await fetch(url, opts);
        return res;
    } catch (err) {
        // Return a synthetic 503 when the API is unreachable so callers see
        // res.ok === false instead of an unhandled throw that triggers the
        // Next.js dev error overlay.
        console.warn(`[API] Unreachable: ${url} – ${(err as Error).message}`);
        return new Response(null, { status: 503, statusText: 'Service Unavailable' });
    } finally {
        clearTimeout(timer);
    }
}

// ── Image normalization (ported from Skyline template) ─────────────────────

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

function normalizeAssetUrl(value?: string | null): string | null {
    const normalized = value?.trim();
    if (!normalized) return null;
    // Already absolute URL — return as-is
    if (!normalized.startsWith('/')) return normalized;
    // Relative URL — prefix with API origin so Next.js Image can resolve it
    const apiOrigin = API_BASE_URL.replace(/\/api$/i, '');
    try {
        return new URL(normalized, apiOrigin).toString();
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

function normalizeImageUrl(image?: ListingImage | null): PropertyImageSource | null {
    if (!image || !isRenderableImage(image)) return null;

    const storageUrl = buildStorageImageUrl(image.gcsPath);
    const originalUrl = normalizeAssetUrl(image.url) || storageUrl;
    const isReady = image.status?.toUpperCase() === 'READY';

    const thumbnailUrl =
        normalizeAssetUrl(image.thumbnailUrl) ||
        normalizeAssetUrl(image.mediumUrl) ||
        normalizeAssetUrl(image.cdnUrl) ||
        originalUrl;
    const preferredUrl = isReady
        ? normalizeAssetUrl(image.mediumUrl) ||
          normalizeAssetUrl(image.cdnUrl) ||
          thumbnailUrl ||
          originalUrl
        : originalUrl ||
          normalizeAssetUrl(image.mediumUrl) ||
          normalizeAssetUrl(image.thumbnailUrl) ||
          normalizeAssetUrl(image.cdnUrl);
    const originalDisplayUrl = normalizeAssetUrl(image.cdnUrl) || originalUrl || preferredUrl;
    const src = preferredUrl?.trim();

    if (!src) return null;

    return {
        id: image.id || null,
        src,
        thumbnailSrc: thumbnailUrl?.trim() || src,
        originalSrc: originalDisplayUrl?.trim() || src,
        hint: 'property',
        status: image.status || null,
        unoptimized: true,
    };
}

function normalizeImages(images?: ListingImage[] | null): PropertyImageSource[] {
    if (!images?.length) return [];
    return [...images]
        .filter(isRenderableImage)
        .sort((left, right) => {
            const heroDelta = Number(Boolean(right.isHero)) - Number(Boolean(left.isHero));
            if (heroDelta !== 0) return heroDelta;
            const orderDelta =
                (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
            if (orderDelta !== 0) return orderDelta;
            return String(left.id || '').localeCompare(String(right.id || ''));
        })
        .map(normalizeImageUrl)
        .filter((url): url is PropertyImageSource => Boolean(url));
}

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

/**
 * Helper to map a URL slug back to a database category name.
 */
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
        if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim();
        }
    }

    return undefined;
}

function getNumberValue(...values: unknown[]) {
    for (const value of values) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === 'string' && value.trim().length > 0) {
            const parsed = Number(value);
            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }
    }

    return undefined;
}

function getCoordinatePair(listing: any, fields: Record<string, unknown>) {
    const latitude = getNumberValue(listing.latitude, listing.lat, fields.latitude, fields.lat);
    const longitude = getNumberValue(listing.longitude, listing.lng, fields.longitude, fields.lng);

    if (latitude === undefined || longitude === undefined) {
        return { latitude: null, longitude: null };
    }

    return { latitude, longitude };
}

/**
 * Maps a backend listing object to the frontend Property type.
 */
export function mapListingToProperty(listing: any): Property {
    const fields = readListingFields(listing);

    // Determine purpose from transactionType
    const isRent = listing.transactionType?.toUpperCase() === 'RENT';
    const purpose: 'Buy' | 'Rent' = isRent ? 'Rent' : 'Buy';
    const isCommercial = listing.propertyType?.toUpperCase() === 'COMMERCIAL';

    // Get the original category
    const category = getStringValue(listing.category, fields.category, fields.type) || 'Property';

    // Determine propertyGroup and sync purpose
    let propertyGroup: 'Residential' | 'Commercial' = isCommercial ? 'Commercial' : 'Residential';

    // Helper to determine core type for icons/filtering
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

    const coreType = getCoreType(category);

    // Fallback logic for badge if we were using type
    // but better to just use category in the UI for precision.

    // Normalize all images using the robust pipeline
    const allImages = normalizeImages(listing.images);
    const imageId = allImages.length > 0 ? allImages[0].src : 'property-1';
    const galleryImageIds = allImages.map((image) => image.src);
    const amenities = Array.isArray(listing.amenities)
        ? listing.amenities
        : Array.isArray(fields.amenities)
            ? fields.amenities
            : typeof listing.amenities === 'string'
                ? listing.amenities.split(',')
                : [];
    const { latitude, longitude } = getCoordinatePair(listing, fields);
    const location = getStringValue(
        listing.location,
        listing.area,
        listing.emirate,
        listing.subArea,
        listing.address,
        listing.streetAddress,
        fields.location,
        fields.area,
        fields.community,
        fields.subCommunity,
        fields.city,
    ) || 'Dubai';
    const mapAddress = getStringValue(
        listing.streetAddress,
        listing.address,
        fields.streetAddress,
        fields.address,
        fields.tower,
        fields.towerOrBuilding,
    );
    const priceValue = getNumberValue(listing.price, fields.price) || 0;
    const builtUpArea = getNumberValue(
        listing.builtUpArea,
        listing.size,
        listing.areaSqFt,
        fields.builtUpArea,
        fields.size,
        fields.areaSqFt,
    ) || 0;

    return {
        id: listing.id,
        name: listing.title || 'Untitled Property',
        type: coreType,
        category,
        propertyGroup,
        purpose,
        status: listing.readiness?.toUpperCase() === 'OFFPLAN' ? 'Off-plan' : 'Ready',
        price: `${listing.currency || 'AED'} ${priceValue.toLocaleString() || 'POA'}`,
        priceNumeric: priceValue,
        bedrooms: getNumberValue(listing.bedrooms, fields.bedrooms) || 0,
        bathrooms: getNumberValue(listing.bathrooms, fields.bathrooms) || 0,
        areaSqFt: builtUpArea,
        imageId,
        primaryImage: allImages[0] ?? null,
        location,
        mapAddress,
        latitude,
        longitude,
        description: getStringValue(listing.description, fields.description) || '',
        amenities: amenities.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0),
        galleryImageIds,
        galleryImages: allImages,
        agent: listing.broker ? {
            name: `${listing.broker.firstName} ${listing.broker.lastName}`,
            avatarId: listing.broker.avatar || 'author-1',
            title: listing.broker.brokerProfile?.tagline || 'Broker',
            company: 'Skyline Realty',
            orn: '12345'
        } : undefined
    };
}

export interface PaginatedProperties {
    properties: Property[];
    total: number;
    page: number;
    totalPages: number;
}

export async function getProperties(params?: Record<string, string | undefined>): Promise<PaginatedProperties> {
    try {
        const queryParams = new URLSearchParams();

        // Normalize 3-tier pillars
        const transactionType = params?.transactionType || params?.purpose || 'SALE';
        const propertyType = params?.propertyType || params?.group || 'RESIDENTIAL';
        const category = params?.category || params?.types || '';

        queryParams.set('transactionType', transactionType.toUpperCase());
        queryParams.set('propertyType', propertyType.toUpperCase());
        if (category) queryParams.set('category', category);

        // Add other filters
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== '' && !['transactionType', 'purpose', 'propertyType', 'group', 'category', 'types'].includes(key)) {
                    queryParams.append(key, value);
                }
            }
        }

        const queryString = queryParams.toString();
        const url = `${API_BASE_URL}/public/org/${ORG_SLUG}/listings${queryString ? `?${queryString}` : ''}`;

        const res = await safeFetch(url, {
            next: { revalidate: 60 }
        } as any);

        if (!res.ok) {
            console.error('Failed to fetch listings:', await res.text());
            return { properties: [], total: 0, page: 1, totalPages: 1 };
        }

        const data = await res.json();

        // Handle both older array format and new paginated object format
        let rawListings = [];
        let total = 0;
        let page = 1;
        let totalPages = 1;

        if (Array.isArray(data)) {
            rawListings = data;
            total = rawListings.length;
        } else if (data && Array.isArray(data.listings)) {
            rawListings = data.listings;
            total = data.total || rawListings.length;
            page = data.page || 1;
            totalPages = data.totalPages || 1;
        }

        return {
            properties: rawListings.map(mapListingToProperty),
            total,
            page,
            totalPages
        };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { properties: [], total: 0, page: 1, totalPages: 1 };
    }
}

export async function getPropertyById(id: string): Promise<Property | null> {
    try {
        const res = await safeFetch(`${API_BASE_URL}/public/listing/${id}`, {
            next: { revalidate: 60 }
        } as any);

        if (!res.ok) {
            return null;
        }

        const listing = await res.json();
        return mapListingToProperty(listing);
    } catch (error) {
        console.error('Error fetching property by id:', error);
        return null;
    }
}

export async function getOrgConfig(): Promise<{ categories: string[], amenities: string[] }> {
    try {
        const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/config`, {
            next: { revalidate: 3600 }
        } as any, 5000);
        if (!res.ok) return { categories: [], amenities: [] };
        return await res.json();
    } catch (error) {
        // Silently return defaults — the API may be unreachable from the browser
        return { categories: [], amenities: [] };
    }
}

export async function getAreaGuides(): Promise<any[]> {
    try {
        const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/area-guides`, {
            next: { revalidate: 3600 }
        } as any);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching area guides:', error);
        return [];
    }
}

export async function getTestimonials(): Promise<any[]> {
    try {
        const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/testimonials`, {
            next: { revalidate: 3600 }
        } as any);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

export async function getBlogs(): Promise<any[]> {
    try {
        const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/blogs`, {
            next: { revalidate: 3600 }
        } as any);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
}

export async function getSellerTestimonials(): Promise<any[]> {
    try {
        const res = await safeFetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/seller-testimonials`, {
            next: { revalidate: 3600 }
        } as any);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching seller testimonials:', error);
        return [];
    }
}
