/**
 * Çözüm ortağı kurumların logo geçişli (sonsuz kayan) şeridi.
 * Görsel varlık gerektirmemesi için zarif tipografik logolar kullanılır;
 * hover'da soluk gümüşten altına döner.
 */
const BRANDS = [
  { name: "Ziraat Bankası", style: "font-bold tracking-tight" },
  { name: "İş Bankası", style: "font-serif italic font-semibold" },
  { name: "Garanti BBVA", style: "font-extrabold tracking-tight" },
  { name: "Akbank", style: "font-bold tracking-[0.2em] uppercase" },
  { name: "Yapı Kredi", style: "font-serif font-bold" },
  { name: "VakıfBank", style: "font-semibold tracking-wide" },
  { name: "Halkbank", style: "font-bold uppercase tracking-widest" },
  { name: "QNB", style: "font-extrabold tracking-[0.3em]" },
  { name: "DenizBank", style: "font-serif italic" },
  { name: "TKGM Web Tapu", style: "font-semibold uppercase tracking-wider" },
];

function BrandRow() {
  return (
    <div className="flex items-center gap-14 pr-14">
      {BRANDS.map((b) => (
        <span
          key={b.name}
          className={`text-lg md:text-xl whitespace-nowrap text-fg-invert-muted/45 hover:text-gold transition-colors duration-500 cursor-default select-none ${b.style}`}
        >
          {b.name}
        </span>
      ))}
    </div>
  );
}

export function BrandsMarquee() {
  return (
    <section className="bg-ink border-y border-ink-line relative overflow-hidden" id="brands">
      <div className="container-x pt-12 md:pt-14">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/50" />
          <p className="eyebrow text-center">Çözüm Ortaklarımız &amp; Anlaşmalı Kurumlar</p>
          <span className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </div>

      <div className="relative pb-12 md:pb-14">
        {/* Kenarlarda yumuşak kaybolma */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div className="brands-track flex w-max">
            <BrandRow />
            <BrandRow />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes brands-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .brands-track {
          animation: brands-scroll 35s linear infinite;
        }
        .brands-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .brands-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
