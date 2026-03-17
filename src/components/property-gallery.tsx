'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
    galleryImageIds: string[];
}

export function PropertyGallery({ galleryImageIds }: PropertyGalleryProps) {
    const [mainImageIndex, setMainImageIndex] = useState(0);

    if (!galleryImageIds || galleryImageIds.length === 0) {
        return <div className="aspect-video w-full bg-card border rounded-lg flex items-center justify-center"><p>No images available</p></div>
    }

    const mainImageUrl = galleryImageIds[mainImageIndex];

    const handleNext = () => {
        setMainImageIndex((prev) => (prev + 1) % galleryImageIds.length);
    }

    const handlePrev = () => {
        setMainImageIndex((prev) => (prev - 1 + galleryImageIds.length) % galleryImageIds.length);
    }

    return (
        <div>
            <div className="relative aspect-video w-full overflow-hidden group">
                <Image
                    src={mainImageUrl}
                    alt="Property image"
                    fill
                    className="object-cover"
                />
                {galleryImageIds.length > 1 && (
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-4">
                        <button onClick={handlePrev} className="bg-white/50 hover:bg-white text-black rounded-full p-2">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button onClick={handleNext} className="bg-white/50 hover:bg-white text-black rounded-full p-2">
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>
            {galleryImageIds.length > 1 && (
                <div className="w-full px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="grid grid-cols-5 gap-2">
                        {galleryImageIds.map((imageUrl, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "relative aspect-video w-full overflow-hidden rounded-md cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all",
                                    mainImageIndex === idx && "ring-primary ring-offset-2"
                                )}
                                onClick={() => setMainImageIndex(idx)}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={`Thumbnail ${idx}`}
                                    fill
                                    className="object-cover"
                                />
                                {mainImageIndex !== idx && <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
