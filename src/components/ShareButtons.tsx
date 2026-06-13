"use client";

import { useState } from "react";

/** Makale paylaşım butonları: WhatsApp, sistem paylaşımı ve link kopyalama */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => (typeof window !== "undefined" ? window.location.href : "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const nativeShare = async () => {
    const url = getUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      copy();
    }
  };

  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[0.7rem] font-bold uppercase tracking-wider transition-all duration-300";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <span className="text-[0.62rem] text-fg-muted uppercase tracking-[0.16em] mr-1">Paylaş</span>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${getUrl()}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} border-[#25D366]/30 text-[#1faa52] hover:border-[#25D366] hover:bg-[#25D366]/10`}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.88L2 22l5.3-1.29c1.4.78 3.01 1.22 4.7 1.22 5.52 0 10-4.48 10-10S17.524 2 12.004 2zm5.72 14.1c-.24.67-1.19 1.29-1.92 1.39-.49.07-1.12.11-3.23-.77-2.7-1.13-4.42-3.89-4.56-4.08-.13-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.32.24-.26.54-.32.71-.32h.51c.16 0 .38-.06.59.44.22.54.76 1.86.83 2 .07.14.12.31.02.51-.1.2-.21.32-.36.5-.15.18-.31.39-.45.52-.15.15-.31.31-.13.62.18.31.8 1.31 1.72 2.13.92.82 1.7 1.08 2.02 1.23.32.15.63.09.83-.05.21-.14 1.34-.63 1.57-.75.23-.12.38-.18.44-.29.06.11.06.64-.18 1.31z"/></svg>
        WhatsApp
      </a>

      <button
        type="button"
        onClick={nativeShare}
        className={`${base} border-gold/25 text-gold-deep hover:border-gold/50 hover:bg-gold/[0.06]`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        Paylaş
      </button>

      <button
        type="button"
        onClick={copy}
        className={`${base} ${copied ? "border-emerald-500/40 text-emerald-600 bg-emerald-500/10" : "border-cream-line text-fg-muted hover:border-gold/50 hover:text-gold-bright"}`}
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
            Kopyalandı
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></svg>
            Bağlantıyı Kopyala
          </>
        )}
      </button>
    </div>
  );
}
