'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ListingSearchFilters } from '@/hooks/use-listing-search';
import { usePathname, useSearchParams } from 'next/navigation';

interface SearchContextType {
  filters: ListingSearchFilters;
  updateFilter: (key: keyof ListingSearchFilters, value: any) => void;
  setFilters: (newFilters: Partial<ListingSearchFilters>) => void;
  resetFilters: (defaults?: ListingSearchFilters) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ 
    children, 
    initialFilters 
}: { 
    children: React.ReactNode, 
    initialFilters?: Partial<ListingSearchFilters> 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFiltersState] = useState<ListingSearchFilters>(() => ({
    page: 1,
    limit: 12,
    sort: 'newest',
    ...initialFilters
  }));

  // Simplified sync with URL for the initial state or major changes
  useEffect(() => {
    // Only sync if we haven't synced yet or if it's a major navigation 
    // Usually, useListingSearch handles the URL rebuilding, 
    // but the global state needs to know about it too if multiple components use it.
  }, [pathname, searchParams]);

  const updateFilter = useCallback((key: keyof ListingSearchFilters, value: any) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  }, []);

  const setFilters = useCallback((newFilters: Partial<ListingSearchFilters>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  }, []);

  const resetFilters = useCallback((defaults: ListingSearchFilters = {}) => {
    setFiltersState({
      page: 1,
      limit: 20,
      sort: 'newest',
      ...defaults
    });
  }, []);

  return (
    <SearchContext.Provider value={{ filters, updateFilter, setFilters, resetFilters }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
