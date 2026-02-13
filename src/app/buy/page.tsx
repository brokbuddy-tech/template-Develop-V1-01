import { SearchFilters } from "@/components/search-filters";

export default function BuyPage() {
  return (
    <div>
      <div className="sticky top-16 z-10 py-4 bg-background border-b">
        <div className="container">
          <h1 className="text-2xl font-bold tracking-tight mb-4">Properties for Sale</h1>
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="container py-12">
        <div className="mt-8">
          <p className="text-center text-muted-foreground">Property listings would be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
