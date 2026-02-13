import { SearchFilters } from "@/components/search-filters";
import { ClipboardList } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { PropertyListings } from "@/components/property-listings";
import { properties } from "@/lib/data";

export default function OffPlanPage() {
  const offPlanProperties = properties.filter(p => p.status === 'Off-plan');

  return (
    <div>
      <div className="bg-background border-b">
        <div className="container py-4">
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="container">
        <ResultsHeader title="Off-Plan Properties in Dubai" resultsCount={offPlanProperties.length}>
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
            <ClipboardList className="h-4 w-4" />
            <span>Off-Plan Properties</span>
          </h1>
        </ResultsHeader>
      </div>
      <Separator />
      <div className="container py-12">
        <PropertyListings properties={offPlanProperties} />
      </div>
    </div>
  );
}
