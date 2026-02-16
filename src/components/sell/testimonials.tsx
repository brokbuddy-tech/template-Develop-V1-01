
'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { sellerTestimonials } from '@/lib/data';
import type { SellerTestimonial } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

function TestimonialCard({ testimonial }: { testimonial: SellerTestimonial }) {
  return (
    <Card className="bg-slate-50 rounded-2xl h-full border-0 shadow-sm">
      <CardContent className="p-8 relative flex flex-col h-full">
        <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/10" />
        <div className="flex items-center gap-4 mb-4 z-10">
          <Avatar className="h-12 w-12 bg-muted">
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {testimonial.avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.property}</p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed flex-1">
          {testimonial.quote}
        </p>
        <Quote className="absolute bottom-6 right-6 h-12 w-12 text-primary/10 transform rotate-180" />
      </CardContent>
    </Card>
  );
}

export function SellerTestimonials() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const scrollSnaps = api.scrollSnapList();
    setCount(scrollSnaps.length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on('select', onSelect);

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              What Our Sellers Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don’t take our word for it. Here are some of the great things our clients have said about selling through DEVELOP.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-8 md:mt-0">
            <p className="text-sm font-semibold text-muted-foreground">
              <span className="text-primary font-bold">{current}</span> / {count}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollPrev()}
                disabled={!api?.canScrollPrev()}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollNext()}
                disabled={!api?.canScrollNext()}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Carousel setApi={setApi}>
          <CarouselContent>
            {sellerTestimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: count }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        (current - 1) === index ? 'w-8 bg-primary' : 'w-2 bg-muted'
                    )}
                />
            ))}
        </div>

      </div>
    </section>
  );
}
