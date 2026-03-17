import { SearchFilters } from "@/components/search-filters";
import { Home } from "lucide-react";
import { ResultsHeader } from "@/components/results-header";
import { Separator } from "@/components/ui/separator";
import { PropertyListings } from "@/components/property-listings";
import { getProperties } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface BuyPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const allProperties = await getProperties();
  
  // Extract filters
  const q = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
  const minPrice = Number(searchParams.minPrice) || 0;
  const maxPrice = Number(searchParams.maxPrice) || Infinity;
  const minArea = Number(searchParams.minArea) || 0;
  const maxArea = Number(searchParams.maxArea) || Infinity;
  const types = typeof searchParams.types === 'string' ? searchParams.types.split(',') : [];
  const bedrooms = typeof searchParams.bedrooms === 'string' ? searchParams.bedrooms : '';
  const bathrooms = typeof searchParams.bathrooms === 'string' ? searchParams.bathrooms : '';

  const saleProperties = allProperties.filter(p => {
    // Base filter: Buy purpose and non-commercial
    if (p.purpose !== 'Buy' || p.type === 'Office' || p.type === 'Retail' || p.type === 'Industrial') return false;

    // Search query filter
    if (q && !(
        p.name.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
    )) return false;

    // Price range filter
    if (p.priceNumeric < minPrice || p.priceNumeric > maxPrice) return false;

    // Area range filter
    if (p.areaSqFt < minArea || p.areaSqFt > maxArea) return false;

    // Property types filter
    if (types.length > 0 && !types.includes(p.type)) return false;

    // Bedrooms filter
    if (bedrooms) {
        if (bedrooms === 'Studio' && p.bedrooms !== 0) return false;
        if (bedrooms === '5+' && p.bedrooms < 5) return false;
        if (bedrooms !== 'Studio' && bedrooms !== '5+' && p.bedrooms !== Number(bedrooms)) return false;
    }

    // Bathrooms filter
    if (bathrooms) {
        if (bathrooms === '5+' && p.bathrooms < 5) return false;
        if (bathrooms !== '5+' && p.bathrooms !== Number(bathrooms)) return false;
    }

    return true;
  });

  return (
    <div>
      <div className="bg-background border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <SearchFilters context="page" />
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ResultsHeader title="Properties for Sale in Dubai" resultsCount={saleProperties.length}>
          <h1 className="bg-muted inline-flex items-center gap-2 text-foreground font-bold text-base tracking-tight mb-4 p-3 rounded-lg">
              <Home className="h-4 w-4" />
              <span>Properties for Sale</span>
          </h1>
        </ResultsHeader>
      </div>
      <Separator />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <PropertyListings properties={saleProperties} />
        {saleProperties.length > 12 && (
          <div className="mt-12 flex justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground rounded-none px-8 py-6 text-base font-semibold">
                  View More
              </Button>
          </div>
        )}
        {saleProperties.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-muted-foreground">No properties found matching your criteria.</h3>
            <Button variant="link" className="mt-4" onClick={() => window.location.href='/buy'}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
