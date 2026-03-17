
import { Map as MapIcon } from "lucide-react";
import { Suspense } from 'react';
import { SearchFilters } from "@/components/search-filters";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";

export default function MapPage() {
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
        <ResultsHeader title="Properties in Dubai" resultsCount={10987}>
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
            <MapIcon className="h-4 w-4" />
            <span>Search by Map</span>
          </h1>
        </ResultsHeader>
      </div>
      <Separator />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative aspect-video bg-card border border-border flex flex-col items-center justify-center">
          <MapIcon className="w-24 h-24 text-muted-foreground/20" />
          <p className="mt-4 text-2xl font-semibold text-muted-foreground">Interactive Map Coming Soon</p>
          <p className="text-muted-foreground">Real-time price heatmaps and visual property search.</p>
        </div>
      </div>
    </div>
  );
}
