import type { 
  Property, 
  PropertyMedia, 
  PropertyImageSource 
} from './types';
import {
    API_BASE_URLS,
    PUBLIC_API_BASE_URLS,
    PUBLIC_TEMPLATE_PROXY_BASE_PATH,
    getConfiguredTemplateHexCode,
    getClientTemplateFetchUrl,
    normalizePublicTemplateAssetUrl,
    shouldRetryApiRequest,
} from './api-base';
import { getDefaultAgencySlug, getEffectiveAgencySlug } from './agency-routing';

const API_BASE_URL = API_BASE_URLS[0] || 'http://localhost:4000/api';

export function getPublicTemplateUrl(path = '', agencySlug?: string | null) {
    return getClientTemplateFetchUrl(path, agencySlug);
}

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
  variant: 'thumbnail' | 'medium' | 'compressed' | 'original' = 'medium',
  agencySlug?: string | null,
): string | null {
  if (!image) return null;

  // Force API proxy as CDN and direct GCS URLs are currently returning 403
  // due to unauthenticated bucket permissions.
  if (image.id) {
    return getPublicTemplateUrl(`/images/${image.id}/view?variant=${variant}`, agencySlug);
  }

  return rewriteCdnToGcs(image.cdnUrl) || buildStorageImageUrl(image.gcsPath) || image.url || null;
}

function isRelativeTemplateViewPath(value?: string | null) {
    const normalized = value?.trim();
    return Boolean(normalized && /^view(?:\?|$)/i.test(normalized));
}

