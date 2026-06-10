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
            Gayrimenkulünüzü Seferihisar Emlak'ın profesyonel ağıyla en doğru fiyata ve en kısa sürede değerlendirin.
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
      <div className="w-full bg-gradient-to-r from-emerald-900/40 to-ink border border-emerald-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-bold text-emerald-50 mb-2 font-[family-name:var(--font-display)]">
            Arsa Değeri Sorgulama
          </h3>
          <p className="text-sm text-emerald-100/70 max-w-lg mx-auto md:mx-0">
            Ada ve Parsel numaranız ile anında tahmini arsa değerini öğrenin ve detaylı analiz raporu alın.
          </p>
        </div>
        
        <div className="relative z-10 shrink-0">
          <Link href="/#arsa-sorgulama" className="btn bg-emerald-600 hover:bg-emerald-500 text-white border-none w-full md:w-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            Ücretsiz Sorgula
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
