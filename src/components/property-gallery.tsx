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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[400px]">
            {/* LEFT - Main Image */}
            <div className="relative md:col-span-2 h-full rounded-xl overflow-hidden">
                <ProgressiveImage
                    source={images[0]}
                    alt={`${propertyName} main image`}
                    fill
                    priority
                    sizes="100vw"
                    imageClassName="object-cover"
                />
            </div>

            {/* RIGHT - Two Images */}
            <div className="flex flex-col gap-3 h-full">
                {/* Top Image */}
                <div className="relative h-1/2 rounded-xl overflow-hidden">
                    {images[1] && (
                        <ProgressiveImage
                            source={images[1]}
                            alt={`${propertyName} image 2`}
                            fill
                            sizes="50vw"
                            imageClassName="object-cover"
                        />
                    )}
                </div>

                {/* Bottom Image */}
                <div className="relative h-1/2 rounded-xl overflow-hidden">
                    {images[2] && (
                        <ProgressiveImage
                            source={images[2]}
                            alt={`${propertyName} image 3`}
                            fill
                            sizes="50vw"
                            imageClassName="object-cover"
                        />
                    )}

                    {/* Optional overlay count */}
                    {images.length > 3 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            +{images.length - 3}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
