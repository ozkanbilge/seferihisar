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
      className="group relative block rounded-2xl border border-gold/15 bg-surface p-5 hover:border-gold/40 hover-lift overflow-hidden"
      id={`neighborhood-${neighborhood.slug}`}
    >
      {/* Hover'da süzülen altın ışıltı */}
      <span className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gold/[0.07] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-start justify-between mb-3">
        {/* Altın madalyon iğne */}
        <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/40">
          <MapPin className="w-4 h-4 text-gold" />
        </span>
        <ArrowUpRight className="w-4 h-4 text-gold/40 group-hover:text-gold transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <h3 className="relative text-base font-semibold text-fg mb-1.5 group-hover:text-gold-bright transition-colors">
        {neighborhood.name}
      </h3>

      <p className="relative text-xs text-fg-muted leading-relaxed mb-4 line-clamp-2">
        {neighborhood.character}
      </p>

      <div className="relative pt-3 border-t border-gold/10 flex items-end justify-between gap-2">
        <div>
          <div className="text-[0.58rem] text-gold/80 font-bold uppercase tracking-[0.14em] mb-0.5">
            Ort. m² Satış
          </div>
          <div className="text-sm font-bold text-fg">
            {formatPrice(neighborhood.avgM2.sale)}
          </div>
        </div>
        {/* Keşfet ipucu — hover'da belirir */}
        <span className="text-[0.58rem] font-semibold text-gold-deep uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 pb-0.5">
          Keşfet
          <span className="w-1 h-1 rotate-45 bg-gold" />
        </span>
      </div>
    </Link>
  );
}
