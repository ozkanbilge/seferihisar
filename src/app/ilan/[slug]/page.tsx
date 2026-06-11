import Link from "next/link";
import { notFound } from "next/navigation";
import { listings, listingBySlug } from "@/data/listings";
import { districtBySlug, neighborhoodBySlug } from "@/data/locations";
import { propertyTypeBySlug, transactionBySlug } from "@/data/property-types";
import { formatPrice, formatArea, formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { listingSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ImageGallery } from "@/components/ImageGallery";
import { ListingSidebar } from "@/components/ListingSidebar";
import { ListingCard } from "@/components/ListingCard";
import {
  Bed,
  Bath,
  AreaIcon,
  MapPin,
  
  
  Check,
  Star,
  
} from "@/components/icons";
import type { Metadata } from "next";

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = listingBySlug(slug);
  if (!listing) return {};

  return buildMetadata({
    title: listing.title,
    description: listing.description,
    path: `/ilan/${listing.slug}`,
    image: listing.images[0],
  });
}

export default async function ListingDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const listing = listingBySlug(slug);
  if (!listing) notFound();

  const district = districtBySlug(listing.districtSlug);
  const neighborhood = neighborhoodBySlug(
    listing.districtSlug,
    listing.neighborhoodSlug
  );
  const type = propertyTypeBySlug(listing.typeSlug);
  const tx = transactionBySlug(listing.transaction);
  const placeName = neighborhood?.name ?? district?.name ?? "Seferihisar";

  const isPremium = listing.tier === "premium";

  // Benzer ilanlar: aynı tür + işlem öncelikli, sonra aynı ilçe
  const similar = [
    ...listings.filter(
      (l) => l.slug !== listing.slug && l.typeSlug === listing.typeSlug && l.transaction === listing.transaction
    ),
    ...listings.filter(
      (l) => l.slug !== listing.slug && l.districtSlug === listing.districtSlug && l.typeSlug !== listing.typeSlug
    ),
  ].slice(0, 3);

  const details = [
    { label: "İlan No", value: listing.ref, icon: "ref" },
    { label: "İlan Tarihi", value: formatDate(listing.createdAt), icon: "date" },
    { label: "İşlem", value: tx?.name, icon: "tag" },
    { label: "Tür", value: type?.name, icon: "home" },
    { label: "Alan", value: formatArea(listing.area), icon: "area" },
    listing.rooms ? { label: "Oda Sayısı", value: listing.rooms, icon: "bed" } : null,
    listing.bath ? { label: "Banyo", value: `${listing.bath}`, icon: "bath" } : null,
    listing.floor ? { label: "Kat/Yapı", value: listing.floor, icon: "floor" } : null,
    listing.buildingAge ? { label: "Yapı Yaşı", value: listing.buildingAge, icon: "age" } : null,
    listing.heating ? { label: "Isınma", value: listing.heating, icon: "heat" } : null,
  ].filter(Boolean) as { label: string; value: string | undefined; icon: string }[];

  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: tx?.name ?? "İlanlar", href: `/${listing.transaction}` },
          {
            label: placeName,
            href: `/izmir/${listing.districtSlug}${
              neighborhood ? `/${neighborhood.slug}` : ""
            }`,
          },
          { label: listing.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left: Gallery + Details */}
        <div className="lg:col-span-3">
          <div className="relative rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/50 via-gold/10 to-gold/40 shadow-[0_16px_44px_rgba(0,0,0,0.35)]">
            <span className="absolute top-2 left-2 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-10 pointer-events-none" aria-hidden />
            <span className="absolute top-2 right-2 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-gold/70 rounded-br z-10 pointer-events-none" aria-hidden />
            <div className="rounded-2xl overflow-hidden bg-surface p-2">
              <ImageGallery images={listing.images} alt={listing.title} />
            </div>
          </div>

          {/* Title + Price (mobile) */}
          <div className="mt-6 lg:hidden">
            <ListingHeader
              listing={listing}
              placeName={placeName}
              isPremium={isPremium}
            />
          </div>

          {/* Description */}
          <section className="mt-8">
            <SectionTitle>Açıklama</SectionTitle>
            <div className="relative flex rounded-2xl bg-surface border border-gold/15 shadow-[0_8px_28px_rgba(0,0,0,0.18)] overflow-hidden">
              {/* Sol altın aksan şeridi */}
              <span className="w-[3px] shrink-0 bg-gradient-to-b from-gold-bright via-gold to-gold-deep" aria-hidden />
              {/* Süslü arka plan tırnağı */}
              <span
                className="absolute -top-3 right-4 text-[5.5rem] leading-none font-[family-name:var(--font-cinzel-deco)] text-gold/[0.07] select-none pointer-events-none"
                aria-hidden
              >
                &rdquo;
              </span>
              <div className="relative px-5 py-5 md:px-6 md:py-6 w-full">
                <p className="text-sm md:text-[0.92rem] text-fg-muted leading-[1.95]">
                  {listing.description}
                </p>
                {/* Kitap sonu flörürü */}
                <div className="flex items-center justify-center gap-2.5 mt-5">
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/50" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/50" />
                </div>
              </div>
            </div>
          </section>

          {/* Details Table */}
          <section className="mt-8">
            <SectionTitle>İlan Detayları</SectionTitle>
            <div className="grid grid-cols-2 gap-px bg-gold/15 rounded-2xl overflow-hidden border border-gold/20">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="group bg-surface p-3.5 sm:p-4 flex items-center gap-3 transition-colors hover:bg-gold/[0.05]"
                >
                  <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/35">
                    <DetailIcon name={d.icon} />
                  </span>
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[0.6rem] text-gold/80 font-semibold uppercase tracking-[0.14em]">
                      {d.label}
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold text-fg break-words ${d.icon === "ref" ? "font-mono text-gold-bright tracking-wide" : ""}`}>
                      {d.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          {listing.features.length > 0 && (
            <section className="mt-8">
              <SectionTitle>Özellikler</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.features.map((f) => (
                  <div
                    key={f}
                    className="group flex items-center gap-2.5 text-xs sm:text-sm text-fg-muted px-3 py-2 rounded-xl border border-gold/10 bg-surface transition-all duration-300 hover:border-gold/40 hover:text-fg min-w-0"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-gold/60 group-hover:bg-gold shrink-0 transition-colors" />
                    {f}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
          {/* Title + Price (desktop) */}
          <div className="hidden lg:block mb-8">
            <ListingHeader
              listing={listing}
              placeName={placeName}
              isPremium={isPremium}
            />
          </div>

          {/* Contact Card & Appointment Form */}
          <ListingSidebar
            listingSlug={listing.slug}
            listingTitle={listing.title}
            listingPrice={listing.price}
            listingRef={listing.ref}
          />
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-14 md:mt-20">
          {/* Vitrin paneli: köşebentli altın çerçeve + ambiyans */}
          <div className="relative rounded-3xl border border-gold/20 bg-gradient-to-b from-ink-soft to-ink [.light_&]:from-[#fbf8f2] [.light_&]:to-[#f3eee3] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] [.light_&]:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            {/* Köşebent süslemeleri */}
            <span className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/60 rounded-tl z-10 pointer-events-none" aria-hidden />
            <span className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/60 rounded-tr z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/60 rounded-bl z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/60 rounded-br z-10 pointer-events-none" aria-hidden />

            {/* Sakin altın ambiyans */}
            <div className="absolute -top-20 left-1/3 w-[420px] h-[260px] rounded-full bg-gold/[0.06] blur-3xl animate-ambient pointer-events-none" />
            <div className="absolute -bottom-16 right-0 w-[300px] h-[200px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />

            <div className="relative px-5 py-8 md:px-10 md:py-10">
              {/* Başlık + eylem */}
              <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-4 min-[480px]:gap-6 mb-8">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <span className="hidden sm:block h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-gold/50" />
                  <h2 className="text-sm min-[420px]:text-base md:text-lg font-bold text-fg font-[family-name:var(--font-cinzel)] uppercase tracking-[0.1em] md:tracking-[0.14em] flex items-center gap-2 md:gap-2.5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                    Benzer İlanlar
                    <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                  </h2>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
                </div>
                <Link
                  href={`/${listing.transaction}`}
                  className="btn btn-outline text-[0.65rem] px-5 py-2 self-start min-[480px]:self-auto shrink-0"
                >
                  Tümünü Gör
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {similar.map((l) => (
                  <ListingCard key={l.slug} listing={l} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={[
          listingSchema(listing, placeName),
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: tx?.name ?? "İlanlar", path: `/${listing.transaction}` },
            { name: listing.title, path: `/ilan/${listing.slug}` },
          ]),
        ]}
      />
    </div>
  );
}

/* ---- Sub Components ---- */

/** İlan detayı satırlarının altın mini ikonları */
function DetailIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    ref: <path d="M5 9h14M5 15h14M9 4l-2 16M17 4l-2 16" />,
    date: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    tag: <><path d="M20 12l-8.5 8.5a2 2 0 0 1-2.8 0L3 14.8a2 2 0 0 1 0-2.8L11.5 3.5A2 2 0 0 1 12.9 3H19a2 2 0 0 1 2 2v6.1a2 2 0 0 1-.6 1.4z" /><circle cx="16" cy="8" r="1.3" /></>,
    home: <path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6" />,
    area: <><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M9 4v4M4 9h4M15 20v-4M20 15h-4" /></>,
    bed: <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2M21 18v2M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />,
    bath: <path d="M4 12h16a1 1 0 0 1 1 1c0 3-2 6-5 6H8c-3 0-5-3-5-6a1 1 0 0 1 1-1zM6 12V6a2 2 0 0 1 4 0M8 19l-1 2M16 19l1 2" />,
    floor: <path d="M4 21V9l8-5 8 5v12M4 21h16M9 21v-4h6v4M9 12h.01M15 12h.01" />,
    age: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>,
    heat: <path d="M12 3c2 3.5 5 5.5 5 9.5a5 5 0 0 1-10 0c0-2 .8-3.5 2-5 .3 1.5 1 2.5 2 3 0-3 .3-5.5 1-7.5z" />,
  };
  return (
    <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      {paths[name] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

/** Elmas işaretli, altın çizgili lüks bölüm başlığı */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-fg mb-4 font-[family-name:var(--font-cinzel)] uppercase tracking-[0.12em]">
      <span className="flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
        {children}
      </span>
      <span className="block h-px mt-2.5 bg-gradient-to-r from-gold/40 to-transparent" />
    </h2>
  );
}

function ListingHeader({
  listing,
  placeName,
  isPremium,
}: {
  listing: (typeof listings)[number];
  placeName: string;
  isPremium: boolean;
}) {
  return (
    <>
      {isPremium && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.65rem] font-bold uppercase tracking-[0.14em] mb-3 shadow-[0_2px_12px_rgba(192,160,98,0.35)]">
          <Star className="w-3 h-3" />
          Premium İlan
        </span>
      )}
      <h1 className="display text-xl md:text-[1.65rem] font-semibold text-fg leading-snug mb-3">
        {listing.title}
      </h1>
      <div className="flex items-center gap-1.5 text-fg-muted mb-4">
        <MapPin className="w-4 h-4 text-gold-deep" />
        <span className="text-sm">{placeName}</span>
      </div>

      <div className="gold-ring rounded-2xl p-[1.5px] shadow-[0_10px_34px_rgba(0,0,0,0.35),0_0_24px_rgba(192,160,98,0.1)]">
        <div className="rounded-[15px] px-4 py-3.5 flex items-center justify-between gap-3" style={{ backgroundColor: "var(--color-ink-card)" }}>
          <div className="min-w-0">
            <span className="block text-[0.6rem] text-gold/80 font-bold uppercase tracking-[0.18em] mb-0.5">
              {listing.transaction === "kiralik" ? "Aylık Kira Bedeli" : "Satış Bedeli"}
            </span>
            <span className="text-xl min-[400px]:text-2xl md:text-[1.9rem] font-bold royal-text font-[family-name:var(--font-cinzel)] tracking-wide whitespace-nowrap">
              {formatPrice(listing.price)}
            </span>
          </div>
          <a
            href={`https://wa.me/905323994291?text=${encodeURIComponent(`Merhaba, ${listing.ref} referans numaralı "${listing.title}" ilanı hakkında bilgi almak istiyorum.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile sor"
            className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-gold-deep via-gold to-gold-bright text-ink flex items-center justify-center hover:shadow-[0_0_18px_rgba(192,160,98,0.5)] hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.88L2 22l5.3-1.29c1.4.78 3.01 1.22 4.7 1.22 5.52 0 10-4.48 10-10S17.524 2 12.004 2zm5.72 14.1c-.24.67-1.19 1.29-1.92 1.39-.49.07-1.12.11-3.23-.77-2.7-1.13-4.42-3.89-4.56-4.08-.13-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.32.24-.26.54-.32.71-.32h.51c.16 0 .38-.06.59.44.22.54.76 1.86.83 2 .07.14.12.31.02.51-.1.2-.21.32-.36.5-.15.18-.31.39-.45.52-.15.15-.31.31-.13.62.18.31.8 1.31 1.72 2.13.92.82 1.7 1.08 2.02 1.23.32.15.63.09.83-.05.21-.14 1.34-.63 1.57-.75.23-.12.38-.18.44-.29.06.11.06.64-.18 1.31z"/></svg>
          </a>
        </div>
      </div>

      {/* Quick specs */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-5 pt-5 border-t border-cream-line">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0">
            <AreaIcon className="w-3.5 h-3.5 text-gold" />
          </span>
          {formatArea(listing.area)}
        </div>
        {listing.rooms && (
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0">
              <Bed className="w-3.5 h-3.5 text-gold" />
            </span>
            {listing.rooms}
          </div>
        )}
        {listing.bath && (
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0">
              <Bath className="w-3.5 h-3.5 text-gold" />
            </span>
            {listing.bath} Banyo
          </div>
        )}
      </div>
    </>
  );
}
