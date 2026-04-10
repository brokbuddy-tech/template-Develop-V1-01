'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PropertyImage } from '@/lib/types';
import { ProgressiveImage } from '@/components/progressive-image';

interface PropertyGalleryProps {
    galleryImages?: PropertyImage[];
    galleryImageIds?: string[];
    propertyName?: string;
}

export function PropertyGallery({ galleryImages, galleryImageIds = [], propertyName = 'Property' }: PropertyGalleryProps) {
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const images = (galleryImages && galleryImages.length > 0 ? galleryImages : galleryImageIds).filter(Boolean);

    useEffect(() => {
        if (mainImageIndex <= images.length - 1) return;
        setMainImageIndex(0);
    }, [images.length, mainImageIndex]);

    if (images.length === 0) {
        return <div className="aspect-video w-full bg-card border rounded-lg flex items-center justify-center"><p>No images available</p></div>
    }

    const safeIndex = Math.min(mainImageIndex, images.length - 1);
    const mainImage = images[safeIndex];

    const handleNext = () => {
        setMainImageIndex((prev) => (prev + 1) % images.length);
    }

    const handlePrev = () => {
        setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }

    return (
        <div>
            <div className="relative aspect-video w-full overflow-hidden group">
                <ProgressiveImage
                    source={mainImage}
                    alt={`${propertyName} image ${safeIndex + 1}`}
                    fill
                    priority
                    sizes="100vw"
                    imageClassName="object-cover"
                />
                {images.length > 1 && (
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-4">
                        <button type="button" onClick={handlePrev} className="bg-white/50 hover:bg-white text-black rounded-full p-2" aria-label="Previous image">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button type="button" onClick={handleNext} className="bg-white/50 hover:bg-white text-black rounded-full p-2" aria-label="Next image">
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>
            {images.length > 1 && (
                <div className="w-full px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="grid grid-cols-5 gap-2">
                        {images.map((image, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={cn(
                                    "relative aspect-video w-full overflow-hidden rounded-md cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all",
                                    safeIndex === idx && "ring-primary ring-offset-2"
                                )}
                                onClick={() => setMainImageIndex(idx)}
                                aria-label={`Show image ${idx + 1}`}
                                aria-pressed={safeIndex === idx}
                            >
                                <ProgressiveImage
                                    source={image}
                                    alt={`${propertyName} thumbnail ${idx + 1}`}
                                    fill
                                    sizes="20vw"
                                    imageClassName="object-cover"
                                />
                                {safeIndex !== idx && <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
