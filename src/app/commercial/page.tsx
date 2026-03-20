import { Suspense } from 'react';
import { SearchFilters } from "@/components/search-filters";
import { Building2 } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { UniversalPropertyGrid } from "@/components/universal-property-grid";
import { SearchPageLayout } from "@/components/search-page-layout";
import { ListingSearchFilters } from "@/hooks/use-listing-search";

interface CommercialPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CommercialPage(props: CommercialPageProps) {
  const searchParams = await props.searchParams;
  const purpose = typeof searchParams.purpose === 'string' ? searchParams.purpose.toUpperCase() as any : 'SALE';
  
  const initialFilters: Partial<ListingSearchFilters> = {
    propertyType: 'COMMERCIAL',
    transactionType: purpose === 'RENT' ? 'RENT' : 'SALE',
    q: searchParams.q as string,
    price_min: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    price_max: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    category: (searchParams.types as string) || (searchParams.category as string),
    bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
    bathrooms: searchParams.bathrooms ? Number(searchParams.bathrooms) : undefined,
    sort: searchParams.sort as string || 'newest'
  };

  return (
    <SearchPageLayout initialFilters={initialFilters}>
      <div>
        <div className="bg-background border-b">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <Suspense fallback={<div className="h-16 w-full animate-pulse bg-muted rounded-full" />}>
              <SearchFilters context="page" />
            </Suspense>
          </div>
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ResultsHeader title={`Commercial Properties for ${purpose === 'RENT' ? 'Rent' : 'Sale'}`}>
            <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
              <Building2 className="h-4 w-4" />
              <span>{initialFilters.category ? initialFilters.category : 'Commercial'} for {purpose === 'RENT' ? 'Rent' : 'Sale'}</span>
            </h1>
          </ResultsHeader>
        </div>

        <Separator />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <UniversalPropertyGrid initialPreset={{ propertyType: 'COMMERCIAL', transactionType: purpose === 'RENT' ? 'RENT' : 'SALE' }} />
        </div>
      </div>
    </SearchPageLayout>
  );
}
