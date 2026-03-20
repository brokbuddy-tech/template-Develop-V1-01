
'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ListFilter, Building } from 'lucide-react';
import { AreaGuidesPopup } from './area-guides-popup';
import type { ReactNode } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function ResultsHeader({ children, title, resultsCount }: { children?: ReactNode; title: string; resultsCount: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortValue);
    router.push(`${pathname}?${params.toString()}`);
  };

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Area: Small to Large', value: 'area-asc' },
  ];

  const activeSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Newest';

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 py-4">
      <div className="text-center sm:text-left">
        {children}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-blue-500">{resultsCount.toLocaleString()} results</p>
      </div>
      <div className="flex items-center gap-2 self-center sm:self-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-lg">
              <ListFilter className="mr-2 h-4 w-4" />
              {activeSortLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((opt) => (
              <DropdownMenuItem key={opt.value} onClick={() => handleSortChange(opt.value)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-lg">
              <Building className="mr-2 h-4 w-4" />
              Area Guides
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl p-0">
             <AreaGuidesPopup />
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
