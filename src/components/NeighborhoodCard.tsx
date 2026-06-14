import Link from "next/link";
import type { Neighborhood } from "@/data/locations";
import { formatPrice } from "@/lib/format";
import { MapPin, ArrowUpRight } from "@/components/icons";

export function NeighborhoodCard({
  neighborhood,
  districtSlug,
}: {
  neighborhood: Neighborhood;
  districtSlug: string;
}) {
  return (
    <Link
      href={`/izmir/${districtSlug}/${neighborhood.slug}`}
      className="group relative block rounded-2xl card-luxe p-5 hover-lift overflow-hidden"
      id={`neighborhood-${neighborhood.slug}`}
    >
      {/* Üst altın aksan — hover'da uzar */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gold/60 via-gold/30 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" aria-hidden />
      {/* Hover'da süzülen altın ışıltı */}
      <span className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gold/[0.08] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-start justify-between mb-3">
        {/* Altın madalyon iğne */}
        <span className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/45 group-hover:-translate-y-0.5">
          <MapPin className="w-[18px] h-[18px] text-gold" />
        </span>
        <ArrowUpRight className="w-4 h-4 text-gold/40 group-hover:text-gold transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <h3 className="relative text-base font-bold text-fg mb-1.5 group-hover:text-gold-deep transition-colors">
        {neighborhood.name}
      </h3>

      <p className="relative text-xs text-fg-muted leading-relaxed mb-4 line-clamp-2">
        {neighborhood.character}
      </p>

      <div className="relative pt-3 border-t border-gold/10 flex items-end justify-between gap-2">
        <div>
          <div className="text-[0.55rem] text-gold/80 font-bold uppercase tracking-[0.14em] mb-0.5">
            Ort. m² Satış
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-fg">
              {formatPrice(neighborhood.avgM2.sale)}
            </span>
            <span className="inline-flex items-center text-gold-deep" aria-hidden>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
            </span>
          </div>
        </div>
        {/* Keşfet ipucu — hover'da belirir */}
        <span className="text-[0.58rem] font-semibold text-gold-deep uppercase tracking-wider opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1 pb-0.5">
          Keşfet
          <span className="w-1 h-1 rotate-45 bg-gold" />
        </span>
      </div>
    </Link>
  );
}
