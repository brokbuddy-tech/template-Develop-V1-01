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

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Townhouse", "Duplex", "Office", "Warehouse", "Plot"];
const amenitiesList = [
  "Swimming Pool", "Gym", "Private Garden", "Beach Access",
  "Covered Parking", "Maids Room", "Concierge", "Pet Friendly",
  "High-speed Elevators", "Shell & Core", "Fitted"
];

interface SearchFiltersProps {
  context?: 'hero' | 'page';
}

export function SearchFilters({ context = 'hero' }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [purpose, setPurpose] = useState('buy');
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [bedrooms, setBedrooms] = useState<string>('');
    const [bathrooms, setBathrooms] = useState<string>('');

    // Sync state with URL params on mount or when URL changes
    useEffect(() => {
        const p = pathname.split('/')[1] || 'buy';
        if (['buy', 'rent', 'commercial', 'off-plan'].includes(p)) {
            setPurpose(p);
        }
        setSearch(searchParams.get('q') || '');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
        setMinArea(searchParams.get('minArea') || '');
        setMaxArea(searchParams.get('maxArea') || '');
        
        const types = searchParams.get('types');
        setSelectedTypes(types ? types.split(',') : []);
        
        const ams = searchParams.get('amenities');
        setSelectedAmenities(ams ? ams.split(',') : []);
        
        setBedrooms(searchParams.get('bedrooms') || '');
        setBathrooms(searchParams.get('bathrooms') || '');
    }, [searchParams, pathname]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (minArea) params.set('minArea', minArea);
        if (maxArea) params.set('maxArea', maxArea);
        if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
        if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
        if (bedrooms) params.set('bedrooms', bedrooms);
        if (bathrooms) params.set('bathrooms', bathrooms);

        const queryString = params.toString();
        const targetPath = `/${purpose}`;
        router.push(`${targetPath}${queryString ? `?${queryString}` : ''}`);
    };

    const toggleType = (type: string) => {
        setSelectedTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Tabs defaultValue="manual-search" className="w-full">
                <TabsContent value="manual-search">
                    <div className="bg-white p-2 rounded-full shadow-lg focus-within:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Purpose Dropdown */}
                            <Select value={purpose} onValueChange={setPurpose}>
                                <SelectTrigger className="w-auto text-foreground md:w-[150px] font-bold focus:ring-0 border-0 focus:ring-offset-0 rounded-l-full h-auto py-3 pl-4 pr-2 text-base">
                                    <SelectValue placeholder="Purpose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="buy">Buy</SelectItem>
                                    <SelectItem value="rent">Rent</SelectItem>
                                    <SelectItem value="commercial">Commercial</SelectItem>
                                    <SelectItem value="off-plan">Off-Plan</SelectItem>
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
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

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
                                                    onChange={(e) => setMinPrice(e.target.value)}
                                                />
                                                <Input 
                                                    placeholder="Max" 
                                                    type="number" 
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <div className="grid grid-cols-2 gap-2 text-sm px-2">
                                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => setMaxPrice('1000000')}>Up to 1M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => {setMinPrice('1000000'); setMaxPrice('3000000');}}>1M - 3M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => {setMinPrice('3000000'); setMaxPrice('5000000');}}>3M - 5M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => {setMinPrice('5000000'); setMaxPrice('');}}>5M+</Button>
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
                                                        onChange={(e) => setMinArea(e.target.value)}
                                                    />
                                                    <Input 
                                                        placeholder="Max Area" 
                                                        type="number" 
                                                        value={maxArea}
                                                        onChange={(e) => setMaxArea(e.target.value)}
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
                                                                    onClick={() => setBedrooms(bedrooms === b ? '' : b)}
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
                                                                    onClick={() => setBathrooms(bathrooms === b ? '' : b)}
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
                                                    {propertyTypes.map(type => (
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
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {amenitiesList.map(amenity => (
                                                        <div key={amenity} className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                id={`amenity-${amenity}`} 
                                                                checked={selectedAmenities.includes(amenity)}
                                                                onCheckedChange={() => toggleAmenity(amenity)}
                                                            />
                                                            <Label htmlFor={`amenity-${amenity}`} className="font-normal text-sm">{amenity}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mt-4">
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
