import { SearchFilters } from "@/components/search-filters";
import { Home } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { PropertyListings } from "@/components/property-listings";
import { properties } from "@/lib/data";

export default function BuyPage() {
  const saleProperties = properties.filter(p => p.purpose === 'Buy' && (p.type !== 'Office' && p.type !== 'Retail' && p.type !== 'Industrial'));

  return (
    <div>
      <div className="sticky top-16 z-10 bg-background border-b">
        <div className="container py-4">
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
            <Home className="h-4 w-4" />
            <span>Properties for Sale</span>
          </h1>
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="container">
        <ResultsHeader title="Properties for Sale in Dubai" resultsCount={saleProperties.length} />
      </div>
      <Separator />
      <div className="container py-12">
        <PropertyListings properties={saleProperties} />
      </div>
    </div>
  );
}
