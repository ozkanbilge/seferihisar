"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3">
        <Image
          src={images[activeIndex]}
          alt={`${alt} — Fotoğraf ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                i === activeIndex
                  ? "border-gold"
                  : "border-transparent hover:border-gold/40"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
