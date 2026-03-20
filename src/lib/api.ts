import { Property } from './types';

// Assuming the API is running locally on port 4000 as per backend configuration.
// In a real production setup, this would be an environment variable.
const API_BASE_URL = ((globalThis as any).process?.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:4000/api';
const ORG_SLUG = 'skyline-realty';

/**
 * Maps a backend listing object to the frontend Property type.
 */
function mapListingToProperty(listing: any): Property {
    // Determine purpose from transactionType
    let purpose: 'Buy' | 'Rent' = 'Buy';
    if (listing.transactionType?.toUpperCase() === 'RENT') {
        purpose = 'Rent';
    }

    // Determine type from propertyType
    let type: Property['type'] = 'Apartment';
    const rawType = listing.propertyType?.toUpperCase() || '';
    if (rawType.includes('VILLA')) type = 'Villa';
    else if (rawType.includes('TOWNHOUSE')) type = 'Townhouse';
    else if (rawType.includes('PENTHOUSE')) type = 'Penthouse';
    else if (rawType.includes('PLOT')) type = 'Plot';
    else if (rawType.includes('STUDIO')) type = 'Studio';
    else if (rawType.includes('OFFICE')) type = 'Office';
    else if (rawType.includes('RETAIL')) type = 'Retail';
    else if (rawType.includes('INDUSTRIAL')) type = 'Industrial';

    // Get primary image
    const imageId = (listing.images && listing.images.length > 0) 
        ? listing.images[0].url 
        : 'property-1'; // fallback

    // Map gallery images
    const galleryImageIds = listing.images 
        ? listing.images.map((img: any) => img.url) 
        : [];

    return {
        id: listing.id,
        name: listing.title || 'Untitled Property',
        type,
        purpose,
        status: listing.completionStatus?.toUpperCase() === 'OFF_PLAN' ? 'Off-plan' : 'Ready',
        price: `${listing.currency || 'AED'} ${listing.price?.toLocaleString() || 'POA'}`,
        priceNumeric: parseFloat(listing.price) || 0,
        bedrooms: parseInt(listing.bedrooms) || 0,
        bathrooms: parseInt(listing.bathrooms) || 0,
        areaSqFt: parseFloat(listing.size) || parseFloat(listing.areaSqFt) || 0,
        imageId,
        location: listing.location || listing.area || listing.emirate || 'Dubai',
        description: listing.description || '',
        amenities: listing.amenities ? (Array.isArray(listing.amenities) ? listing.amenities : listing.amenities.split(',')) : [],
        galleryImageIds,
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
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== '') {
                    queryParams.append(key, value);
                }
            }
        }
        
        const queryString = queryParams.toString();
        const url = `${API_BASE_URL}/public/org/${ORG_SLUG}/listings${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
            // Next.js caching optimization
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
        const res = await fetch(`${API_BASE_URL}/public/listing/${id}`, {
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
        const res = await fetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/config`, {
            next: { revalidate: 3600 } // Revalidate config every hour
        } as any);
        if (!res.ok) return { categories: [], amenities: [] };
        return await res.json();
    } catch (error) {
        console.error('Error fetching org config:', error);
        return { categories: [], amenities: [] };
    }
}

export async function getAreaGuides(): Promise<any[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/area-guides`, {
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
        const res = await fetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/testimonials`, {
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
        const res = await fetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/blogs`, {
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
        const res = await fetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/seller-testimonials`, {
            next: { revalidate: 3600 }
        } as any);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching seller testimonials:', error);
        return [];
    }
}

