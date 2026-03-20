import { Suspense } from 'react';
import { SearchFilters } from "@/components/search-filters";
import { CircleCheck } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { UniversalPropertyGrid } from "@/components/universal-property-grid";
import { SearchPageLayout } from "@/components/search-page-layout";
import { ListingSearchFilters } from "@/hooks/use-listing-search";

export default function ReadyToUsePage() {
  const initialFilters: Partial<ListingSearchFilters> = {
    readiness: 'READY',
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
          <ResultsHeader title="Ready to Use Properties in Dubai">
            <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
              <CircleCheck className="h-4 w-4" />
              <span>Ready to Use Properties</span>
            </h1>
          </ResultsHeader>
        </div>
        <Separator />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <UniversalPropertyGrid initialPreset={{ readiness: 'READY' }} />
        </div>
      </div>
    </SearchPageLayout>
  );
}
