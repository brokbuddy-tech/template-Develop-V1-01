import { SearchFilters } from "@/components/search-filters";
import { Key } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";

export default function RentPage() {
  return (
    <div>
      <div className="sticky top-16 z-10 bg-background border-b">
        <div className="container py-4">
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
            <Key className="h-4 w-4" />
            <span>Properties for Rent</span>
          </h1>
          <SearchFilters context="page" />
        </div>
        <Separator />
        <div className="container">
          <ResultsHeader title="Properties for Rent in Dubai" resultsCount={4321} />
        </div>
      </div>
      <div className="container py-12">
        <div className="mt-8">
          <p className="text-center text-muted-foreground">Rental listings would be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
