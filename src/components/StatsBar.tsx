"use client";

import { useEffect, useRef, useState } from "react";
import { districts, allNeighborhoods } from "@/data/locations";
import { propertyTypes } from "@/data/property-types";

/** Veri dosyalarından canlı türetilen gerçek rakamlar */
type Stat = { value: number; suffix: string; label: string };

const stats: Stat[] = [
  { value: districts.length, suffix: "", label: "İlçe" },
  { value: allNeighborhoods.length, suffix: "+", label: "Mahalle" },
  { value: propertyTypes.length, suffix: "", label: "Gayrimenkul Türü" },
  { value: 15, suffix: "+", label: "Yıllık Deneyim" },
];

const DURATION = 1400;

/** Hedefe doğru easeOutCubic ile sayan animasyon (reduced-motion'a saygılı) */
function useCountUp(target: number, active: boolean): number {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(target);
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / DURATION, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return val;
}

function StatItem({
  stat,
  index,
  active,
}: {
  stat: Stat;
  index: number;
  active: boolean;
}) {
  const display = useCountUp(stat.value, active);

  const borders = [
    index >= 2 ? "border-t border-gold/10 md:border-t-0" : "",
    index === 2 ? "md:border-l md:border-gold/10" : "",
    index === 1 || index === 3 ? "border-l border-gold/10" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`group flex items-center justify-center gap-2.5 md:gap-3 py-4 md:py-5 px-3 transition-all duration-700 ${
        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${borders}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <span className="text-gold-bright font-extrabold text-xl md:text-2xl leading-none shrink-0 tabular-nums tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-105">
        {display.toLocaleString("tr-TR")}
        {stat.suffix}
      </span>
      <span className="text-[0.58rem] md:text-[0.66rem] text-fg-invert-muted tracking-[0.14em] uppercase leading-tight">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsBar({ labels }: { labels?: string[] } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          ob.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section className="relative z-10 mt-8 md:mt-10" id="stats-bar">
      <div className="container-x">
        <div
          ref={ref}
          className="relative grid grid-cols-2 md:grid-cols-4 rounded-xl border border-gold/15 bg-ink/40 backdrop-blur-sm overflow-hidden"
        >
          {/* Üst altın ışık çizgisi */}
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none z-10"
            aria-hidden
          />
          {/* Periyodik altın ışık süpürmesi */}
          <span
            className="absolute inset-y-0 -left-1/4 w-1/4 bg-gradient-to-r from-transparent via-gold/[0.08] to-transparent animate-stats-sweep pointer-events-none"
            aria-hidden
          />
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              stat={{ ...stat, label: labels?.[i] ?? stat.label }}
              index={i}
              active={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
