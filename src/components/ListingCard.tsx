import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/data/listings";
import { formatPriceShort, formatArea } from "@/lib/format";
import { Bed, Bath, AreaIcon, MapPin, Star } from "@/components/icons";

export function ListingCard({ listing }: { listing: Listing }) {
  const isPremium = listing.tier === "premium";
  const isVitrin = listing.tier === "vitrin";

  return (
    <Link
      href={`/ilan/${listing.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-cream-line shadow-sm hover:shadow-xl hover:border-gold/40 transition-all duration-300"
      id={`listing-${listing.slug}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {isPremium && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold text-ink text-[0.65rem] font-bold uppercase tracking-wider">
              <Star className="w-3 h-3" />
              Premium
            </span>
          )}
          {isVitrin && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-accent text-white text-[0.65rem] font-bold uppercase tracking-wider">
              Vitrin
            </span>
          )}
        </div>

        {/* Transaction badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
              listing.transaction === "satilik"
                ? "bg-ink/80 text-cream backdrop-blur-sm"
                : "bg-white/90 text-ink backdrop-blur-sm"
            }`}
          >
            {listing.transaction === "satilik" ? "Satılık" : "Kiralık"}
          </span>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-bold text-lg drop-shadow-md">
            {formatPriceShort(listing.price)}
          </span>
          {listing.transaction === "kiralik" && (
            <span className="text-white/70 text-xs ml-1">/ay</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2 mb-2 group-hover:text-gold-deep transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1.5 text-fg-muted mb-3">
          <MapPin className="w-3.5 h-3.5 text-gold-deep" />
          <span className="text-xs capitalize">
            {listing.neighborhoodSlug.replace(/-/g, " ")},{" "}
            {listing.districtSlug.replace(/-/g, " ")}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 pt-3 border-t border-cream-line">
          <div className="flex items-center gap-1.5 text-xs text-fg-muted">
            <AreaIcon className="w-3.5 h-3.5" />
            <span>{formatArea(listing.area)}</span>
          </div>
          {listing.rooms && (
            <div className="flex items-center gap-1.5 text-xs text-fg-muted">
              <Bed className="w-3.5 h-3.5" />
              <span>{listing.rooms}</span>
            </div>
          )}
          {listing.bath && (
            <div className="flex items-center gap-1.5 text-xs text-fg-muted">
              <Bath className="w-3.5 h-3.5" />
              <span>{listing.bath}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
