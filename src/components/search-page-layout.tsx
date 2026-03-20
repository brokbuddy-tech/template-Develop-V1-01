'use client';

import { SearchProvider } from '@/context/search-context';
import { ListingSearchFilters } from '@/hooks/use-listing-search';

interface SearchPageLayoutProps {
    children: React.ReactNode;
    initialFilters?: Partial<ListingSearchFilters>;
}

export function SearchPageLayout({ children, initialFilters }: SearchPageLayoutProps) {
    return (
        <SearchProvider initialFilters={initialFilters}>
            {children}
        </SearchProvider>
    );
}
