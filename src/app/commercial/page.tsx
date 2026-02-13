import { SearchFilters } from "@/components/search-filters";

export default function CommercialPage() {
  return (
    <div>
      <div className="sticky top-16 z-10 py-4 bg-background border-b">
        <div className="container">
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="container py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Commercial Properties</h1>
        <p className="text-muted-foreground mb-8">Explore commercial real estate opportunities across Dubai.</p>
        
        <div className="mt-8">
          <p className="text-center text-muted-foreground">Commercial property listings would be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
