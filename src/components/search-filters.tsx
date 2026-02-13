'use client';

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
import { Switch } from './ui/switch';
import { Sparkles, Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Townhouse", "Duplex", "Office", "Warehouse", "Plot"];
const amenities = [
  "Swimming Pool", "Gym", "Private Garden", "Beach Access",
  "Covered Parking", "Maids Room", "Concierge", "Pet Friendly",
  "High-speed Elevators", "Shell & Core", "Fitted"
];

export function SearchFilters() {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <Tabs defaultValue="manual-search" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto mb-4 bg-black/20 border border-white/20 backdrop-blur-sm rounded-full">
                    <TabsTrigger value="manual-search" className="text-white data-[state=active]:bg-white/90 data-[state=active]:text-black rounded-full">Manual Search</TabsTrigger>
                    <TabsTrigger value="ai-search" className="text-white data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-600 data-[state=active]:text-white rounded-full">Search with AI</TabsTrigger>
                </TabsList>
                <TabsContent value="manual-search">
                    <div className="bg-white p-2 rounded-full shadow-lg focus-within:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Purpose Dropdown */}
                            <Select defaultValue="buy">
                                <SelectTrigger className="w-auto md:w-[150px] font-bold focus:ring-0 border-0 focus:ring-offset-0 rounded-l-full h-auto py-3 pl-4 pr-2 text-base">
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
                                    className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-auto py-3"
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
                                                <Input placeholder="Min" type="number" />
                                                <Input placeholder="Max" type="number" />
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <div className="grid grid-cols-2 gap-2 text-sm px-2">
                                            <Button variant="ghost" size="sm" className="justify-start">Up to 1M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start">1M - 3M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start">3M - 5M</Button>
                                            <Button variant="ghost" size="sm" className="justify-start">5M+</Button>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

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
                                                    <Input placeholder="Min Area" type="number" />
                                                    <Input placeholder="Max Area" type="number" />
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
                                                                <Button key={b} variant="outline" size="sm" className="flex-1 bg-background">{b}</Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Bathrooms</Label>
                                                        <div className="flex gap-2 p-2 rounded-lg bg-muted mt-2">
                                                            {['1', '2', '3', '4', '5+'].map(b => (
                                                                <Button key={b} variant="outline" size="sm" className="flex-1 bg-background">{b}</Button>
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
                                                            <Checkbox id={`type-${type}`} />
                                                            <Label htmlFor={`type-${type}`} className="font-normal text-sm">{type}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <h4 className="font-semibold mb-4 text-lg">Amenities</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {amenities.map(amenity => (
                                                        <div key={amenity} className="flex items-center space-x-2">
                                                            <Checkbox id={`amenity-${amenity}`} />
                                                            <Label htmlFor={`amenity-${amenity}`} className="font-normal text-sm">{amenity}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                            </div>
                            <div className="hidden lg:flex items-center space-x-2 pr-2">
                                <Switch id="luxury-only" />
                                <Label htmlFor="luxury-only" className="text-sm font-medium">Luxury</Label>
                            </div>

                            <Button className="bg-primary text-primary-foreground rounded-full h-12 w-12 p-0 flex-shrink-0">
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
                            className="w-full bg-transparent border rounded-md p-3 focus-visible:ring-1 focus-visible:ring-offset-0 text-base h-auto"
                            rows={3}
                        />
                        <Button className="bg-primary text-primary-foreground rounded-md h-12 w-full text-base">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Find My Property with AI
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
