'use client';
import { PropertyCard } from '@/components/property-card';
import type { Property } from '@/lib/types';

interface PropertyListingsProps {
    properties: Property[];
}

export function PropertyListings({ properties }: PropertyListingsProps) {
  if (!properties || properties.length === 0) {
    return <div className="text-center text-muted-foreground py-16">No properties found matching your criteria.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
