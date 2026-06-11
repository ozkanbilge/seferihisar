"use client";

import { useEffect, useState } from "react";

function RatesRow({ rates }: { rates: { usd: number; eur: number; gold: number; usdTrend: string; eurTrend: string; goldTrend: string } }) {
  const fmt = (v: number) => v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const arrow = (t: string) => (
    <span className={t === "up" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
      {t === "up" ? "\u25b2" : "\u25bc"}
    </span>
  );
  return (
    <div className="flex items-center gap-6">
      <span className="font-semibold text-gold-bright uppercase tracking-wider">Piyasa Ekranı:</span>
      <span className="flex items-center gap-1 font-medium text-fg-invert">
        USD/TRY: <span className="font-bold">{rates.usd ? fmt(rates.usd) : "—"}</span>
        {arrow(rates.usdTrend)}
      </span>
      <span className="flex items-center gap-1 font-medium text-fg-invert">
        EUR/TRY: <span className="font-bold">{rates.eur ? fmt(rates.eur) : "—"}</span>
        {arrow(rates.eurTrend)}
      </span>
      <span className="flex items-center gap-1 font-medium text-fg-invert">
        Gram Altın: <span className="font-bold">{rates.gold ? `${rates.gold.toLocaleString("tr-TR")} TL` : "—"}</span>
        {arrow(rates.goldTrend)}
      </span>
      <span className="text-gold-deep font-semibold">| Private Estate Yatırım Endeksi</span>
    </div>
  );
}

export function TickerBanner() {
  const [rates, setRates] = useState({
    usd: 0,
    eur: 0,
    gold: 0,
    usdTrend: "up",
    eurTrend: "up",
    goldTrend: "up",
  });

  // Canlı kurlar: altin.doviz.com/harem kaynağından 2 dakikada bir
  useEffect(() => {
    const load = () =>
      fetch("/api/kur")
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) =>
          setRates({
            usd: d.usd,
            eur: d.eur,
            gold: Math.round(d.gold),
            usdTrend: d.usdTrend,
            eurTrend: d.eurTrend,
            goldTrend: d.goldTrend,
          })
        )
        .catch(() => {});
    load();
    const interval = setInterval(load, 120_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b0c0f] border-b border-ink-line text-[0.72rem] text-fg-invert-muted py-2.5 relative z-50">
      <div className="container-x flex items-center justify-between gap-4">
        {/* Left Side: Smooth Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative h-4 flex items-center">
          <div className="ticker-wrapper flex items-center gap-16 whitespace-nowrap animate-ticker">
            <RatesRow rates={rates} />

            <RatesRow rates={rates} />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker 25s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
