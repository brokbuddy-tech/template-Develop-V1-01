'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
    galleryImageIds: string[];
}

export function PropertyGallery({ galleryImageIds }: PropertyGalleryProps) {
    const images = galleryImageIds.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean) as ImagePlaceholder[];
    const [mainImage, setMainImage] = useState(images[0] || null);

    if (images.length === 0) {
        return <div className="aspect-video bg-card border rounded-lg flex items-center justify-center"><p>No images available</p></div>
    }

    const handleNext = () => {
        const currentIndex = images.findIndex(img => img.id === mainImage.id);
        const nextIndex = (currentIndex + 1) % images.length;
        setMainImage(images[nextIndex]);
    }

    const handlePrev = () => {
        const currentIndex = images.findIndex(img => img.id === mainImage.id);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setMainImage(images[prevIndex]);
    }

    return (
        <div>
            <div className="relative aspect-video w-full overflow-hidden group">
                {mainImage &&
                    <Image
                        src={mainImage.imageUrl}
                        alt={mainImage.description}
                        fill
                        className="object-cover"
                    />
                }
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-4">
                    <button onClick={handlePrev} className="bg-white/50 hover:bg-white text-black rounded-full p-2">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button onClick={handleNext} className="bg-white/50 hover:bg-white text-black rounded-full p-2">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>
            <div className="container mt-4">
                <div className="grid grid-cols-5 gap-2">
                    {images.map(image => (
                        <div
                            key={image.id}
                            className={cn(
                                "relative aspect-video w-full overflow-hidden rounded-md cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all",
                                mainImage.id === image.id && "ring-primary ring-offset-2"
                            )}
                            onClick={() => setMainImage(image)}
                        >
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                className="object-cover"
                            />
                            {mainImage.id !== image.id && <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
