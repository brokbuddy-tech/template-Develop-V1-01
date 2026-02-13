import { Map as MapIcon } from "lucide-react";
import { SearchFilters } from "@/components/search-filters";

export default function MapPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Search by Map</h1>
      <p className="text-muted-foreground mb-8">Visualize Dubai's real estate market with our interactive map.</p>
      
      <div className="mb-8">
        <SearchFilters context="page" />
      </div>

      <div className="relative aspect-video bg-card border border-border flex flex-col items-center justify-center">
        <MapIcon className="w-24 h-24 text-muted-foreground/20" />
        <p className="mt-4 text-2xl font-semibold text-muted-foreground">Interactive Map Coming Soon</p>
        <p className="text-muted-foreground">Real-time price heatmaps and visual property search.</p>
      </div>
    </div>
  );
}
