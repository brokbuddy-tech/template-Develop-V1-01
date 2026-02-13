import { Map as MapIcon, Map } from "lucide-react";
import { SearchFilters } from "@/components/search-filters";

export default function MapPage() {
  return (
    <div>
      <div className="sticky top-16 z-10 py-4 bg-background border-b">
        <div className="container">
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-2xl tracking-tight mb-4 p-3 rounded-lg">
            <Map className="h-6 w-6" />
            <span>Search by Map</span>
          </h1>
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="container py-12">
        <div className="relative aspect-video bg-card border border-border flex flex-col items-center justify-center">
          <MapIcon className="w-24 h-24 text-muted-foreground/20" />
          <p className="mt-4 text-2xl font-semibold text-muted-foreground">Interactive Map Coming Soon</p>
          <p className="text-muted-foreground">Real-time price heatmaps and visual property search.</p>
        </div>
      </div>
    </div>
  );
}
