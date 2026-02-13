import { SearchFilters } from "@/components/search-filters";

export default function OffPlanPage() {
  return (
    <div>
      <div className="sticky top-16 z-10 py-4 bg-background border-b">
        <div className="container">
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="container py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Off-Plan Properties</h1>
        <p className="text-muted-foreground mb-8">Explore exclusive off-plan investment opportunities in Dubai.</p>

        <div className="mt-8">
          <p className="text-center text-muted-foreground">Off-plan property listings would be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
