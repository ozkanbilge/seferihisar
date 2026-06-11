import type { SVGProps } from "react";
import type { PropertyIcon } from "@/data/property-types";

type P = SVGProps<SVGSVGElement>;
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const ArrowRight = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = (p: P) => (
  <svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const Menu = (p: P) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Close = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Search = (p: P) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const Phone = (p: P) => (
  <svg {...base} {...p}><path d="M3 5c0 9 7 16 16 16l2-3-4-2-2 2c-3-1.5-5.5-4-7-7l2-2-2-4-3 2Z" /></svg>
);
export const Mail = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const MapPin = (p: P) => (
  <svg {...base} {...p}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
export const Bed = (p: P) => (
  <svg {...base} {...p}><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 14h18M3 18v2M21 18v2M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" /></svg>
);
export const Bath = (p: P) => (
  <svg {...base} {...p}><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2M7 19l-1 2M18 19l1 2" /></svg>
);
export const AreaIcon = (p: P) => (
  <svg {...base} {...p}><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M9 4v3M4 9h3M20 15h-3M15 20v-3" /></svg>
);
export const Check = (p: P) => (
  <svg {...base} {...p}><path d="m5 13 4 4L19 7" /></svg>
);
export const Plus = (p: P) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const Star = (p: P) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><path d="m12 3 2.5 6 6.5.5-5 4.2 1.6 6.3L12 16.8 6.4 20l1.6-6.3-5-4.2 6.5-.5L12 3Z" /></svg>
);

export const Logo = (p: P) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    {...p}
    className={`royal-logo ${p.className || ""}`}
  >
    <style>{`
      @keyframes drawLine {
        0% { stroke-dashoffset: 300; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes shimmer {
        0% { stop-color: #c0a062; }
        50% { stop-color: #f3e5ab; }
        100% { stop-color: #9c7f45; }
      }
      @keyframes monogramIn {
        0% { opacity: 0; transform: translateY(5px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes leafPop {
        0% { opacity: 0; transform: scale(0); }
        100% { opacity: 1; transform: scale(1); }
      }
      .logo-line {
        stroke-dasharray: 300;
        stroke-dashoffset: 300;
        animation: drawLine 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      }
      .logo-monogram {
        animation: monogramIn 1.1s ease-out 0.4s both;
      }
      .logo-leaf {
        opacity: 0;
        transform-box: fill-box;
        transform-origin: center;
        animation: leafPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      .logo-shimmer-stop-1 {
        animation: shimmer 7s ease-in-out infinite alternate;
      }
      .logo-shimmer-stop-2 {
        animation: shimmer 7s ease-in-out infinite alternate-reverse;
      }
      @media (prefers-reduced-motion: reduce) {
        .logo-line, .logo-monogram, .logo-leaf,
        .logo-shimmer-stop-1, .logo-shimmer-stop-2 { animation: none; }
        .logo-line { stroke-dashoffset: 0; }
        .logo-leaf, .logo-monogram { opacity: 1; }
      }
    `}</style>

    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a6f3c" className="logo-shimmer-stop-1" />
        <stop offset="25%" stopColor="#c0a062" />
        <stop offset="45%" stopColor="#f6e7b6" className="logo-shimmer-stop-2" />
        <stop offset="62%" stopColor="#d8b978" />
        <stop offset="82%" stopColor="#f3e5ab" className="logo-shimmer-stop-1" />
        <stop offset="100%" stopColor="#8a6f3c" />
      </linearGradient>
      {/* Defne yaprağı (badem formu) */}
      <path id="laurelLeaf" d="M 0 0 Q 3.4 -2.6 7 0 Q 3.4 2.6 0 0 Z" />
    </defs>

    <g stroke="url(#goldGrad)" strokeLinecap="round" strokeLinejoin="round">
      {/* Görkemli taç: kavisli üç sivri uç */}
      <path
        d="M 33 36 L 35 20 Q 43 30 50 13 Q 57 30 65 20 L 67 36 Z"
        strokeWidth="2.2"
        className="logo-line"
        style={{ animationDelay: "0.1s" }}
      />
      {/* Taç bandı — çift çizgi */}
      <path d="M 32 41 H 68" strokeWidth="1.7" className="logo-line" style={{ animationDelay: "0.4s" }} />
      <path d="M 35.5 45 H 64.5" strokeWidth="0.8" opacity="0.55" className="logo-line" style={{ animationDelay: "0.5s" }} />

      {/* Defne dalları — sap çizgileri */}
      <path d="M 37 86 Q 24 74 22.5 54" strokeWidth="1.3" className="logo-line" style={{ animationDelay: "0.55s" }} />
      <path d="M 63 86 Q 76 74 77.5 54" strokeWidth="1.3" className="logo-line" style={{ animationDelay: "0.55s" }} />
    </g>

    {/* Taç mücevherleri: yan inciler + tepe elması */}
    <circle cx="35" cy="17.5" r="1.9" fill="url(#goldGrad)" />
    <circle cx="65" cy="17.5" r="1.9" fill="url(#goldGrad)" />
    <polygon points="50 5.5, 52.6 9.2, 50 12.9, 47.4 9.2" fill="url(#goldGrad)" />
    {/* Band ortası elmas */}
    <polygon points="50 38.6, 52 41, 50 43.4, 48 41" fill="url(#goldGrad)" />

    {/* Sol defne yaprakları */}
    {[
      [32.5, 81, -128], [27.5, 74.5, -112], [24.5, 67.5, -100],
      [23, 60.5, -90], [22.8, 53.5, -76],
    ].map(([x, y, r], i) => (
      <use
        key={`l${i}`}
        href="#laurelLeaf"
        fill="url(#goldGrad)"
        transform={`translate(${x} ${y}) rotate(${r})`}
        className="logo-leaf"
        style={{ animationDelay: `${0.7 + i * 0.12}s` }}
      />
    ))}
    {/* Sağ defne yaprakları (ayna) */}
    {[
      [67.5, 81, -52], [72.5, 74.5, -68], [75.5, 67.5, -80],
      [77, 60.5, -90], [77.2, 53.5, -104],
    ].map(([x, y, r], i) => (
      <use
        key={`r${i}`}
        href="#laurelLeaf"
        fill="url(#goldGrad)"
        transform={`translate(${x} ${y}) rotate(${r})`}
        className="logo-leaf"
        style={{ animationDelay: `${0.7 + i * 0.12}s` }}
      />
    ))}

    {/* Süslü "PE" monogramı */}
    <text
      x="50"
      y="74"
      textAnchor="middle"
      fontFamily="var(--font-cinzel-deco), var(--font-cinzel), Georgia, serif"
      fontSize="27"
      fontWeight="900"
      letterSpacing="0.5"
      fill="url(#goldGrad)"
      className="logo-monogram"
    >
      PE
    </text>

    {/* Alt flörür: çizgi · elmas · çizgi */}
    <g stroke="url(#goldGrad)" strokeLinecap="round">
      <path d="M 41 88 H 46.5 M 53.5 88 H 59" strokeWidth="1" className="logo-line" style={{ animationDelay: "0.9s" }} />
    </g>
    <polygon points="50 85.8, 52 88, 50 90.2, 48 88" fill="url(#goldGrad)" />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.88L2 22l5.3-1.29c1.4.78 3.01 1.22 4.7 1.22 5.52 0 10-4.48 10-10S17.524 2 12.004 2zm5.72 14.1c-.24.67-1.19 1.29-1.92 1.39-.49.07-1.12.11-3.23-.77-2.7-1.13-4.42-3.89-4.56-4.08-.13-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.32.24-.26.54-.32.71-.32h.51c.16 0 .38-.06.59.44.22.54.76 1.86.83 2 .07.14.12.31.02.51-.1.2-.21.32-.36.5-.15.18-.31.39-.45.52-.15.15-.31.31-.13.62.18.31.8 1.31 1.72 2.13.92.82 1.7-1.08 2.02-1.23.32-.15.63-.09.83.05.21.14 1.34.63 1.57.75.23.12.38.18.44.29.06.11.06.64-.18 1.31z"/>
  </svg>
);


