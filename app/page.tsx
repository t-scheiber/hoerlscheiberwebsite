"use client";

import { useState, lazy, Suspense } from "react";
import ImageCarousel from "./components/ImageCarousel";

// Lazy load Typewriter to reduce initial bundle size
const Typewriter = lazy(() =>
  import("nextjs-simple-typewriter").then((mod) => ({
    default: mod.Typewriter,
  }))
);

// Array of all wedding photos
const weddingPhotos = [
  "/galleryimages/IMG_1004.jpg",
  "/galleryimages/IMG_1137.jpg",
  "/galleryimages/IMG_1148.jpg",
  "/galleryimages/IMG_1978.jpg",
  "/galleryimages/IMG_2049.jpg",
  "/galleryimages/IMG_2158.jpg",
  "/galleryimages/IMG_2382.jpg",
  "/galleryimages/IMG_4409.jpg",
  "/galleryimages/IMG_5073.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.11.32_47da1fa2.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.23.32_baf1f71d.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.23.32_f4188512.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.23.32_af5ad749.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.27.58_7636996c.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.30.42_4bfda930.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.32.25_adcbf048.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.35.29_15bba129.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.35.29_47488633.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.35.29_d6383c06.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.35.29_f53d68f6.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.35.29_79006b44.jpg",
  "/galleryimages/WhatsApp Image 2025-07-12 at 13.35.29_9754126a.jpg",
  "/galleryimages/_DSC0010.JPEG",
  "/galleryimages/dji_fly_20240615_153248_0032_1718458520604_photo.JPEG",
  "/galleryimages/dji_fly_20240615_153306_0037_1718458506051_photo.JPEG",
];

// Memoize typewriter words to prevent recreation on every render
const typewriterWords: string[] = [
  "Alles Gute zur Hochzeit!",
  "Glückwunsch zur Trauung!",
  "Viel Glück auf eurem gemeinsamen Weg!",
  "Glückwunsch zur Hochzeit!",
  "Alles Gute zur Trauung!",
];

export default function Home() {
  // Randomize the order of photos (using useState with lazy initializer to avoid impure function calls during render)
  const [shuffledPhotos] = useState(() =>
    [...weddingPhotos].sort(() => Math.random() - 0.5)
  );

  return (
    <div className="h-screen bg-linear-to-br from-[#d95959]/30 via-white/80 to-[#d95555]/30">
      <div className="container mx-auto px-4 py-1">
        {/* Main Heading */}
        <div className="text-center mb-2 fade-in max-w-4xl mx-auto relative">
          {/* Liquid Glass Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/30 relative overflow-hidden">
            {/* Dynamic Lighting Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5 rounded-2xl"></div>

            {/* Subtle Border Glow */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#d95959]/10 via-transparent to-[#d95555]/10 border border-white/40"></div>

            {/* Content */}
            <div className="relative z-10">
              <h1
                className="text-3xl md:text-4xl font-bold pb-4 bg-linear-to-r from-[#d95959] to-[#d95555] bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                &nbsp;
                <Suspense fallback={<span>Alles Gute zur Hochzeit!</span>}>
                  <Typewriter
                    words={typewriterWords}
                    loop={0}
                    delaySpeed={1000}
                    typeSpeed={100}
                    deleteSpeed={50}
                    cursor={true}
                    cursorBlinking={true}
                    cursorColor="#d95959"
                    cursorStyle=""
                  />
                </Suspense>
                &nbsp;
              </h1>
              <h2
                className="text-xl md:text-2xl font-light text-gray-700 mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Louise & Christoph Hörl-Scheiber
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-[#d95959] to-[#d95555] mx-auto rounded-full"></div>
            </div>
            <p className="text-lg text-gray-700 font-medium mt-2">
              18. Juli 2025
            </p>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mb-2 fade-in" style={{ animationDelay: "0.4s" }}>
          <ImageCarousel images={shuffledPhotos} autoPlayInterval={4000} />
        </div>

        {/* Footer */}
        <footer
          className="text-center text-gray-500 text-sm mt-2 fade-in max-w-4xl mx-auto"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 shadow-lg border border-white/20">
            <p>Made with ❤️ by Thomas for Lou & Chris</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
