
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { areaGuides } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const popularDubaiAreas = ["Downtown", "Palm Jumeirah", "Dubai Marina", "Dubai Hills Estate", "Business Bay", "Jumeirah Village Circle", "Arabian Ranches", "DAMAC Hills"];
const popularAbuDhabiAreas = ["Yas Island", "Saadiyat Island", "Al Reem Island", "Al Raha Beach"];
const popularNorthernEmiratesAreas = ["Sharjah (Aljada)", "Ras Al Khaimah (Al Marjan Island)", "Ajman (Al Zorah)"];

export default function AreaGuidesPage() {
  return (
    <div className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Section One: Featured Communities (The Visual Grid) */}
        <h2 className="text-3xl font-bold tracking-tight text-black">Explore Area Guides</h2>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
                    <h3 className="font-bold text-black text-center">{guide.name}</h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Section Two: Popular Areas (The Directory List) */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-black">Popular Areas</h3>
            <Button variant="link" asChild className="text-blue-600">
              <Link href="#">See All Areas</Link>
            </Button>
          </div>
          <div className="space-y-10">
            <div>
              <h4 className="font-semibold text-lg text-black mb-4">Dubai</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {popularDubaiAreas.map(area => (
                    <Link href="#" key={area} className="group">
                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary transition-colors">
                            <span className="text-sm font-medium text-black">{area}</span>
                            <ChevronRight className="h-5 w-5 text-blue-600" />
                        </div>
                    </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-black mb-4">Abu Dhabi</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {popularAbuDhabiAreas.map(area => (
                    <Link href="#" key={area} className="group">
                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary transition-colors">
                            <span className="text-sm font-medium text-black">{area}</span>
                            <ChevronRight className="h-5 w-5 text-blue-600" />
                        </div>
                    </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-black mb-4">Northern Emirates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {popularNorthernEmiratesAreas.map(area => (
                    <Link href="#" key={area} className="group">
                        <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary transition-colors">
                            <span className="text-sm font-medium text-black">{area}</span>
                            <ChevronRight className="h-5 w-5 text-blue-600" />
                        </div>
                    </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
