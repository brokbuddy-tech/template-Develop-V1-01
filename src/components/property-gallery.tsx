'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Images, Video } from 'lucide-react';
import type { PropertyImage } from '@/lib/types';
import { ProgressiveImage } from '@/components/progressive-image';
import { Button } from '@/components/ui/button';

interface PropertyGalleryProps {
    galleryImages?: PropertyImage[];
    galleryImageIds?: string[];
    propertyName?: string;
    virtualTourUrl?: string | null;
}

export function PropertyGallery({
    galleryImages,
    galleryImageIds = [],
    propertyName = 'Property',
    virtualTourUrl,
}: PropertyGalleryProps) {
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const images = (galleryImages && galleryImages.length > 0 ? galleryImages : galleryImageIds).filter(Boolean);
    const [isOpen, setIsOpen] = useState(false);
    const [visitedIndices, setVisitedIndices] = useState<Set<number>>(new Set([0]));
    
    useEffect(() => {
        if (mainImageIndex <= images.length - 1) {
            setVisitedIndices(prev => new Set(prev).add(mainImageIndex));
            return;
        }
        setMainImageIndex(0);
        setVisitedIndices(prev => new Set(prev).add(0));
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
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[400px]">
            {/* LEFT - Main Image */}
            <div className="relative md:col-span-2 h-full rounded-xl overflow-hidden"
                onClick={() => {
                    setMainImageIndex(0);
                    setIsOpen(true);
                }}
            >
                <ProgressiveImage
                    source={images[0]}
                    alt={`${propertyName} main image`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                    imageClassName="object-cover"
                />
                {virtualTourUrl ? (
                    <Button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            window.open(virtualTourUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="absolute bottom-4 left-4 rounded-full bg-white/90 px-5 text-slate-900 shadow-lg hover:bg-white"
                    >
                        <Video className="mr-2 h-4 w-4" />
                        Virtual Tour
                    </Button>
                ) : null}
            </div>

            {/* RIGHT - Two Images */}
            <div className="flex flex-col gap-3 h-full">
                {/* Top Image */}
                <div className="relative h-1/2 rounded-xl overflow-hidden"
                    onClick={() => {
                        setMainImageIndex(1);
                        setIsOpen(true);
                    }}
                >
                    {images[1] && (
                        <ProgressiveImage
                            source={images[1]}
                            alt={`${propertyName} image 2`}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            imageClassName="object-cover"
                        />
                    )}
                </div>

                {/* Bottom Image */}
                <div className="relative h-1/2 rounded-xl overflow-hidden"
                    onClick={() => {
                        setMainImageIndex(2);
                        setIsOpen(true);
                    }}
                >
                    {images[2] && (
                        <ProgressiveImage
                            source={images[2]}
                            alt={`${propertyName} image 3`}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            imageClassName="object-cover"
                        />
                    )}

                    <div className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-black/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
                        <Images className="h-4 w-4" />
                        View More
                        {images.length > 3 ? <span>+{images.length - 3}</span> : null}
                    </div>
                </div>
            </div>
            {isOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">

                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute left-4 top-4 z-[70] rounded-lg bg-black/60 px-4 py-2 text-sm text-white shadow-lg transition-colors hover:bg-black/80 md:left-6 md:top-6"
                    >
                        ← Back to gallery
                    </button>

                    {/* Content Wrapper */}
                    <div className="relative w-full h-full flex items-center justify-center">

                        {/* Image Container */}
                        <div className="relative w-[90%] max-w-4xl h-[70vh]">
                            {images.map((image, i) => {
                                const isVisited = visitedIndices.has(i) || i === safeIndex;
                                const isActive = i === safeIndex;

                                if (!isVisited) return null;

                                return (
                                    <div 
                                        key={i}
                                        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                                    >
                                        <ProgressiveImage
                                            source={image}
                                            alt={`${propertyName} image ${i + 1}`}
                                            fill
                                            sizes="100vw"
                                            imageClassName="object-contain"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                    </div>

                    {/* Left Arrow */}
                    {images.length > 1 ? (
                        <button
                            onClick={handlePrev}
                            aria-label="Show previous image"
                            className="absolute left-3 top-1/2 z-[70] -translate-y-1/2 rounded-full border border-white/20 bg-black/55 p-2.5 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 md:left-6 md:p-3"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    ) : null}

                    {/* Right Arrow */}
                    {images.length > 1 ? (
                        <button
                            onClick={handleNext}
                            aria-label="Show next image"
                            className="absolute right-3 top-1/2 z-[70] -translate-y-1/2 rounded-full border border-white/20 bg-black/55 p-2.5 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 md:right-6 md:p-3"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    ) : null}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 z-[70] rounded bg-black/60 px-3 py-1 text-sm text-white shadow-lg md:bottom-6 md:right-6">
                        {safeIndex + 1} / {images.length}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
