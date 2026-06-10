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
      className="group block rounded-2xl border border-cream-line bg-white p-5 hover:shadow-lg hover:border-gold/30 transition-all duration-300"
      id={`neighborhood-${neighborhood.slug}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-gold-deep" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-fg-muted group-hover:text-gold transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <h3 className="text-base font-semibold text-ink mb-1.5 group-hover:text-gold-deep transition-colors">
        {neighborhood.name}
      </h3>

      <p className="text-xs text-fg-muted leading-relaxed mb-4 line-clamp-2">
        {neighborhood.character}
      </p>

      <div className="flex items-center gap-4 pt-3 border-t border-cream-line">
        <div>
          <div className="text-[0.65rem] text-fg-muted uppercase tracking-wider mb-0.5">
            Ort. m² Satış
          </div>
          <div className="text-sm font-semibold text-ink">
            {formatPrice(neighborhood.avgM2.sale)}
          </div>
        </div>
        <div className="w-px h-8 bg-cream-line" />
        <div>
          <div className="text-[0.65rem] text-fg-muted uppercase tracking-wider mb-0.5">
            Ort. m² Kira
          </div>
          <div className="text-sm font-semibold text-ink">
            {formatPrice(neighborhood.avgM2.rent)}
          </div>
        </div>
      </div>
    </Link>
  );
}