/* Sosyal */
export const Instagram = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
);
export const Facebook = (p: P) => (
  <svg {...base} {...p}><path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8a1 1 0 0 1 1-1Z" /></svg>
);
export const Youtube = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="6" width="18" height="12" rx="3" /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" /></svg>
);
export const Linkedin = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 11v6" /></svg>
);

/* Emlak türü ikonları */
export function TypeIcon({ name, ...p }: { name: PropertyIcon } & P) {
  switch (name) {
    case "villa":
      return <svg {...base} {...p}><path d="M3 11 12 4l9 7M5 10v10h14V10M9 20v-5h6v5M14 7V4h3v5" /></svg>;
    case "daire":
      return <svg {...base} {...p}><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></svg>;
    case "arsa":
      return <svg {...base} {...p}><path d="M4 20V7l8-3 8 3v13M4 20h16M8 20v-5M16 20v-5" strokeDasharray="2 2" /></svg>;
    case "tarla":
      return <svg {...base} {...p}><path d="M3 18h18M5 18c0-4 1-7 3-9M12 18c0-5 0-9 0-12M19 18c0-4-1-7-3-9" /></svg>;
    case "yazlik":
      return <svg {...base} {...p}><path d="M3 12 12 5l9 7M5 11v9h14v-9M3 20h18M12 5V3" /><circle cx="18" cy="6" r="2" /></svg>;
    case "mustakil":
      return <svg {...base} {...p}><path d="M4 11 12 5l8 6v9H4v-9ZM10 20v-5h4v5" /></svg>;
    case "ticari":
      return <svg {...base} {...p}><path d="M4 9h16l-1-4H5L4 9ZM5 9v11h14V9M9 20v-6h6v6" /></svg>;
    default:
      return null;
  }
}
