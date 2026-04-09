
import { Map as MapIcon } from "lucide-react";
import { Suspense } from 'react';
import { SearchFilters } from "@/components/search-filters";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { SearchPageLayout } from "@/components/search-page-layout";
import { PropertyMapExplorer } from "@/components/property-map-explorer";
import { ORG_SLUG } from "@/lib/api";

export default function MapPage() {
  return (
    <SearchPageLayout initialFilters={{ orgSlug: ORG_SLUG, limit: 100 }}>
      <div>
        <div className="bg-background border-b">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <Suspense fallback={<div className="h-16 w-full animate-pulse bg-muted rounded-full" />}>
              <SearchFilters context="page" />
            </Suspense>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ResultsHeader title="Properties in Dubai">
            <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
              <MapIcon className="h-4 w-4" />
              <span>Search by Map</span>
            </h1>
          </ResultsHeader>
        </div>

        <Separator />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <PropertyMapExplorer />
        </div>
      </div>
    </SearchPageLayout>
  );
}
