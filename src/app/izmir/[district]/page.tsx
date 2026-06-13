import { notFound } from "next/navigation";
import Link from "next/link";
import { districts, districtBySlug } from "@/data/locations";
import { propertyTypes, transactions, comboSlug } from "@/data/property-types";
import { filterListings } from "@/lib/query";
import { regionIntro, regionFaq } from "@/lib/content";
import { ListingGrid } from "@/components/ListingGrid";
import { NeighborhoodCard } from "@/components/NeighborhoodCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, itemListSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight } from "@/components/icons";
import type { Metadata } from "next";

export function generateStaticParams() {
  return districts.map((d) => ({ district: d.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  const { district: slug } = await props.params;
  const district = districtBySlug(slug);
  if (!district) return {};

  return buildMetadata({
    title: `${district.name} Emlak İlanları`,
    description: district.summary,
    path: `/izmir/${district.slug}`,
  });
}

export default async function DistrictPage(
  props: { params: Promise<{ district: string }> }
) {
  const { district: slug } = await props.params;
  const district = districtBySlug(slug);
  if (!district) notFound();

  const listings = filterListings({ districtSlug: slug });
  const intro = regionIntro(district);
  const faqs = regionFaq(district);

  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "İzmir", href: "/" },
          { label: district.name },
        ]}
      />

      {/* Heading */}
      <div className="relative mb-10">
        <div className="absolute -top-12 right-0 w-[440px] h-[280px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
        <div className="relative flex items-center gap-3 mb-3">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
          <p className="eyebrow">{district.cityName}</p>
          <span className="h-px w-14 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
        <h1 className="relative display text-3xl md:text-5xl text-fg mb-2">
          {district.name}
          <span className="block text-lg md:text-2xl text-fg-muted font-normal mt-1 font-[family-name:var(--font-sans)]">
            Emlak İlanları &amp; Bölge Rehberi
          </span>
        </h1>
        <div className="flex items-center gap-2.5 mb-5">
          <span className="h-px w-16 bg-gradient-to-r from-gold/60 to-transparent" />
          <span className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
          <span className="h-px w-24 bg-gradient-to-r from-gold/30 to-transparent" />
        </div>
        <div className="relative max-w-3xl space-y-3">
          {intro.map((p, i) => (
            <p key={i} className="text-sm text-fg-muted leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Type Links — işleme göre gruplu hızlı filtreler */}
      <div className="space-y-3 mb-12">
        {transactions.map((tx) => (
          <div key={tx.slug} className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[0.62rem] font-bold text-gold uppercase tracking-[0.16em] mr-1 shrink-0">
              <span className="w-1 h-1 rotate-45 bg-gold" />
              {tx.name}
            </span>
            {propertyTypes.map((type) => (
              <Link
                key={`${tx.slug}-${type.slug}`}
                href={`/izmir/${slug}/${comboSlug(tx.slug, type.slug)}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-gold/15 bg-surface text-fg-muted hover:border-gold/50 hover:text-gold-bright hover:shadow-[0_0_14px_rgba(192,160,98,0.12)] transition-all duration-300"
              >
                {type.name}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Neighborhoods */}
      {district.neighborhoods.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="display text-2xl md:text-3xl text-fg flex items-center gap-3 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
              {district.name} Mahalleleri
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {district.neighborhoods.map((n) => (
              <NeighborhoodCard
                key={n.slug}
                neighborhood={n}
                districtSlug={slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* Listings */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="display text-2xl md:text-3xl text-fg flex items-center gap-3 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
            Tüm İlanlar
          </h2>
          <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 text-[0.62rem] font-bold text-gold-deep uppercase tracking-[0.14em] shrink-0">
            {listings.length} İlan
          </span>
        </div>
        <ListingGrid listings={listings} />
      </section>

      {/* FAQ */}
      <FaqSection faqs={faqs} />

      <JsonLd
        data={[
          itemListSchema(listings, `${district.name} Emlak İlanları`),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "İzmir", path: "/" },
            { name: district.name, path: `/izmir/${slug}` },
          ]),
        ]}
      />
    </div>
  );
}
