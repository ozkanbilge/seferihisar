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

        {/* Right Side: SVG Flags */}
        <div className="flex items-center gap-3 shrink-0 border-l border-ink-line pl-4">
          <span className="inline-flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" title="Türkçe">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 rounded-sm object-cover"><path fill="#e30a17" d="M0 0h512v512H0z"/><path fill="#fff" d="M346.5 256c0 56.6-45.9 102.5-102.5 102.5S141.5 312.6 141.5 256 187.4 153.5 244 153.5 346.5 199.4 346.5 256z"/><path fill="#e30a17" d="M356.8 256c0 45.3-36.7 82-82 82s-82-36.7-82-82 36.7-82 82-82 82 36.7 82 82z"/><path fill="#fff" d="M363.8 256l-32.9-10.7 20.3-28-10.7 32.9-28-20.3L332.8 256l-20.3 28 28-20.3 10.7 32.9-20.3-28 32.9 10.7z"/></svg>
            <span className="font-bold text-[0.62rem] tracking-wide text-fg-invert">TR</span>
          </span>
          <span className="inline-flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" title="English">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 rounded-sm object-cover"><path fill="#012169" d="M0 0h512v512H0z"/><path fill="#FFF" d="M512 0v64L322 256l190 192v64h-64L256 322 64 512H0v-64l190-192L0 64V0h64l192 190L448 0z"/><path fill="#C8102E" d="M184 256L0 70V0h54l202 204V0h64v204l202-204h-54L284 256l184 186v70h-54L212 308v204h-64V308L-54 512h54L184 256z"/><path fill="#C8102E" d="M224 0v512h64V0H224zM0 224v64h512v-64H0z"/></svg>
            <span className="font-bold text-[0.62rem] tracking-wide text-fg-invert">EN</span>
          </span>
          <span className="inline-flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" title="العربية">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 rounded-sm object-cover bg-[#006c35]"><path fill="#fff" d="M128 280c-5 0-9-5-9-10s4-10 9-10 10 5 10 10-5 10-10 10zm128 0c-5 0-9-5-9-10s4-10 9-10 10 5 10 10-5 10-10 10zm128 0c-5 0-9-5-9-10s4-10 9-10 10 5 10 10-5 10-10 10zM128 200c15 0 25 10 25 25s-10 25-25 25-25-10-25-25 10-25 25-25zm128 0c15 0 25 10 25 25s-10 25-25 25-25-10-25-25 10-25 25-25zm128 0c15 0 25 10 25 25s-10 25-25 25-25-10-25-25 10-25 25-25zM128 140h256v10H128z" /></svg>
            <span className="font-bold text-[0.62rem] tracking-wide text-fg-invert">AR</span>
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
