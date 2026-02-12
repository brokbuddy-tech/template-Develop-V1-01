import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export function AreaGuidesDiscovery() {
  const bridgeImage = PlaceHolderImages.find(p => p.id === 'area-guide-bridge');
  const cityWalkImage = PlaceHolderImages.find(p => p.id === 'area-guide-city-walk');
  const burjImage = PlaceHolderImages.find(p => p.id === 'area-guide-burj');
  const villaImage = PlaceHolderImages.find(p => p.id === 'area-guide-villa');

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
              <Button variant="outline" size="icon" className="bg-transparent border-gray-600 hover:bg-gray-800 text-white rounded-full">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent border-gray-600 hover:bg-gray-800 text-white rounded-full">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="lg:w-3/5 xl:w-2/3 w-full">
            <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[500px]">
              <div className="col-span-1 row-span-1 relative">
                {villaImage && <Image src={villaImage.imageUrl} alt={villaImage.description} fill className="rounded-xl object-cover" data-ai-hint={villaImage.imageHint} />}
              </div>
              <div className="col-span-1 row-span-2 relative">
                {cityWalkImage && <Image src={cityWalkImage.imageUrl} alt={cityWalkImage.description} fill className="rounded-xl object-cover" data-ai-hint={cityWalkImage.imageHint} />}
              </div>
              <div className="col-span-1 row-span-2 relative">
                {burjImage && <Image src={burjImage.imageUrl} alt={burjImage.description} fill className="rounded-xl object-cover" data-ai-hint={burjImage.imageHint} />}
              </div>
              <div className="col-span-1 row-span-1 relative">
                {bridgeImage && <Image src={bridgeImage.imageUrl} alt={bridgeImage.description} fill className="rounded-xl object-cover" data-ai-hint={bridgeImage.imageHint} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
