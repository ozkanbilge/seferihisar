"use client";

import { useEffect, useState } from "react";

export function TickerBanner() {
  const [rates, setRates] = useState({
    usd: 33.42,
    eur: 35.78,
    gold: 2482,
    usdTrend: "up",
    eurTrend: "up",
    goldTrend: "up",
  });

  // Simulate price ticks every 5 seconds for a dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setRates((prev) => {
        const usdDiff = (Math.random() - 0.45) * 0.04;
        const eurDiff = (Math.random() - 0.45) * 0.04;
        const goldDiff = (Math.random() - 0.4) * 4;

        return {
          usd: Math.round((prev.usd + usdDiff) * 100) / 100,
          eur: Math.round((prev.eur + eurDiff) * 100) / 100,
          gold: Math.round(prev.gold + goldDiff),
          usdTrend: usdDiff >= 0 ? "up" : "down",
          eurTrend: eurDiff >= 0 ? "up" : "down",
          goldTrend: goldDiff >= 0 ? "up" : "down",
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b0c0f] border-b border-ink-line text-[0.72rem] text-fg-invert-muted py-2.5 relative z-50">
      <div className="container-x flex items-center justify-between gap-4">
        {/* Left Side: Smooth Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative h-4 flex items-center">
          <div className="ticker-wrapper flex items-center gap-16 whitespace-nowrap animate-ticker">
            {/* Set 1 */}
            <div className="flex items-center gap-6">
              <span className="font-semibold text-gold-bright uppercase tracking-wider">Piyasa Ekranı:</span>
              <span className="flex items-center gap-1 font-medium text-fg-invert">
                💵 USD/TRY: <span className="font-bold">{rates.usd.toFixed(2)}</span>
                <span className={rates.usdTrend === "up" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                  {rates.usdTrend === "up" ? "▲" : "▼"}
                </span>
              </span>
              <span className="flex items-center gap-1 font-medium text-fg-invert">
                💶 EUR/TRY: <span className="font-bold">{rates.eur.toFixed(2)}</span>
                <span className={rates.eurTrend === "up" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                  {rates.eurTrend === "up" ? "▲" : "▼"}
                </span>
              </span>
              <span className="flex items-center gap-1 font-medium text-fg-invert">
                🏆 Altın (Gram): <span className="font-bold">{rates.gold} TL</span>
                <span className={rates.goldTrend === "up" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                  {rates.goldTrend === "up" ? "▲" : "▼"}
                </span>
              </span>
              <span className="text-gold-deep font-semibold">| Seferihisar Emlak Yatırım Endeksi</span>
            </div>

            {/* Set 2 (Duplicate for infinite loop effect) */}
            <div className="flex items-center gap-6">
              <span className="font-semibold text-gold-bright uppercase tracking-wider">Piyasa Ekranı:</span>
              <span className="flex items-center gap-1 font-medium text-fg-invert">
                💵 USD/TRY: <span className="font-bold">{rates.usd.toFixed(2)}</span>
                <span className={rates.usdTrend === "up" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                  {rates.usdTrend === "up" ? "▲" : "▼"}
                </span>
              </span>
              <span className="flex items-center gap-1 font-medium text-fg-invert">
                💶 EUR/TRY: <span className="font-bold">{rates.eur.toFixed(2)}</span>
                <span className={rates.eurTrend === "up" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                  {rates.eurTrend === "up" ? "▲" : "▼"}
                </span>
              </span>
              <span className="flex items-center gap-1 font-medium text-fg-invert">
                🏆 Altın (Gram): <span className="font-bold">{rates.gold} TL</span>
                <span className={rates.goldTrend === "up" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                  {rates.goldTrend === "up" ? "▲" : "▼"}
                </span>
              </span>
              <span className="text-gold-deep font-semibold">| Seferihisar Emlak Yatırım Endeksi</span>
            </div>
          </div>
        </div>

        {/* Right Side: Flags */}
        <div className="flex items-center gap-3 shrink-0 border-l border-ink-line pl-4">
          <span className="inline-flex items-center gap-1 cursor-pointer hover:text-fg-invert transition-colors" title="Türkçe">
            <span className="text-sm">🇹🇷</span> <span className="font-bold text-[0.62rem] tracking-wide">TR</span>
          </span>
          <span className="inline-flex items-center gap-1 cursor-pointer hover:text-fg-invert transition-colors" title="English">
            <span className="text-sm">🇬🇧</span> <span className="font-bold text-[0.62rem] tracking-wide">EN</span>
          </span>
          <span className="inline-flex items-center gap-1 cursor-pointer hover:text-fg-invert transition-colors" title="العربية">
            <span className="text-sm">🇸🇦</span> <span className="font-bold text-[0.62rem] tracking-wide">AR</span>
          </span>
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
