
import Image from 'next/image';
import { Suspense } from 'react';
import { SearchFilters } from '@/components/search-filters';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-dubai-skyline');

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter uppercase mb-6">
          Redefining Real Estate in Dubai
        </h1>
        <Suspense fallback={<div className="h-16 w-full max-w-5xl animate-pulse bg-white/20 rounded-full" />}>
          <SearchFilters context="hero" />
        </Suspense>
      </div>
    </section>
  );
}
