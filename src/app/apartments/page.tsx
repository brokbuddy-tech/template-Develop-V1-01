import { Suspense } from 'react';
import { SearchFilters } from "@/components/search-filters";
import { Building2 } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { UniversalPropertyGrid } from "@/components/universal-property-grid";
import { SearchPageLayout } from "@/components/search-page-layout";
import { ListingSearchFilters } from "@/hooks/use-listing-search";

interface ApartmentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ApartmentsPage(props: ApartmentsPageProps) {
  const searchParams = await props.searchParams;
  
  const initialFilters: Partial<ListingSearchFilters> = {
    category: 'Apartment',
    q: searchParams.q as string,
    price_min: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    price_max: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
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
          <ResultsHeader title="Apartments in Dubai">
            <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
              <Building2 className="h-4 w-4" />
              <span>Apartments</span>
            </h1>
          </ResultsHeader>
        </div>

        <Separator />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <UniversalPropertyGrid initialPreset={{ category: 'Apartment' }} />
        </div>
      </div>
    </SearchPageLayout>
  );
}
