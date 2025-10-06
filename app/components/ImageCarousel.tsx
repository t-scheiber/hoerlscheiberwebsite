'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export default function ImageCarousel({ images, autoPlayInterval = 3000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, autoPlayInterval, images.length]);

  // Auto-scroll active thumbnail into view, but skip on initial mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const ref = thumbnailRefs.current[currentIndex];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // Always scroll navbar to start on mount and when images change
  useEffect(() => {
    if (navbarRef.current) {
      navbarRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, [images]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Image Display with Liquid Glass Effect */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        {/* Liquid Glass Container */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
          {/* Dynamic Lighting Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 rounded-2xl"></div>
          
          {/* Subtle Border Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#d95959]/10 via-transparent to-[#d95555]/10 border border-white/30"></div>
        </div>
        
        {/* Image with Liquid Glass Overlay */}
        <div className="relative h-full w-full">
          <Image
            src={images[currentIndex]}
            alt={`Wedding photo ${currentIndex + 1}`}
            fill
            className="object-contain transition-transform duration-500 ease-in-out hover:scale-105 rounded-2xl"
            priority={currentIndex === 0}
          />
          
          {/* Liquid Glass Overlay for Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 rounded-2xl pointer-events-none"></div>
        </div>
        
        {/* Navigation Arrows with Liquid Glass */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-white/30"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-white/30"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image Counter with Liquid Glass */}
        <div className="absolute bottom-4 left-4 bg-black/20 text-white px-4 py-2 rounded-full text-sm border border-white/20 shadow-lg">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Auto-play Toggle with Liquid Glass */}
        <button
          onClick={toggleAutoPlay}
          className="absolute bottom-4 right-4 bg-black/20 hover:bg-black/30 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 border border-white/20 shadow-lg"
          aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
      </div>

      {/* Thumbnail Navigation with Liquid Glass */}
      <div ref={navbarRef} className="flex gap-3 mt-2 pb-1 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 overflow-x-auto scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            ref={el => { thumbnailRefs.current[index] = el; }}
            onClick={() => goToImage(index)}
            className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 box-border p-1 ${
              index === currentIndex
                ? 'ring-2 ring-[#d95959]/50 scale-110 z-10 bg-white/10 backdrop-blur-md border border-white/30 shadow-lg'
                : 'hover:scale-105 opacity-70 hover:opacity-100 bg-white/10 backdrop-blur-sm border border-white/20'
            }`}
            style={{ marginTop: 2, marginBottom: 2 }}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-contain rounded-lg"
            />
            {/* Liquid Glass Overlay for Thumbnails */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-lg pointer-events-none"></div>
          </button>
        ))}
      </div>
    </div>
  );
} 