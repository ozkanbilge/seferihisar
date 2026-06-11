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

  const details = [
    { label: "İlan No", value: listing.ref },
    { label: "İlan Tarihi", value: formatDate(listing.createdAt) },
    { label: "İşlem", value: tx?.name },
    { label: "Tür", value: type?.name },
    { label: "Alan", value: formatArea(listing.area) },
    listing.rooms ? { label: "Oda Sayısı", value: listing.rooms } : null,
    listing.bath
      ? { label: "Banyo", value: `${listing.bath}` }
      : null,
    listing.floor ? { label: "Kat/Yapı", value: listing.floor } : null,
    listing.buildingAge
      ? { label: "Yapı Yaşı", value: listing.buildingAge }
      : null,
    listing.heating ? { label: "Isınma", value: listing.heating } : null,
  ].filter(Boolean) as { label: string; value: string | undefined }[];

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
          <div className="rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/50 via-gold/10 to-gold/40 shadow-[0_16px_44px_rgba(0,0,0,0.35)]">
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
            <p className="text-sm text-fg-muted leading-relaxed">
              {listing.description}
            </p>
          </section>

          {/* Details Table */}
          <section className="mt-8">
            <SectionTitle>İlan Detayları</SectionTitle>
            <div className="grid grid-cols-2 gap-px bg-gold/15 rounded-2xl overflow-hidden border border-gold/20">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="bg-surface p-4 flex flex-col gap-0.5 transition-colors hover:bg-gold/[0.04]"
                >
                  <span className="text-[0.62rem] text-gold/80 font-semibold uppercase tracking-[0.14em]">
                    {d.label}
                  </span>
                  <span className="text-sm font-medium text-fg">
                    {d.value}
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
                    className="group flex items-center gap-2.5 text-sm text-fg-muted px-3 py-2 rounded-xl border border-gold/10 bg-surface transition-all duration-300 hover:border-gold/40 hover:text-fg"
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
        <div className="lg:col-span-2">
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

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl md:text-[2rem] font-bold royal-text font-[family-name:var(--font-cinzel)] tracking-wide">
          {formatPrice(listing.price)}
        </span>
        {listing.transaction === "kiralik" && (
          <span className="text-sm text-fg-muted">/ aylık</span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="h-px w-12 bg-gradient-to-r from-gold/60 to-transparent" />
        <span className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
      </div>

      {/* Quick specs */}
      <div className="flex items-center gap-4 mt-5 pt-5 border-t border-cream-line">
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
