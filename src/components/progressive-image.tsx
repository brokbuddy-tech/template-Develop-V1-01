'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { resolvePropertyImage } from '@/lib/property-media';
import type { PropertyImage } from '@/lib/types';

interface ProgressiveImageProps {
  source?: PropertyImage | null;
  fallbackId?: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

export function ProgressiveImage({
  source,
  fallbackId = 'property-1',
  alt,
  containerClassName,
  imageClassName,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  loading,
}: ProgressiveImageProps) {
  const image = resolvePropertyImage(source, fallbackId, alt);
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(true);

  useEffect(() => {
    setIsFullImageLoaded(!image || image.previewSrc === image.src);
  }, [image?.previewSrc, image?.src]);

  if (!image) return null;

  const sharedProps = fill
    ? {
        fill: true as const,
        sizes,
      }
    : {
        width: width ?? 1200,
        height: height ?? 800,
      };

  const shouldLayerImages = image.previewSrc !== image.src;

  return (
    <div className={cn(fill ? 'absolute inset-0' : 'relative block overflow-hidden', containerClassName)}>
      <Image
        {...sharedProps}
        src={image.previewSrc}
        alt={image.alt}
        priority={priority}
        loading={loading}
        data-ai-hint={image.hint}
        unoptimized={image.unoptimized}
        className={cn(
          imageClassName,
          shouldLayerImages && 'transition-[filter,transform] duration-500',
          shouldLayerImages && !isFullImageLoaded && 'scale-[1.03] blur-xl'
        )}
      />

      {shouldLayerImages ? (
        <Image
          {...sharedProps}
          src={image.src}
          alt=""
          aria-hidden="true"
          priority={priority}
          loading={loading}
          data-ai-hint={image.hint}
          unoptimized={image.unoptimized}
          onLoad={() => setIsFullImageLoaded(true)}
          onError={() => setIsFullImageLoaded(true)}
          className={cn(
            imageClassName,
            'transition-opacity duration-500',
            isFullImageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      ) : null}
    </div>
  );
}
