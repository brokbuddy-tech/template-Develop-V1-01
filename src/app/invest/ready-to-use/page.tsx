import { SearchFilters } from "@/components/search-filters";

export default function ReadyToUsePage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Ready to Use Properties</h1>
      <p className="text-muted-foreground mb-8">Find ready-to-move-in properties perfect for investment.</p>
      
      <div className="mb-8">
        <SearchFilters context="page" />
      </div>

      <div className="mt-8">
        <p className="text-center text-muted-foreground">Ready to use property listings would be displayed here.</p>
      </div>
    </div>
  );
}
