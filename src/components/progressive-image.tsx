'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PropertyImage, PropertyMedia } from '@/lib/types';

interface ProgressiveImageProps {
  source?: PropertyImage | PropertyMedia | string | null;
  image?: PropertyImage | PropertyMedia | string | null; // Alias
  alt?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  fallbackId?: string;
}

/**
 * ProgressiveImage component for the Develop template.
 * Keeps the thumbnail visible until the high-resolution variant is ready.
 */
export function ProgressiveImage({
  source,
  image,
  alt = 'Property Image',
  className = '',
  imageClassName = '',
  width,
  height,
  priority = false,
  fill = false,
  sizes,
}: ProgressiveImageProps) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [error, setError] = useState(false);
  const loadingRef = useRef<string | null>(null);

  const target = source || image;
  
  let displayUrl = '';
  let thumbUrl = '';

  if (typeof target === 'string') {
    displayUrl = target;
    thumbUrl = target;
  } else if (target && typeof target === 'object') {
    // Handle PropertyMedia shape
    if ('url' in target) {
      displayUrl = target.url || '';
      thumbUrl = target.thumbnailUrl || displayUrl;
    } 
    // Handle PropertyImageSource shape
    else if ('src' in target) {
      displayUrl = target.src || '';
      thumbUrl = target.thumbnailSrc || displayUrl;
    }
  }

  useEffect(() => {
    if (!displayUrl || isHighResLoaded || typeof window === 'undefined') return;
    
    if (displayUrl === thumbUrl) {
      setIsHighResLoaded(true);
      return;
    }

    const img = new window.Image();
    img.decoding = 'async';
    img.src = displayUrl;
    loadingRef.current = displayUrl;
    
    img.onload = () => {
      if (loadingRef.current === displayUrl) {
        setIsHighResLoaded(true);
      }
    };
    
    img.onerror = () => {
      setError(true);
    };

    return () => {
      loadingRef.current = null;
    };
  }, [displayUrl, thumbUrl, isHighResLoaded]);

  if (!target || (error && !thumbUrl)) {
    return (
      <div className={cn('flex items-center justify-center bg-slate-100 text-slate-300', fill ? 'absolute inset-0' : '', className)}>
        <ImageIcon className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-slate-100', 
        fill ? 'absolute inset-0' : 'inline-block',
        className
      )}
      style={!fill && width && height ? { aspectRatio: `${width}/${height}`, width: '100%' } : undefined}
    >
      {/* 1. Thumbnail Layer */}
      {thumbUrl && (
        <img
          src={thumbUrl}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            isHighResLoaded ? 'opacity-0' : 'opacity-100',
            imageClassName
          )}
          style={{ 
            filter: displayUrl !== thumbUrl ? 'blur(8px)' : 'none', 
            transform: displayUrl !== thumbUrl ? 'scale(1.05)' : 'none',
          }}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {/* 2. Display Layer */}
      {displayUrl && (
        <img
          src={displayUrl}
          alt={alt}
          sizes={sizes}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsHighResLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'transition-opacity duration-300',
            fill ? 'absolute inset-0 w-full h-full' : 'w-full h-auto', 
            'object-cover',
            isHighResLoaded ? 'opacity-100' : 'opacity-0',
            imageClassName
          )}
        />
      )}
    </div>
  );
}
