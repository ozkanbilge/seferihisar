"use client";

import { useEffect, useState } from "react";

interface Rates {
  usd: number;
  eur: number;
  gold: number;
  usdTrend: string;
  eurTrend: string;
  goldTrend: string;
  usdChange: string;
  eurChange: string;
  goldChange: string;
}

const fmt = (v: number) =>
  v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Tek bir piyasa kalemi: ikon · ad · mono değer · yüzde çipi */
function Quote({
  icon,
  label,
  value,
  trend,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  change: string;
}) {
  const up = trend === "up";
  return (
    <span className="flex items-center gap-2">
      <span className="text-gold/70">{icon}</span>
      <span className="font-medium text-fg-invert-muted">{label}</span>
      <span className="font-bold text-fg-invert tabular-nums tracking-tight">{value}</span>
      <span
        className={`inline-flex items-center gap-0.5 px-1.5 py-px rounded-full text-[0.62rem] font-bold tabular-nums ${
          up ? "bg-emerald-500/12 text-emerald-400" : "bg-red-500/12 text-red-400"
        }`}
      >
        {up ? "▲" : "▼"}
        {change ? change.replace(/^%?\s*/, "").replace("-", "") : ""}
      </span>
    </span>
  );
}

function RatesRow({ rates }: { rates: Rates }) {
  const diamond = <span className="w-1 h-1 rotate-45 bg-gold/40 shrink-0" aria-hidden />;
  return (
    <div className="flex items-center gap-5">
      {/* CANLI göstergesi */}
      <span className="flex items-center gap-1.5 shrink-0">
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500/70 animate-ping" />
          <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-bold text-emerald-400 uppercase tracking-[0.18em] text-[0.62rem]">Canlı</span>
      </span>
      {diamond}
      <Quote
        icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
        label="USD/TRY" value={rates.usd ? fmt(rates.usd) : "—"} trend={rates.usdTrend} change={rates.usdChange}
      />
      {diamond}
      <Quote
        icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M18.5 5A7 7 0 1 0 18.5 19M4 10h9M4 14h7" /></svg>}
        label="EUR/TRY" value={rates.eur ? fmt(rates.eur) : "—"} trend={rates.eurTrend} change={rates.eurChange}
      />
      {diamond}
      <Quote
        icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l3-4h12l3 4-9 11z" /><path d="M3 9h18M9 5l3 15M15 5l-3 15" /></svg>}
        label="Gram Altın" value={rates.gold ? `${rates.gold.toLocaleString("tr-TR")} ₺` : "—"} trend={rates.goldTrend} change={rates.goldChange}
      />
      {diamond}
      <span className="font-semibold text-gold-deep uppercase tracking-[0.14em] text-[0.62rem] shrink-0">
        Private Estate Yatırım Endeksi
      </span>
    </div>
  );
}

export function TickerBanner() {
  const [rates, setRates] = useState<Rates>({
    usd: 0, eur: 0, gold: 0,
    usdTrend: "up", eurTrend: "up", goldTrend: "up",
    usdChange: "", eurChange: "", goldChange: "",
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
            usdChange: d.usdChange ?? "",
            eurChange: d.eurChange ?? "",
            goldChange: d.goldChange ?? "",
          })
        )
        .catch(() => {});
    load();
    const interval = setInterval(load, 120_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#0a0b0e] via-[#0d0e12] to-[#0a0b0e] border-b border-gold/15 text-[0.72rem] py-2.5 relative z-50">
      {/* Üst altın hairline */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="container-x flex items-center gap-4">
        <div className="flex-1 overflow-hidden relative h-4 flex items-center">
          {/* Kenarlarda yumuşak kaybolma */}
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0b0e] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0b0e] to-transparent z-10 pointer-events-none" />
          <div className="ticker-wrapper flex items-center gap-12 whitespace-nowrap animate-ticker">
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
          animation: ticker 30s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-ticker { animation: none; }
        }
      `}</style>
    </div>
  );
}
