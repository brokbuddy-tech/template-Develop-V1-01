'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Sparkles, Search, ChevronDown, SlidersHorizontal, Crown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import { getOrgConfig, PROPERTY_TYPES_MAPPING } from '@/lib/api';

// Property types and amenities will be fetched from the backend config
// const propertyTypes = ["Apartment", "Villa", "Penthouse", "Townhouse", "Duplex", "Office", "Warehouse", "Plot"];
// const amenitiesList = [
//   "Swimming Pool", "Gym", "Private Garden", "Beach Access",
//   "Covered Parking", "Maids Room", "Concierge", "Pet Friendly",
//   "High-speed Elevators", "Shell & Core", "Fitted"
// ];

import { useListingSearch } from '@/hooks/use-listing-search';

interface SearchFiltersProps {
  context?: 'hero' | 'page';
}

export function SearchFilters({ context = 'hero' }: SearchFiltersProps) {
    const router = useRouter();
    const { filters, updateFilter, setFilters, resetFilters } = useListingSearch();

    const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
    const [amenitiesList, setAmenitiesList] = useState<string[]>([]);

    // Fetch config on mount
    useEffect(() => {
        getOrgConfig().then(config => {
            if (config.categories?.length) setPropertyTypes(config.categories);
            if (config.amenities?.length) setAmenitiesList(config.amenities);
        });
    }, []);

    // Derived UI state
    const purpose = filters.transactionType?.toLowerCase() || 'buy';
    const propertyGroup = filters.propertyType?.toLowerCase() || 'residential';
    const search = filters.q || '';
    const selectedCategory = filters.category || '';
    const selectedTypes = filters.category?.split(',') || [];
    const minPrice = filters.price_min?.toString() || '';
    const maxPrice = filters.price_max?.toString() || '';
    const minArea = filters.builtUpArea_min?.toString() || '';
    const maxArea = filters.builtUpArea_max?.toString() || '';
    const bedrooms = filters.bedrooms !== undefined ? (filters.bedrooms === 0 ? 'Studio' : (filters.bedrooms >= 5 ? '5+' : filters.bedrooms.toString())) : '';
    const bathrooms = filters.bathrooms !== undefined ? (filters.bathrooms >= 5 ? '5+' : filters.bathrooms.toString()) : '';

    const handlePurposeChange = (val: string) => {
        updateFilter('transactionType', val === 'rent' ? 'RENT' : 'SALE');
    };

    const handleCategoryChange = (val: string) => {
        updateFilter('category', val === 'ALL' || val === '' ? undefined : val);
    };

    const handleSearch = () => {
        if (context === 'hero') {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '') params.set(k, v.toString());
            });
            router.push(`/search?${params.toString()}`);
        }
    };

    const handleReset = () => {
        resetFilters();
        if (context === 'hero') router.push('/');
    };

    const toggleType = (type: string) => {
        const next = selectedTypes.includes(type) 
            ? selectedTypes.filter(t => t !== type) 
            : [...selectedTypes, type];
        updateFilter('category', next.length > 0 ? next.join(',') : undefined);
    };

    const toggleAmenity = (amenity: string) => {
        // Amenities logic... currently not mapped in Tier 1 schema but can use 'q' or add to schema
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Tabs defaultValue="manual-search" className="w-full">
                <TabsContent value="manual-search">
                    <div className="bg-white p-2 rounded-full shadow-lg focus-within:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Residential/Commercial Toggle */}
                            <Tabs 
                                value={propertyGroup} 
                                onValueChange={(v) => {
                                    updateFilter('propertyType', v === 'commercial' ? 'COMMERCIAL' : 'RESIDENTIAL');
                                }}
                                className="hidden md:block"
                            >
                                <TabsList className="bg-muted p-1 rounded-full">
                                    <TabsTrigger value="residential" className="rounded-full text-xs px-3 py-1">Residential</TabsTrigger>
                                    <TabsTrigger value="commercial" className="rounded-full text-xs px-3 py-1">Commercial</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Separator orientation="vertical" className="h-6 hidden md:block" />

                            {/* Purpose Select */}
                            <Select value={purpose} onValueChange={handlePurposeChange}>
                                <SelectTrigger className="w-auto text-foreground md:w-[120px] font-bold focus:ring-0 border-0 focus:ring-offset-0 h-auto py-3 pl-4 pr-2 text-base">
                                    <SelectValue placeholder="Purpose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="buy">Buy</SelectItem>
                                    <SelectItem value="rent">Rent</SelectItem>
                                    {propertyGroup === 'residential' && <SelectItem value="off-plan">Off-Plan</SelectItem>}
                                </SelectContent>
                            </Select>
                            
                            <Separator orientation="vertical" className="h-6" />

                            {/* Search Input */}
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search by Area, Building, or Community..."
                                    className="w-full text-foreground bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-auto py-3"
                                    value={search}
                                    onChange={(e) => updateFilter('q', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <Separator orientation="vertical" className="h-6 hidden sm:block" />

                            {/* Category Select */}
                            <Select 
                                value={selectedTypes.length > 1 ? 'MULTIPLE' : (selectedCategory || 'ALL')} 
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="w-auto text-foreground md:w-[150px] font-bold focus:ring-0 border-0 focus:ring-offset-0 h-auto py-3 pl-4 pr-2 text-base">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Categories</SelectItem>
                                    {selectedTypes.length > 1 && <SelectItem value="MULTIPLE">Multiple Selected</SelectItem>}
                                    {propertyTypes
                                        .filter(type => {
                                            const key = `${propertyGroup === 'commercial' ? 'Commercial' : 'Residential'}_${purpose === 'rent' ? 'Rent' : 'Sell'}`;
                                            const validTypes = PROPERTY_TYPES_MAPPING[key] || [];
                                            return validTypes.includes(type);
                                        })
                                        .map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>

                            <Separator orientation="vertical" className="h-6 hidden sm:block" />

                            {/* Filters */}
                            <div className="hidden sm:flex items-center gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="text-muted-foreground rounded-full font-bold">
                                            Price
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 p-4 space-y-4">
                                        <div className='px-2'>
                                            <Label className="font-bold">Price Range (AED)</Label>
                                            <div className="flex gap-2 mt-2">
                                                <Input 
                                                    placeholder="Min" 
                                                    type="number" 
                                                    value={minPrice}
                                                    onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                                <Input 
                                                    placeholder="Max" 
                                                    type="number" 
                                                    value={maxPrice}
                                                    onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <div className="grid grid-cols-2 gap-2 text-sm px-2">
                                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => updateFilter('price_max', 1000000)}>Up to 1M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => { updateFilter('price_min', 1000000); updateFilter('price_max', 3000000); }}>1M - 3M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => { updateFilter('price_min', 3000000); updateFilter('price_max', 5000000); }}>3M - 5M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => { updateFilter('price_min', 5000000); updateFilter('price_max', undefined); }}>5M+</Button>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Separator orientation="vertical" className="h-6" />

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="text-muted-foreground rounded-full font-bold">
                                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                                            Filters
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>All Filters</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-8 py-4 max-h-[60vh] overflow-y-auto px-2">
                                            <div>
                                                <h4 className="font-semibold mb-4 text-lg">Area (Sq. Ft.)</h4>
                                                <div className="flex gap-2">
                                                    <Input 
                                                        placeholder="Min Area" 
                                                        type="number" 
                                                        value={minArea}
                                                        onChange={(e) => updateFilter('builtUpArea_min', e.target.value ? Number(e.target.value) : undefined)}
                                                    />
                                                    <Input 
                                                        placeholder="Max Area" 
                                                        type="number" 
                                                        value={maxArea}
                                                        onChange={(e) => updateFilter('builtUpArea_max', e.target.value ? Number(e.target.value) : undefined)}
                                                    />
                                                </div>
                                            </div>
                                            <Separator/>
                                            <div>
                                                <h4 className="font-semibold mb-4 text-lg">Beds & Baths</h4>
                                                <div className='space-y-4'>
                                                    <div>
                                                        <Label>Bedrooms</Label>
                                                        <div className="flex gap-2 p-2 rounded-lg bg-muted mt-2">
                                                            {['Studio', '1', '2', '3', '4', '5+'].map(b => (
                                                                <Button 
                                                                    key={b} 
                                                                    variant={bedrooms === b ? "default" : "outline"}
                                                                    size="sm" 
                                                                    className="flex-1 bg-background"
                                                                    onClick={() => {
                                                                        const val = bedrooms === b ? undefined : (b === 'Studio' ? 0 : (b === '5+' ? 5 : Number(b)));
                                                                        updateFilter('bedrooms', val);
                                                                    }}
                                                                >
                                                                    {b}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Bathrooms</Label>
                                                        <div className="flex gap-2 p-2 rounded-lg bg-muted mt-2">
                                                            {['1', '2', '3', '4', '5+'].map(b => (
                                                                <Button 
                                                                    key={b} 
                                                                    variant={bathrooms === b ? "default" : "outline"}
                                                                    size="sm" 
                                                                    className="flex-1 bg-background"
                                                                    onClick={() => {
                                                                        const val = bathrooms === b ? undefined : (b === '5+' ? 5 : Number(b));
                                                                        updateFilter('bathrooms', val);
                                                                    }}
                                                                >
                                                                    {b}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h4 className="font-semibold mb-4 text-lg">Property Type</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {propertyTypes
                                                        .filter(type => {
                                                            const key = `${propertyGroup === 'commercial' ? 'Commercial' : 'Residential'}_${purpose === 'rent' ? 'Rent' : 'Sell'}`;
                                                            const validTypes = PROPERTY_TYPES_MAPPING[key] || [];
                                                            return validTypes.includes(type);
                                                        })
                                                        .map(type => (
                                                            <div key={type} className="flex items-center space-x-2">
                                                                <Checkbox 
                                                                    id={`type-${type}`} 
                                                                    checked={selectedTypes.includes(type)}
                                                                    onCheckedChange={() => toggleType(type)}
                                                                />
                                                                <Label htmlFor={`type-${type}`} className="font-normal text-sm">{type}</Label>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h4 className="font-semibold mb-4 text-lg">Amenities</h4>
                                                <p className="text-xs text-muted-foreground italic mb-4">Coming Soon: Advanced amenity filters integration.</p>
                                            </div>
                                            <div className="mt-4 flex gap-4">
                                                <Button variant="outline" className="w-full" onClick={handleReset}>Reset Filters</Button>
                                                <Button className="w-full" onClick={handleSearch}>Apply Filters</Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                            </div>
                            <Separator orientation="vertical" className="h-6 hidden lg:flex" />
                            <div className="hidden lg:flex items-center pr-2">
                                <Button variant="ghost" className="text-muted-foreground rounded-full font-bold">
                                    <Crown className="mr-2 h-4 w-4" />
                                    Luxury
                                </Button>
                            </div>

                            <Button 
                                className="bg-primary text-primary-foreground rounded-full h-12 w-12 p-0 flex-shrink-0"
                                onClick={handleSearch}
                            >
                                <span className="sr-only">Search</span>
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="ai-search">
                     <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg focus-within:shadow-xl transition-shadow duration-300 flex flex-col gap-4">
                         <Textarea
                            placeholder="e.g., I'm looking for a 3-bedroom villa in Dubai Hills with a private pool and a modern kitchen, suitable for a young family. My budget is around AED 5M."
                            className="w-full text-foreground bg-transparent border rounded-md p-3 focus-visible:ring-1 focus-visible:ring-offset-0 text-base h-auto"
                            rows={3}
                        />
                        <Button className="bg-primary text-primary-foreground rounded-md h-12 w-full text-base">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Find My Property with AI
                        </Button>
                    </div>
                </TabsContent>
                <TabsList className={cn(
                    "grid w-full grid-cols-2 max-w-xs mx-auto mt-4",
                    context === 'hero' 
                        ? "bg-black/20 border border-white/20 backdrop-blur-sm rounded-full"
                        : "bg-muted text-muted-foreground p-1 rounded-md"
                )}>
                    <TabsTrigger 
                        value="manual-search" 
                        className={cn(
                           "data-[state=active]:shadow-sm",
                           context === 'hero' 
                                ? "text-white data-[state=active]:bg-white/90 data-[state=active]:text-black rounded-full" 
                                : "data-[state=active]:bg-background data-[state=active]:text-foreground rounded-sm"
                        )}
                    >
                        Manual Search
                    </TabsTrigger>
                    <TabsTrigger 
                        value="ai-search" 
                        className={cn(
                           "data-[state=active]:shadow-sm",
                           context === 'hero' 
                                ? "text-white data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-600 data-[state=active]:text-white rounded-full"
                                : "data-[state=active]:bg-background data-[state=active]:text-foreground rounded-sm"
                        )}
                    >
                        Search with AI
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
