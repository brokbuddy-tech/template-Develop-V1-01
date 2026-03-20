import { getProperties } from '@/lib/api';
import { PropertyCard } from '@/components/property-card';
import { SearchFilters } from '@/components/search-filters';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ purpose: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { purpose, category: categorySlug } = await params;
  const sParams = await searchParams;
  const { getCategoryFromSlug } = await import('@/lib/api');

  const dbCategory = getCategoryFromSlug(categorySlug);

  const transactionType = purpose.toLowerCase() === 'rent' ? 'RENT' : 'SALE';

  const { properties } = await getProperties({
    transactionType,
    category: dbCategory,
    q: typeof sParams.q === 'string' ? sParams.q : undefined,
    minPrice: typeof sParams.minPrice === 'string' ? sParams.minPrice : undefined,
    maxPrice: typeof sParams.maxPrice === 'string' ? sParams.maxPrice : undefined,
    bedrooms: typeof sParams.bedrooms === 'string' ? sParams.bedrooms : undefined,
    bathrooms: typeof sParams.bathrooms === 'string' ? sParams.bathrooms : undefined,
    minArea: typeof sParams.minArea === 'string' ? sParams.minArea : undefined,
    maxArea: typeof sParams.maxArea === 'string' ? sParams.maxArea : undefined,
  });

  const displayPurpose = purpose.charAt(0).toUpperCase() + purpose.slice(1);
  const displayCategory = dbCategory + (dbCategory.endsWith('s') ? '' : 's');

  return (
    <main className="min-h-screen bg-slate-100 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/${purpose}`} className="hover:text-primary transition-colors capitalize">
            {displayPurpose}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{displayCategory}</span>
        </div>
      </div>

      {/* Hero / Filter Section */}
      <div className="bg-white border-b py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">
            {displayCategory} for {displayPurpose}
          </h1>
          <SearchFilters context="page" />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Found <span className="font-semibold text-foreground">{properties.length}</span> {displayCategory.toLowerCase()}
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-slate-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No Properties Found</h2>
              <p className="text-muted-foreground mb-8">
                We couldn't find any {displayCategory.toLowerCase()} matching your current filters in {displayPurpose}. 
                Try adjusting your search criteria.
              </p>
              <Button asChild>
                <Link href={`/${purpose}`}>View All {displayPurpose} Properties</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