function normalizeAssetUrl(value?: string | null): string | null {
    const normalized = value?.trim();
    if (!normalized) return null;
    if (isRelativeTemplateViewPath(normalized)) return null;

    const normalizedProxyPath = normalizePublicTemplateAssetUrl(normalized) || normalized;
    if (/^https?:\/\//i.test(normalizedProxyPath)) return normalizedProxyPath;
    if (normalizedProxyPath.startsWith(PUBLIC_TEMPLATE_PROXY_BASE_PATH)) return normalizedProxyPath;

    const path = normalizedProxyPath.startsWith('/') ? normalizedProxyPath : `/${normalizedProxyPath}`;
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

type ResolvedAgencyContext = {
    organization?: {
        slug?: string;
        hexCode?: string;
    };
};

function appendHexToSearch(search: string, hexCode: string) {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    params.set('hex', hexCode);
    const serialized = params.toString();
    return serialized ? `?${serialized}` : '';
}

function buildBackendPublicUrl(
    publicApiBaseUrl: string,
    agencySlug: string,
    hexCode: string,
    path = '',
) {
    const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
    const [pathname, search = ''] = normalizedPath.split('?');
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return `${publicApiBaseUrl}/organization${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
    }

    if (segments[0] === 'listings') {
        if (segments[1]) {
            return `${publicApiBaseUrl}/listings/${encodeURIComponent(segments[1])}${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
        }
        return `${publicApiBaseUrl}/listings${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
    }

    if (segments[0] === 'agents') {
        if (segments[1]) {
            return `${publicApiBaseUrl}/agent/${encodeURIComponent(segments[1])}${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
        }
        return `${publicApiBaseUrl}/agents${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
    }

    if (segments[0] === 'inquiry') {
        return `${publicApiBaseUrl}/inquiries${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
    }

    if (segments[0] === 'logo' && segments[1] === 'view') {
        return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/logo/view${search ? `?${search}` : ''}`;
    }

    if (segments[0] === 'images' && segments[1]) {
        const trailing = segments.slice(2).map(encodeURIComponent).join('/');
        return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/images/${encodeURIComponent(segments[1])}/${trailing}${search ? `?${search}` : ''}`;
    }

    const joinedPath = segments.map(encodeURIComponent).join('/');
    return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/${joinedPath}${search ? `?${search}` : ''}`;
}

function getConfiguredAgencyContext(agencySlug?: string | null): ResolvedAgencyContext | null {
    const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
    const defaultAgencySlug = getDefaultAgencySlug();
    const configuredHexCode = getConfiguredTemplateHexCode();

    if (!resolvedAgencySlug || !defaultAgencySlug || !configuredHexCode || resolvedAgencySlug !== defaultAgencySlug) {
        return null;
    }

    return {
        organization: {
            slug: resolvedAgencySlug,
            hexCode: configuredHexCode,
        },
    };
}

async function resolveAgencyContext(agencySlug?: string | null) {
    const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
    if (!resolvedAgencySlug) return null;

    const configuredContext = getConfiguredAgencyContext(resolvedAgencySlug);
    if (configuredContext) {
        return configuredContext;
    }

    for (const publicApiBaseUrl of PUBLIC_API_BASE_URLS) {
        try {
            const response = await safeFetch(`${publicApiBaseUrl}/agency/${encodeURIComponent(resolvedAgencySlug)}/resolve`, {
                cache: 'no-store',
            }, 4000);

            if (!response.ok) {
                continue;
            }

            const data = await response.json() as ResolvedAgencyContext;
            if (data?.organization?.hexCode) {
                return data;
            }
        } catch {
            continue;
        }
    }

    return null;
}

async function fetchDirectTemplateResponse(
    resolvedAgencySlug: string,
    path = '',
    options?: RequestInit,
    timeout = 8000,
) {
    const resolvedContext = await resolveAgencyContext(resolvedAgencySlug);
    const hexCode = resolvedContext?.organization?.hexCode;
    if (!hexCode) {
        return new Response(null, { status: 404, statusText: 'Agency Not Found' });
    }

    let lastResponse: Response | null = null;
    for (const publicApiBaseUrl of PUBLIC_API_BASE_URLS) {
        const backendUrl = buildBackendPublicUrl(publicApiBaseUrl, resolvedAgencySlug, hexCode, path);
        const response = await safeFetch(backendUrl, options as RequestInit & { next?: any }, timeout);
        lastResponse = response;
        if (response.ok || !(await shouldRetryApiRequest(response))) {
            return response;
        }
    }

    return lastResponse || new Response(null, { status: 502, statusText: 'Service Unavailable' });
}

async function fetchTemplateResponse(
    path = '',
    options?: RequestInit,
    timeout = 8000,
    agencySlug?: string | null,
) {
    const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug();
    if (!resolvedAgencySlug) {
        return new Response(null, { status: 404, statusText: 'Agency Not Found' });
    }

    if (typeof window !== 'undefined') {
        return safeFetch(
            getClientTemplateFetchUrl(path, resolvedAgencySlug),
            options as RequestInit & { next?: any },
            timeout,
        );
    }

    return fetchDirectTemplateResponse(resolvedAgencySlug, path, options, timeout);
}

function normalizeListingDescription(description?: string) {
    const plainText = (description || '')
        .replace(/<\s*br\s*\/?>/gi, '\n')
        .replace(/<\/\s*(div|p|section|article|h[1-6])\s*>/gi, '\n\n')
        .replace(/<\/\s*li\s*>/gi, '\n')
        .replace(/<\s*li\b[^>]*>/gi, '- ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\r/g, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

    return plainText || 'Property details coming soon.';
}

function mapListingAgent(listing: any) {
    const publicAgent = listing?.agent;
    const legacyBroker = listing?.broker;
    const agentName = getStringValue(
        publicAgent?.name,
        legacyBroker?.brokerProfile?.displayName,
        [legacyBroker?.firstName, legacyBroker?.lastName].filter(Boolean).join(' ')
    );

    if (!agentName) {
        return undefined;
    }

    const avatar = getStringValue(publicAgent?.avatarUrl, publicAgent?.avatar, legacyBroker?.avatar) || 'author-1';

    return {
        name: agentName,
        avatarId: avatar,
        avatarUrl: normalizeAssetUrl(avatar),
        title: getStringValue(publicAgent?.title, publicAgent?.tagline, legacyBroker?.brokerProfile?.tagline) || 'Property Consultant',
        company: getStringValue(publicAgent?.company, listing?.organizationName, listing?.organization?.name) || 'Real Estate Brokerage',
        orn: getStringValue(publicAgent?.licenseNumber, publicAgent?.orn, legacyBroker?.licenseNumber) || '12345',
    };
}

/**
 * Maps a backend listing object to the frontend Property type.
 */
export function mapListingToProperty(listing: any, agencySlug?: string | null): Property {
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
            const thumb = getPublicListingMediaUrl(img, 'thumbnail', agencySlug);
            const med = getPublicListingMediaUrl(img, 'medium', agencySlug);
            const high = getPublicListingMediaUrl(img, 'compressed', agencySlug);
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
        description: normalizeListingDescription(listing.description),
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
        agent: mapListingAgent(listing),
    };
}

// ── API Methods ─────────────────────────────────────────────────────────────

export interface PaginatedProperties {
    properties: Property[];
    total: number;
    page: number;
    totalPages: number;
}

type PublicTemplateSiteSnapshot = {
    categories?: string[];
    amenities?: string[];
    areaGuides?: any[];
    testimonials?: any[];
    sellerTestimonials?: any[];
    blogs?: any[];
};

async function getTemplateSiteSnapshot(agencySlug?: string | null): Promise<PublicTemplateSiteSnapshot | null> {
    const res = await fetchTemplateResponse('', { next: { revalidate: 3600 } } as any, 5000, agencySlug);
    if (!res.ok) return null;
    return await res.json();
}

export async function getProperties(
    params?: Record<string, string | undefined>,
    agencySlug?: string | null,
): Promise<PaginatedProperties> {
    try {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '') queryParams.append(key, value);
            });
        }

        const queryString = queryParams.toString();
        const res = await fetchTemplateResponse(
            `/listings${queryString ? `?${queryString}` : ''}`,
            { next: { revalidate: 300 } } as any,
            8000,
            agencySlug,
        );

        if (!res.ok) return { properties: [], total: 0, page: 1, totalPages: 1 };
        const data = await res.json();

        let rawListings = Array.isArray(data) ? data : (data.listings || []);
        let total = data.total || rawListings.length;

        return {
            properties: rawListings.map((listing: any) => mapListingToProperty(listing, agencySlug)),
            total,
            page: data.page || 1,
            totalPages: data.totalPages || 1
        };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { properties: [], total: 0, page: 1, totalPages: 1 };
    }
}

export async function getPropertyById(id: string, agencySlug?: string | null): Promise<Property | null> {
    const res = await fetchTemplateResponse(`/listings/${id}`, { next: { revalidate: 300 } } as any, 8000, agencySlug);
    if (res.ok) {
        const listing = await res.json();
        return mapListingToProperty(listing, agencySlug);
    }

    const fallbackResults = await getProperties({ limit: '200' }, agencySlug);
    return fallbackResults.properties.find((property) => property.id === id) || null;
}

export async function getOrgConfig(agencySlug?: string | null): Promise<{ categories: string[], amenities: string[] }> {
    const snapshot = await getTemplateSiteSnapshot(agencySlug);
    return {
        categories: snapshot?.categories || [],
        amenities: snapshot?.amenities || [],
    };
}

export async function getAreaGuides(agencySlug?: string | null): Promise<any[]> {
    const snapshot = await getTemplateSiteSnapshot(agencySlug);
    return snapshot?.areaGuides || [];
}

export async function getTestimonials(agencySlug?: string | null): Promise<any[]> {
    const snapshot = await getTemplateSiteSnapshot(agencySlug);
    return snapshot?.testimonials || [];
}

export async function getBlogs(agencySlug?: string | null): Promise<any[]> {
    const snapshot = await getTemplateSiteSnapshot(agencySlug);
    return snapshot?.blogs || [];
}

export async function getSellerTestimonials(agencySlug?: string | null): Promise<any[]> {
    const snapshot = await getTemplateSiteSnapshot(agencySlug);
    return snapshot?.sellerTestimonials || [];
}
