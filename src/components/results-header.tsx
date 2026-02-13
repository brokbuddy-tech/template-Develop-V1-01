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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ListFilter, Building, Search } from 'lucide-react';
import Link from 'next/link';

const dubaiAreas = ["Downtown", "Palm Jumeirah", "Dubai Marina", "Dubai Hills Estate", "Business Bay"];
const abuDhabiAreas = ["Yas Island", "Saadiyat Island", "Al Reem Island"];
const northernEmiratesAreas = ["Sharjah (Aljada)", "Ras Al Khaimah (Al Marjan Island)"];

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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Explore Area Guides</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for a neighborhood..." className="pl-10" />
            </div>
            <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
              <div>
                <h4 className="font-semibold mb-2">Dubai</h4>
                <div className="grid grid-cols-2 gap-2">
                  {dubaiAreas.map(area => <Link key={area} href="#" className="text-sm text-muted-foreground hover:text-foreground hover:underline">{area}</Link>)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Abu Dhabi</h4>
                <div className="grid grid-cols-2 gap-2">
                  {abuDhabiAreas.map(area => <Link key={area} href="#" className="text-sm text-muted-foreground hover:text-foreground hover:underline">{area}</Link>)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Northern Emirates</h4>
                <div className="grid grid-cols-2 gap-2">
                  {northernEmiratesAreas.map(area => <Link key={area} href="#" className="text-sm text-muted-foreground hover:text-foreground hover:underline">{area}</Link>)}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
