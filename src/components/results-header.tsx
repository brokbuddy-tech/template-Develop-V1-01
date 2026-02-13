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

export function ResultsHeader({ title, resultsCount }: { title: string; resultsCount: number }) {
  return (
    <div className="flex justify-between items-center py-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-blue-500">{resultsCount.toLocaleString()} results</p>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-lg">
              <ListFilter className="mr-2 h-4 w-4" />
              Newest
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Newest First</DropdownMenuItem>
            <DropdownMenuItem>Oldest First</DropdownMenuItem>
            <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            <DropdownMenuItem>Area: Small to Large</DropdownMenuItem>
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
