import { SearchFilters } from "@/components/search-filters";

export default function BuyPage() {
  return (
    <div>
      <div className="sticky top-16 z-10 py-4 bg-background border-b">
        <div className="container">
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="container py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Properties for Sale</h1>
        <p className="text-muted-foreground mb-8">Find your next home or investment property in Dubai.</p>
        
        <div className="mt-8">
          <p className="text-center text-muted-foreground">Property listings would be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
