'use client';

import Image from 'next/image';
import Link from 'next/link';
import { areaGuides } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from './ui/button';

const popularDubaiAreas = ["Downtown", "Palm Jumeirah", "Dubai Marina", "Dubai Hills Estate", "Business Bay", "Jumeirah Village Circle", "Arabian Ranches", "DAMAC Hills"];
const popularAbuDhabiAreas = ["Yas Island", "Saadiyat Island", "Al Reem Island", "Al Raha Beach"];
const popularNorthernEmiratesAreas = ["Sharjah (Aljada)", "Ras Al Khaimah (Al Marjan Island)", "Ajman (Al Zorah)"];

export function AreaGuidesPopup() {
  return (
    <ScrollArea className="h-[70vh]">
        <div className="p-1">
            <div className="px-6 pt-6 pb-0">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Explore Area Guides</h2>
                <Separator className="my-4" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6">
            {areaGuides.map((guide) => {
                const placeholderImage = PlaceHolderImages.find(p => p.id === guide.imageId);
                return (
                <Link href={`/area-guides/${guide.id}`} key={guide.id} className="group block overflow-hidden rounded-lg">
                    <div className="relative aspect-[4/5]">
                    {placeholderImage && (
                        <Image
                        src={placeholderImage.imageUrl}
                        alt={guide.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={placeholderImage.imageHint}
                        />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm">
                        <h3 className="font-bold text-foreground text-center text-sm">{guide.name}</h3>
                    </div>
                    </div>
                </Link>
                );
            })}
            </div>

            <div className="mt-12 px-6 pb-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground">Popular Areas</h3>
                  <Button variant="link" asChild className="text-primary">
                    <Link href="/area-guides">See All</Link>
                  </Button>
              </div>
              <div className="space-y-8">
                  <div>
                    <h4 className="font-semibold text-lg text-foreground mb-4">Dubai</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {popularDubaiAreas.map(area => (
                            <Link href="#" key={area} className="group">
                                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-accent transition-colors">
                                    <span className="text-sm font-medium text-foreground">{area}</span>
                                    <ChevronRight className="h-5 w-5 text-primary" />
                                </div>
                            </Link>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-foreground mb-4">Abu Dhabi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {popularAbuDhabiAreas.map(area => (
                            <Link href="#" key={area} className="group">
                                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-accent transition-colors">
                                    <span className="text-sm font-medium text-foreground">{area}</span>
                                    <ChevronRight className="h-5 w-5 text-primary" />
                                </div>
                            </Link>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-foreground mb-4">Northern Emirates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {popularNorthernEmiratesAreas.map(area => (
                            <Link href="#" key={area} className="group">
                                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-accent transition-colors">
                                    <span className="text-sm font-medium text-foreground">{area}</span>
                                    <ChevronRight className="h-5 w-5 text-primary" />
                                </div>
                            </Link>
                        ))}
                    </div>
                  </div>
              </div>
            </div>
        </div>
    </ScrollArea>
  );
}
