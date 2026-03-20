import { Property } from './types';

// Assuming the API is running locally on port 4000 as per backend configuration.
// In a real production setup, this would be an environment variable.
const API_BASE_URL = (((globalThis as any).process?.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:4000') + '/api';
const ORG_SLUG = 'skyline-realty';

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

/**
 * Maps a backend listing object to the frontend Property type.
 */
function mapListingToProperty(listing: any): Property {
    // Determine purpose from transactionType
    const isRent = listing.transactionType?.toUpperCase() === 'RENT';
    const purpose: 'Buy' | 'Rent' = isRent ? 'Rent' : 'Buy';
    const isCommercial = listing.propertyType?.toUpperCase() === 'COMMERCIAL';

    // Get the original category
    const category = listing.category || 'Apartment';
    
    // Determine propertyGroup and sync purpose
    let propertyGroup: 'Residential' | 'Commercial' = isCommercial ? 'Commercial' : 'Residential';
    
    // Determine type from category
    let type = category; // Default to category name

    // Helper to determine core type for icons/filtering
    const getCoreType = (catName: string): string => {
        const cat = catName.toLowerCase();
        if (cat.includes('villa') || cat.includes('mansion') || cat.includes('bungalow') || cat.includes('compound')) return 'Villa';
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
        type: coreType,
        category,
        propertyGroup,
        purpose,
        status: listing.readiness?.toUpperCase() === 'OFFPLAN' ? 'Off-plan' : 'Ready',
        price: `${listing.currency || 'AED'} ${listing.price?.toLocaleString() || 'POA'}`,
        priceNumeric: parseFloat(listing.price) || 0,
        bedrooms: parseInt(listing.bedrooms) || 0,
        bathrooms: parseInt(listing.bathrooms) || 0,
        areaSqFt: parseFloat(listing.builtUpArea) || parseFloat(listing.size) || parseFloat(listing.areaSqFt) || 0,
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

