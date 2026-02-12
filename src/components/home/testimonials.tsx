'use client';

import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import type { Testimonial } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, StarHalf } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Rating = () => (
  <div className="flex text-primary">
    <Star fill="currentColor" className="w-4 h-4" />
    <Star fill="currentColor" className="w-4 h-4" />
    <Star fill="currentColor" className="w-4 h-4" />
    <Star fill="currentColor" className="w-4 h-4" />
    <Star fill="currentColor" className="w-4 h-4" />
  </div>
);

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="py-16 bg-card">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Clients Say</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => {
              const placeholderImage = PlaceHolderImages.find(p => p.id === testimonial.imageId);
              return (
                <CarouselItem key={testimonial.id}>
                  <div className="p-4">
                    <Card className="bg-background">
                      <CardContent className="p-8 text-center flex flex-col items-center">
                        {placeholderImage && (
                          <Image
                            src={placeholderImage.imageUrl}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            className="rounded-full mb-4"
                            data-ai-hint={placeholderImage.imageHint}
                          />
                        )}
                        <Rating />
                        <p className="mt-4 text-lg italic">"{testimonial.quote}"</p>
                        <p className="mt-4 font-semibold">{testimonial.name}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
