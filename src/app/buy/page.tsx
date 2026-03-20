import { Suspense } from 'react';
import { SearchFilters } from "@/components/search-filters";
import { Home } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { PropertyListings } from "@/components/property-listings";
import { getProperties } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface BuyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuyPage(props: BuyPageProps) {
  const searchParams = await props.searchParams;
  // Extract filters to pass to backend API
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined;
  const minArea = typeof searchParams.minArea === 'string' ? searchParams.minArea : undefined;
  const maxArea = typeof searchParams.maxArea === 'string' ? searchParams.maxArea : undefined;
  const types = typeof searchParams.types === 'string' ? searchParams.types : undefined; // e.g., 'Apartment,Villa'
  const bedrooms = typeof searchParams.bedrooms === 'string' ? searchParams.bedrooms : undefined;
  const bathrooms = typeof searchParams.bathrooms === 'string' ? searchParams.bathrooms : undefined;

  const group = typeof searchParams.group === 'string' ? searchParams.group.toUpperCase() : 'RESIDENTIAL';

  const { properties: saleProperties } = await getProperties({
    transactionType: 'SALE',
    propertyType: group,
    q,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    category: types,
    bedrooms,
    bathrooms
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
        <ResultsHeader title="Properties for Sale in Dubai" resultsCount={saleProperties.length}>
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
              <Home className="h-4 w-4" />
              <span>Properties for Sale</span>
          </h1>
        </ResultsHeader>
      </div>
      <Separator />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <PropertyListings properties={saleProperties} />
        {saleProperties.length > 12 && (
          <div className="mt-12 flex justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground rounded-none px-8 py-6 text-base font-semibold">
                  View More
              </Button>
          </div>
        )}
        {saleProperties.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-muted-foreground">No properties found matching your criteria.</h3>
            <Button variant="link" className="mt-4" asChild><a href='/buy'>Clear all filters</a></Button>
          </div>
        )}
      </div>
    </div>
  );
}
