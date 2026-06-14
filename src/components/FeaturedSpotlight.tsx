import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/data/listings";
import { formatPriceShort, formatArea } from "@/lib/format";
import { Bed, Bath, AreaIcon, MapPin, Star, ArrowRight } from "@/components/icons";

/** Vitrinin başındaki büyük "Haftanın Seçimi" ilanı — yatay editoryal kart */
export function FeaturedSpotlight({ listing }: { listing: Listing }) {
  const isPremium = listing.tier === "premium";
  const isVitrin = listing.tier === "vitrin";

  return (
    <Link
      href={`/ilan/${listing.slug}`}
      id={`listing-${listing.slug}`}
      className="group relative grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden card-luxe"
    >
      {/* ── Görsel ── */}
      <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          priority
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/35" />

        {/* Köşebent süslemeleri */}
        <span className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/70 rounded-tl z-20 pointer-events-none" aria-hidden />
        <span className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/70 rounded-tr z-20 pointer-events-none" aria-hidden />
        <span className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/70 rounded-bl z-20 pointer-events-none" aria-hidden />
        <span className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/70 rounded-br z-20 pointer-events-none" aria-hidden />

        {/* Hover ışık süpürmesi */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" aria-hidden />

        {/* Haftanın Seçimi şeridi */}
        <span className="absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.6rem] font-bold uppercase tracking-[0.16em] shadow-[0_4px_14px_rgba(192,160,98,0.45)]">
          <span className="w-1 h-1 rotate-45 bg-ink/60" />
          Haftanın Seçimi
        </span>

        {/* Fotoğraf sayısı */}
        {listing.images.length > 1 && (
          <span className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/60 backdrop-blur-md border border-white/15 text-fg-invert text-[0.6rem] font-semibold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            {listing.images.length}
          </span>
        )}

        {/* Cam fiyat rozeti */}
        <div className="absolute bottom-5 right-5 z-10 px-3.5 py-1.5 rounded-xl bg-ink/65 backdrop-blur-md border border-gold/30 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <span className="text-gold-bright font-extrabold text-base md:text-lg leading-none tabular-nums">
            {formatPriceShort(listing.price)}
          </span>
          {listing.transaction === "kiralik" && (
            <span className="text-fg-invert-muted text-[0.7rem] ml-1">/ay</span>
          )}
        </div>

        {/* Tür / tier rozetleri */}
        <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2">
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
          <span className="px-2.5 py-1 rounded-full bg-ink/80 backdrop-blur-sm text-fg-invert text-[0.65rem] font-bold uppercase tracking-wider">
            {listing.transaction === "satilik" ? "Satılık" : "Kiralık"}
          </span>
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="lg:col-span-5 relative flex flex-col justify-center p-6 md:p-8 bg-surface">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
          <p className="eyebrow">Vitrin İlanı</p>
          <span className="h-px flex-1 max-w-[5rem] bg-gradient-to-r from-gold/50 to-transparent" />
        </div>

        <div className="flex items-center gap-1.5 text-fg-muted mb-3">
          <MapPin className="w-3.5 h-3.5 text-gold-deep" />
          <span className="text-xs capitalize">
            {listing.neighborhoodSlug.replace(/-/g, " ")},{" "}
            {listing.districtSlug.replace(/-/g, " ")}
          </span>
        </div>

        <h3 className="display text-2xl md:text-3xl text-fg leading-snug line-clamp-2 mb-3 group-hover:text-gold-deep transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-baseline gap-1.5 mb-5">
          <span className="text-2xl md:text-3xl font-extrabold text-gold-deep tabular-nums">
            {formatPriceShort(listing.price)}
          </span>
          {listing.transaction === "kiralik" && (
            <span className="text-fg-muted text-sm">/ay</span>
          )}
        </div>

        {/* Özellikler */}
        <div className="flex items-center gap-5 pt-4 border-t border-cream-line mb-6">
          <div className="flex items-center gap-1.5 text-sm text-fg-muted">
            <AreaIcon className="w-4 h-4 text-gold-deep" />
            <span>{formatArea(listing.area)}</span>
          </div>
          {listing.rooms && (
            <div className="flex items-center gap-1.5 text-sm text-fg-muted">
              <Bed className="w-4 h-4 text-gold-deep" />
              <span>{listing.rooms}</span>
            </div>
          )}
          {listing.bath && (
            <div className="flex items-center gap-1.5 text-sm text-fg-muted">
              <Bath className="w-4 h-4 text-gold-deep" />
              <span>{listing.bath}</span>
            </div>
          )}
        </div>

        <span className="btn btn-gold self-start px-7 text-xs font-bold uppercase tracking-[0.14em]">
          İlanı İncele
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
