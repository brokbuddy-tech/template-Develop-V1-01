
'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { Award } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface AwardsSectionProps {
  awards: Award[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <section className="py-16 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Accolades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award) => {
            const awardImage = PlaceHolderImages.find(p => p.id === award.imageId);
            return (
              <div key={award.id} className="group relative overflow-hidden rounded-lg">
                <Card className="h-96 relative">
                  {awardImage && (
                    <Image
                      src={awardImage.imageUrl}
                      alt={award.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      data-ai-hint={awardImage.imageHint}
                    />
                  )}
                </Card>
                <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/70"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-2">{award.title}</h3>
                  <div className="max-h-0 opacity-0 transition-all duration-500 ease-in-out group-hover:max-h-40 group-hover:opacity-100">
                    <p className="text-gray-300 text-sm">
                      {award.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
