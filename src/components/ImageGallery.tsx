"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/**
 * Lüks ilan galerisi: yumuşak geçişli ana sahne, altın ok madalyonları,
 * fotoğraf sayacı, altın halkalı küçük resimler ve tam ekran ışık kutusu
 * (lightbox — portal, klavye okları ve ESC destekli).
 */

function ArrowButton({
  dir,
  onClick,
  className = "",
}: {
  dir: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={dir === "prev" ? "Önceki fotoğraf" : "Sonraki fotoğraf"}
      className={`w-10 h-10 rounded-full bg-ink/60 backdrop-blur-md border border-gold/30 text-gold flex items-center justify-center transition-all duration-300 hover:bg-ink/80 hover:border-gold hover:shadow-[0_0_18px_rgba(192,160,98,0.35)] ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        {dir === "prev" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  // Işık kutusu: klavye okları + ESC, arka plan kaydırma kilidi
  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, prev, next]);

  return (
    <div>
      {/* Ana sahne */}
      <div
        className="group relative aspect-[16/10] rounded-2xl overflow-hidden mb-3 cursor-zoom-in bg-ink-soft"
        onClick={() => setLightbox(true)}
        role="button"
        aria-label="Fotoğrafı büyüt"
      >
        {/* Yumuşak çapraz geçiş: tüm kareler üst üste, aktif olan görünür */}
        {images.map((img, i) => (
          <Image
            key={img}
            src={img}
            alt={`${alt} — Fotoğraf ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            priority={i === 0}
            className={`object-cover transition-all duration-700 ease-out ${
              i === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
            } group-hover:scale-[1.02]`}
          />
        ))}

        {/* Alt zarif karartma */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/60 to-transparent pointer-events-none" />

        {/* Fotoğraf sayacı */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/70 backdrop-blur-md border border-gold/25 text-[0.65rem] font-bold text-gold-bright tracking-wider">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="6" width="18" height="14" rx="2" /><path d="M8 6l1.5-2h5L16 6" /><circle cx="12" cy="13" r="3.5" />
          </svg>
          {activeIndex + 1} / {images.length}
        </div>

        {/* Büyüt ipucu */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/70 backdrop-blur-md border border-gold/25 text-[0.62rem] font-semibold text-fg-invert-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
          Büyüt
        </div>

        {/* Gezinti okları */}
        {images.length > 1 && (
          <>
            <ArrowButton dir="prev" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            <ArrowButton dir="next" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
          </>
        )}
      </div>

      {/* Küçük resimler */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Fotoğraf ${i + 1}`}
              className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${
                i === activeIndex
                  ? "ring-2 ring-gold shadow-[0_0_14px_rgba(192,160,98,0.35)]"
                  : "ring-1 ring-gold/15 opacity-60 hover:opacity-100 hover:ring-gold/50"
              }`}
            >
              <Image
                src={img}
                alt={`Küçük resim ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
              {i === activeIndex && (
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Işık kutusu (tam ekran) */}
      {lightbox &&
        createPortal(
          <div className="fixed inset-0 z-[150] flex flex-col" role="dialog" aria-label="Fotoğraf galerisi">
            <div className="absolute inset-0 bg-ink/95 backdrop-blur-md" onClick={() => setLightbox(false)} />

            {/* Üst bar */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3">
              <span className="text-[0.7rem] font-bold text-gold-bright tracking-[0.18em] uppercase">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                aria-label="Kapat"
                className="w-9 h-9 rounded-full border border-gold/30 text-fg-invert-muted hover:text-gold hover:border-gold flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Görsel */}
            <div className="relative z-10 flex-1 mx-3 mb-3 md:mx-12">
              <Image
                src={images[activeIndex]}
                alt={`${alt} — Fotoğraf ${activeIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
              {images.length > 1 && (
                <>
                  <ArrowButton dir="prev" onClick={prev} className="absolute left-1 md:-left-2 top-1/2 -translate-y-1/2" />
                  <ArrowButton dir="next" onClick={next} className="absolute right-1 md:-right-2 top-1/2 -translate-y-1/2" />
                </>
              )}
            </div>

            {/* Alt flörür */}
            <div className="relative z-10 flex items-center justify-center gap-2.5 pb-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
              <span className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
