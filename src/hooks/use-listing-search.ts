'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchContext } from '@/context/search-context';

export interface ListingSearchFilters {
  // Tier 1
  transactionType?: 'SALE' | 'RENT';
  propertyType?: 'RESIDENTIAL' | 'COMMERCIAL';
  category?: string;
  readiness?: 'READY' | 'OFFPLAN';
  emirate?: string;
  area?: string;
  subArea?: string;
  price_min?: number;
  price_max?: number;
  pricePerSqft_min?: number;
  pricePerSqft_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  builtUpArea_min?: number;
  builtUpArea_max?: number;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;

  // Tier 2
  ownershipTenureType?: string;
  ownershipType?: string;
  developerName?: string;
  developerId?: string;
  towerOrBuilding?: string;
  zoningAuthority?: string;
  serviceCharges_min?: number;
  serviceCharges_max?: number;
  remainingLeaseYears_min?: number;
  remainingLeaseYears_max?: number;
  lqsScore_min?: number;
  commissionStructureType?: string;

  // Tier 3a - Off-plan
  constructionStatus?: string;
  expectedCompletion?: string;
  hasPostHandover?: boolean;
  downPaymentMax?: number;

  // Tier 3b - Compliance
  hasPermitNumber?: boolean;
  hasReraNumber?: boolean;
  hasTitleDeed?: boolean;
  hasOqood?: boolean;
  hasRegulatoryData?: boolean;

  // Tier 4 - Geo & Media
  lat?: number;
  lng?: number;
  radius?: number;
  hasFloorPlan?: boolean;
  hasVideo?: boolean;
  imageCount_min?: number;

  // Search
  q?: string;
  orgSlug?: string;
}

interface UseListingSearchOptions {
  defaults?: ListingSearchFilters;
  orgSlug?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function useListingSearch({ defaults = {}, orgSlug }: UseListingSearchOptions = {}) {
  const { filters, updateFilter, setFilters, resetFilters } = useSearchContext();
  const [debouncedFilters, setDebouncedFilters] = useState<ListingSearchFilters>(filters);

  // Initialize defaults on component mount if provided
  useEffect(() => {
    if (Object.keys(defaults).length > 0) {
      setFilters(defaults);
    }
  }, []); // Only on mount

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);

    return () => clearTimeout(handler);
  }, [filters]);

  const fetchListings = async (appliedFilters: ListingSearchFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/listings/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['listings', debouncedFilters],
    queryFn: () => fetchListings(debouncedFilters),
  });

  return {
    listings: data?.data || [],
    meta: data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 },
    isLoading,
    isFetching,
    error,
    filters,
    updateFilter,
    setFilters,
    resetFilters: () => resetFilters(defaults),
    refetch,
  };
}
