'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

                    {/* Optional overlay count */}
                    {images.length > 3 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            +{images.length - 3}
                        </div>
                    )}
                </div>
            </div>
            {isOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">

                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 left-6 text-white text-sm bg-black/50 px-4 py-2 rounded-lg z-50 hover:bg-black/70 transition-colors"
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
                    <button
                        onClick={handlePrev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={handleNext}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-6 right-6 text-white text-sm bg-black/50 px-3 py-1 rounded">
                        {safeIndex + 1} / {images.length}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
