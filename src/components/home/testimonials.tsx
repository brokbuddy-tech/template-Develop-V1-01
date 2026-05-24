"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star } from "lucide-react";
import * as React from "react";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Rating = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex text-primary">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        fill={i < rating ? "currentColor" : "none"}
        className="w-4 h-4 text-primary"
      />
    ))}
  </div>
);

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const testimonialsToRender = testimonials.filter((testimonial) =>
    Boolean((testimonial.message || testimonial.content || testimonial.quote || "").trim()),
  );

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  if (!testimonialsToRender.length) return null;

  return (
    <section className="py-16 bg-card">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Clients Say
        </h2>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonialsToRender.map((testimonial) => {
              const imageSource = testimonial.imageUrl || testimonial.imageId;
              const testImage = imageSource
                ? imageSource.startsWith("http")
                  ? { imageUrl: imageSource, id: "api", imageHint: "" }
                  : PlaceHolderImages.find((p) => p.id === imageSource)
                : null;

              const name =
                testimonial.clientName || testimonial.name || "Anonymous";
              const quote = testimonial.message || testimonial.content || testimonial.quote || "";

              return (
                <CarouselItem key={testimonial.id}>
                  <div className="p-4">
                    <Card className="bg-background">
                      <CardContent className="p-8 text-center flex flex-col items-center">
                        {testImage ? (
                          <Image
                            src={testImage.imageUrl}
                            alt={name}
                            width={80}
                            height={80}
                            className="rounded-full mb-4 object-cover aspect-square"
                            data-ai-hint={testImage.imageHint}
                          />
                        ) : (
                          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                            <span className="text-xl font-bold">
                              {name.charAt(0)}
                            </span>
                          </div>
                        )}

                        <Rating rating={testimonial.rating} />
                        <p className="mt-4 text-lg italic">"{quote}"</p>
                        <p className="mt-4 font-semibold">{name}</p>
                        {testimonial.badgeLabel ? (
                          <p className="mt-1 text-xs font-medium text-primary">
                            {testimonial.badgeLabel}
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
