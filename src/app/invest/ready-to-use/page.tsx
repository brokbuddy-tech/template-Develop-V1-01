
import { SearchFilters } from "@/components/search-filters";
import { CheckCircle } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { PropertyListings } from "@/components/property-listings";
import { properties } from "@/lib/data";

export default function ReadyToUsePage() {
  const readyProperties = properties.filter(p => p.status === 'Ready');

  return (
    <div>
      <div className="bg-background border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ResultsHeader title="Ready to Use Properties in Dubai" resultsCount={readyProperties.length}>
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span>Ready to Use Properties</span>
          </h1>
        </ResultsHeader>
      </div>
      <Separator />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <PropertyListings properties={readyProperties} />
      </div>
    </div>
  );
}
