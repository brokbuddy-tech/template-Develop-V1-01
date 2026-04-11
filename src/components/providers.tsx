"use client";

import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SearchProvider } from '@/context/search-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes — reduces API call frequency
        gcTime: 30 * 60 * 1000, // 30 minutes — keeps cached data longer
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <SearchProvider>
          {children}
        </SearchProvider>
      </Suspense>
    </QueryClientProvider>
  );
}
