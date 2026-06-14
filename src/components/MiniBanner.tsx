"use client";

import Link from "next/link";

interface MiniBannerProps {
  type: "sell" | "land";
}

export function MiniBanner({ type }: MiniBannerProps) {
  if (type === "sell") {
    return (
      <div className="w-full bg-gradient-to-r from-ink-card to-ink border border-gold/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(192,160,98,0.05)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-bold text-fg-invert mb-2 font-[family-name:var(--font-display)]">
            Satılık Yeriniz Mi Var?
          </h3>
          <p className="text-sm text-fg-invert-muted max-w-lg mx-auto md:mx-0">
            Gayrimenkulünüzü Private Estate&apos;in profesyonel ağıyla en doğru fiyata ve en kısa sürede değerlendirin.
          </p>
        </div>
        
        <div className="relative z-10 shrink-0">
          <Link href="/iletisim" className="btn btn-gold w-full md:w-auto shadow-[0_0_20px_rgba(192,160,98,0.2)]">
            Hemen İletişime Geçin
          </Link>
        </div>
      </div>
    );
  }

  if (type === "land") {
    return (
      <div className="group relative w-full rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/55 via-gold/12 to-gold/45 shadow-[0_18px_44px_rgba(0,0,0,0.4)]">
        {/* Köşebent süslemeleri */}
        <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-20 pointer-events-none" aria-hidden />
        <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-20 pointer-events-none" aria-hidden />
        <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-20 pointer-events-none" aria-hidden />
        <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-gold/70 rounded-br z-20 pointer-events-none" aria-hidden />

        <div className="relative rounded-2xl bg-gradient-to-r from-ink-soft via-ink to-ink-soft overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
          {/* Üzerinden geçen ışık süpürmesi */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/[0.06] to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
          {/* Sakin altın hale */}
          <div className="absolute -top-12 right-1/4 w-64 h-40 rounded-full bg-gold/[0.07] blur-3xl animate-ambient pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4 flex-1 text-center md:text-left">
            {/* Kadastro madalyon ikonu */}
            <span className="hidden sm:flex w-14 h-14 rounded-full bg-gold/10 border border-gold/25 items-center justify-center shrink-0 animate-glow">
              <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 20l-5.5-2.7V5.6L9 8m0 12l6-3m-6 3V8m6 9l5.5 2.7V8.3L15 5m0 12V5M9 8l6-3" />
                <circle cx="15" cy="11" r="1" fill="currentColor" />
              </svg>
            </span>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-gold/30 text-[0.55rem] font-bold text-gold uppercase tracking-[0.16em] mb-1.5">
                <span className="w-1 h-1 rotate-45 bg-gold" />
                Ücretsiz Araç
              </span>
              <h3 className="text-xl md:text-2xl font-semibold text-fg-invert mb-1.5 font-[family-name:var(--font-cinzel)] uppercase tracking-[0.06em]">
                Arsa Değeri Sorgulama
              </h3>
              <p className="text-sm text-fg-invert-muted/80 max-w-lg mx-auto md:mx-0">
                Ada ve parsel numaranızla taşınmazınızın TKGM kayıtlı alanını ve tahmini piyasa değerini anında öğrenin.
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <Link href="/#arsa-sorgulama" className="btn btn-gold group/btn w-full md:w-auto justify-center px-7 text-xs font-bold uppercase tracking-[0.14em]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
              Ücretsiz Sorgula
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
