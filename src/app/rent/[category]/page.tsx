import { SearchFilters } from '@/components/search-filters';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { ResultsHeader } from "@/components/results-header";
import { UniversalPropertyGrid } from "@/components/universal-property-grid";
import { SearchPageLayout } from "@/components/search-page-layout";
import { ListingSearchFilters } from "@/hooks/use-listing-search";
import { getCategoryFromSlug } from '@/lib/api';

interface CategoryPageProps {
  params: Promise<{ purpose: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const purpose = 'rent';
  const sParams = await searchParams;
  
  const dbCategory = getCategoryFromSlug(categorySlug);
  const transactionType = 'RENT';
  
  const initialFilters: Partial<ListingSearchFilters> = {
    transactionType,
    category: dbCategory || categorySlug,
    q: sParams.q as string,
    price_min: sParams.minPrice ? Number(sParams.minPrice) : undefined,
    price_max: sParams.maxPrice ? Number(sParams.maxPrice) : undefined,
    bedrooms: sParams.bedrooms ? Number(sParams.bedrooms) : undefined,
    bathrooms: sParams.bathrooms ? Number(sParams.bathrooms) : undefined,
    sort: sParams.sort as string || 'newest'
  };

  const displayPurpose = purpose.charAt(0).toUpperCase() + purpose.slice(1);
  const displayCategory = dbCategory + (dbCategory.endsWith('s') ? '' : 's');

  return (
    <SearchPageLayout initialFilters={initialFilters}>
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
            <ResultsHeader title={`${displayCategory} for ${displayPurpose}`}>
              <h1 className="text-3xl font-bold mb-4">
                {displayCategory} for {displayPurpose}
              </h1>
            </ResultsHeader>
            <SearchFilters context="page" />
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
            <UniversalPropertyGrid initialPreset={{ transactionType, category: dbCategory || categorySlug }} />
        </div>
      </main>
    </SearchPageLayout>
  );
}
