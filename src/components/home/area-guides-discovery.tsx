'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const imageSets = [
  ['area-guide-villa', 'area-guide-city-walk', 'area-guide-burj', 'area-guide-bridge'],
  ['area-marina', 'area-hills', 'area-downtown', 'area-palm'],
  ['property-1', 'property-2', 'property-3', 'property-4'],
];

const getImageById = (id: string): ImagePlaceholder | undefined => PlaceHolderImages.find(p => p.id === id);

export function AreaGuidesDiscovery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const changeImageSet = (newIndex: number) => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
    }, 300); // Match this with transition duration
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % imageSets.length;
    changeImageSet(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + imageSets.length) % imageSets.length;
    changeImageSet(newIndex);
  };

  const currentImageIds = imageSets[currentIndex];
  const [img1, img2, img3, img4] = currentImageIds.map(getImageById);

  return (
    <section className="bg-black text-white py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-2/5 xl:w-1/3 text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-6">Browse Our Dubai Area Guides</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Explore our comprehensive area guides and discover the city's diverse offerings from bustling waterfront and urban locations to serene gated communities.
            </p>
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <Button onClick={handlePrev} variant="outline" size="icon" className="bg-transparent border-gray-600 hover:bg-gray-800 text-white rounded-full">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button onClick={handleNext} variant="outline" size="icon" className="bg-transparent border-gray-600 hover:bg-gray-800 text-white rounded-full">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="lg:w-3/5 xl:w-2/3 w-full">
            <div className={cn(
              "grid grid-cols-3 grid-rows-2 gap-4 h-[500px] transition-opacity duration-300 ease-in-out",
              isFading ? 'opacity-0' : 'opacity-100'
            )}>
              <div className="col-span-1 row-span-1 relative">
                {img1 && <Image src={img1.imageUrl} alt={img1.description} fill className="rounded-xl object-cover" data-ai-hint={img1.imageHint} />}
              </div>
              <div className="col-span-1 row-span-2 relative">
                {img2 && <Image src={img2.imageUrl} alt={img2.description} fill className="rounded-xl object-cover" data-ai-hint={img2.imageHint} />}
              </div>
              <div className="col-span-1 row-span-2 relative">
                {img3 && <Image src={img3.imageUrl} alt={img3.description} fill className="rounded-xl object-cover" data-ai-hint={img3.imageHint} />}
              </div>
              <div className="col-span-1 row-span-1 relative">
                {img4 && <Image src={img4.imageUrl} alt={img4.description} fill className="rounded-xl object-cover" data-ai-hint={img4.imageHint} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
