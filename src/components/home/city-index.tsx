
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function CityIndex() {
  const cityIndexImage = PlaceHolderImages.find(p => p.id === 'city-index-skyline');

  return (
    <section className="bg-gray-50">
      <div>
        <div className="flex flex-col md:flex-row items-center min-h-[400px] md:min-h-[450px]">
          <div className="w-full md:w-1/2 h-64 md:h-[450px] relative">
            {cityIndexImage && (
              <Image
                src={cityIndexImage.imageUrl}
                alt={cityIndexImage.description}
                fill
                className="object-cover object-center grayscale"
                data-ai-hint={cityIndexImage.imageHint}
              />
            )}
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-10 lg:px-16">
            <h2 className="text-3xl md:text-4xl font-black text-black leading-tight mb-6 text-center md:text-left">
              Find out how Dubai compares to London, New York, and Singapore in our groundbreaking Tier-1 City Index!
            </h2>
            <div className="flex justify-center md:justify-start">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors text-base">
                <Link href="/city-index">
                  See the full rankings & analysis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
