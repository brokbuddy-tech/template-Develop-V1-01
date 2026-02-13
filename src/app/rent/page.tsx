import { SearchFilters } from "@/components/search-filters";
import { Key } from "lucide-react";

export default function RentPage() {
  return (
    <div>
      <div className="sticky top-16 z-10 py-4 bg-background border-b">
        <div className="container">
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-2xl tracking-tight mb-4 p-3 rounded-lg">
            <Key className="h-6 w-6" />
            <span>Properties for Rent</span>
          </h1>
          <SearchFilters context="page" />
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
