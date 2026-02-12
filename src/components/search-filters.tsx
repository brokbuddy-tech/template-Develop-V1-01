'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SearchFilters() {
  return (
    <div className="dark bg-background/80 backdrop-blur-sm p-4 w-full max-w-4xl mx-auto rounded-lg">
      <Tabs defaultValue="manual-search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual-search">
            <Search className="mr-2 h-4 w-4" />
            Manual Search
          </TabsTrigger>
          <TabsTrigger value="ai-search" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Search with AI
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual-search">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-4">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
              </SelectContent>
            </Select>

            <Input type="text" placeholder="Area (e.g., Downtown)" className="md:col-span-1" />

            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Up to 1M AED</SelectItem>
                <SelectItem value="1m-3m">1M - 3M AED</SelectItem>
                <SelectItem value="3m-5m">3M - 5M AED</SelectItem>
                <SelectItem value="5m+">5M+ AED</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bed</SelectItem>
                <SelectItem value="2">2 Beds</SelectItem>
                <SelectItem value="3">3 Beds</SelectItem>
                <SelectItem value="4+">4+ Beds</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full bg-primary text-primary-foreground">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="ai-search">
            <div className="flex gap-2 mt-4">
              <Input type="text" placeholder="Describe your dream property... (e.g. 'a 3 bedroom villa with a private pool in Dubai Hills')" className="flex-1" />
              <Button className="w-auto bg-primary text-primary-foreground">
                <Sparkles className="mr-2 h-4 w-4" />
                Find My Property
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">Let our AI find the perfect match for you.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
