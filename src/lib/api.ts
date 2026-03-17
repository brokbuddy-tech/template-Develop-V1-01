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

export async function getProperties(): Promise<Property[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/public/org/${ORG_SLUG}/listings`, {
            // Next.js caching optimization
            next: { revalidate: 60 } 
        } as any);

        if (!res.ok) {
            console.error('Failed to fetch listings:', await res.text());
            return [];
        }

        const data = await res.json();
        if (!Array.isArray(data)) return [];

        return data.map(mapListingToProperty);
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
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
