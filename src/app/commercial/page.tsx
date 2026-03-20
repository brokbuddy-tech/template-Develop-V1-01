import { Suspense } from 'react';
import { SearchFilters } from "@/components/search-filters";
import { Building2 } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { PropertyListings } from "@/components/property-listings";
import { getProperties } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface CommercialPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CommercialPage(props: CommercialPageProps) {
  const searchParams = await props.searchParams;
  // Extract filters
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined;
  const minArea = typeof searchParams.minArea === 'string' ? searchParams.minArea : undefined;
  const maxArea = typeof searchParams.maxArea === 'string' ? searchParams.maxArea : undefined;
  const types = typeof searchParams.types === 'string' ? searchParams.types : undefined;
  const purpose = typeof searchParams.purpose === 'string' ? searchParams.purpose.toUpperCase() : 'SALE';

  const { properties: commercialProperties } = await getProperties({
    transactionType: purpose === 'RENT' ? 'RENT' : 'SALE',
    propertyType: 'COMMERCIAL',
    q,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    category: types || (typeof searchParams.category === 'string' ? searchParams.category : undefined),
  });

  return (
    <div>
      <div className="bg-background border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <Suspense fallback={<div className="h-16 w-full animate-pulse bg-muted rounded-full" />}>
            <SearchFilters context="page" />
          </Suspense>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ResultsHeader title={`Commercial Properties for ${purpose === 'RENT' ? 'Rent' : 'Sale'}`} resultsCount={commercialProperties.length}>
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
            <Building2 className="h-4 w-4" />
            <span>{types ? types : 'Commercial'} for {purpose === 'RENT' ? 'Rent' : 'Sale'}</span>
          </h1>
        </ResultsHeader>
      </div>
      <Separator />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <PropertyListings properties={commercialProperties} />
        {commercialProperties.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-muted-foreground">No commercial properties found matching your criteria.</h3>
            <Button variant="link" className="mt-4" asChild><a href='/commercial'>Clear all filters</a></Button>
          </div>
        )}
      </div>
    </div>
  );
}
