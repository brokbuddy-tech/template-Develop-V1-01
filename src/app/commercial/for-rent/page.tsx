import { Suspense } from 'react';
import { SearchFilters } from "@/components/search-filters";
import { Building2 } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { UniversalPropertyGrid } from "@/components/universal-property-grid";
import { SearchPageLayout } from "@/components/search-page-layout";
import { ListingSearchFilters } from "@/hooks/use-listing-search";

export default function CommercialForRentPage() {
  const initialFilters: Partial<ListingSearchFilters> = {
    propertyType: 'COMMERCIAL',
    transactionType: 'RENT',
    sort: 'newest'
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
          <ResultsHeader title="Commercial Properties for Rent in Dubai">
            <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
              <Building2 className="h-4 w-4" />
              <span>Commercial for Rent</span>
            </h1>
          </ResultsHeader>
        </div>
        <Separator />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <UniversalPropertyGrid initialPreset={{ propertyType: 'COMMERCIAL', transactionType: 'RENT' }} />
        </div>
      </div>
    </SearchPageLayout>
  );
}
