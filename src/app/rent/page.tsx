import { SearchFilters } from "@/components/search-filters";
import { Key } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { PropertyListings } from "@/components/property-listings";
import { properties } from "@/lib/data";

export default function RentPage() {
  const rentProperties = properties.filter(p => p.purpose === 'Rent' && (p.type !== 'Office' && p.type !== 'Retail' && p.type !== 'Industrial'));

  return (
    <div>
      <div className="bg-background border-b">
        <div className="container py-4">
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="container">
        <ResultsHeader title="Properties for Rent in Dubai" resultsCount={rentProperties.length}>
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
            <Key className="h-4 w-4" />
            <span>Properties for Rent</span>
          </h1>
        </ResultsHeader>
      </div>
      <Separator />
      <div className="container py-12">
        <PropertyListings properties={rentProperties} />
      </div>
    </div>
  );
}
