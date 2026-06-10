import { notFound } from "next/navigation";
import Link from "next/link";
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
import { site } from "@/lib/site";
import {
  Bed,
  Bath,
  AreaIcon,
  MapPin,
  Phone,
  Mail,
  Check,
  Star,
  ArrowRight,
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
          <ImageGallery images={listing.images} alt={listing.title} />

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
            <h2 className="text-lg font-semibold text-ink mb-3">Açıklama</h2>
            <p className="text-sm text-fg-muted leading-relaxed">
              {listing.description}
            </p>
          </section>

          {/* Details Table */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-ink mb-4">
              İlan Detayları
            </h2>
            <div className="grid grid-cols-2 gap-px bg-cream-line rounded-xl overflow-hidden">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="bg-white p-4 flex flex-col gap-0.5"
                >
                  <span className="text-[0.65rem] text-fg-muted uppercase tracking-wider">
                    {d.label}
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          {listing.features.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-ink mb-4">
                Özellikler
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-sm text-fg-muted"
                  >
                    <Check className="w-4 h-4 text-gold-deep shrink-0" />
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
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold text-ink text-[0.65rem] font-bold uppercase tracking-wider mb-3">
          <Star className="w-3 h-3" />
          Premium İlan
        </span>
      )}
      <h1 className="text-xl md:text-2xl font-bold text-ink leading-snug mb-3">
        {listing.title}
      </h1>
      <div className="flex items-center gap-1.5 text-fg-muted mb-4">
        <MapPin className="w-4 h-4 text-gold-deep" />
        <span className="text-sm">{placeName}</span>
      </div>

      <div className="text-2xl md:text-3xl font-bold text-gold-deep mb-1">
        {formatPrice(listing.price)}
      </div>
      {listing.transaction === "kiralik" && (
        <span className="text-sm text-fg-muted">/ aylık</span>
      )}

      {/* Quick specs */}
      <div className="flex items-center gap-5 mt-5 pt-5 border-t border-cream-line">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <AreaIcon className="w-4 h-4 text-gold-deep" />
          {formatArea(listing.area)}
        </div>
        {listing.rooms && (
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <Bed className="w-4 h-4 text-gold-deep" />
            {listing.rooms}
          </div>
        )}
        {listing.bath && (
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <Bath className="w-4 h-4 text-gold-deep" />
            {listing.bath} Banyo
          </div>
        )}
      </div>
    </>
  );
}
