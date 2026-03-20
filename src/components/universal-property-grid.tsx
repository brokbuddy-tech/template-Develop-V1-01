'use client';

import { useListingSearch, ListingSearchFilters } from '@/hooks/use-listing-search';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface UniversalPropertyGridProps {
    initialPreset?: Partial<ListingSearchFilters>;
}

export function UniversalPropertyGrid({ initialPreset }: UniversalPropertyGridProps) {
    const { listings, meta, isLoading, filters, updateFilter, resetFilters } = useListingSearch({
        defaults: initialPreset
    });

    const properties = listings || [];
    const total = meta.total || 0;
    const page = filters.page || 1;
    const limit = filters.limit || 12;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-muted">
                <h3 className="text-xl font-semibold text-muted-foreground">No properties found matching your criteria.</h3>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters to see more results.</p>
                <Button variant="link" className="mt-4" onClick={() => resetFilters()}>Clear all filters</Button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property: any) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>

            {total > (page * limit) && (
                <div className="flex justify-center mt-12 pb-12">
                    <Button 
                        size="lg" 
                        variant="default"
                        className="bg-primary text-primary-foreground rounded-full px-12 py-6 text-base font-bold hover:scale-105 transition-transform"
                        onClick={() => updateFilter('page', (page || 1) + 1)}
                    >
                        Load More Properties
                    </Button>
                </div>
            )}
        </div>
    );
}
