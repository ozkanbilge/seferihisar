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
      <div className="mb-10">
        <p className="eyebrow mb-3">{district.cityName}</p>
        <h1 className="display text-3xl md:text-4xl text-ink mb-4">
          {district.name} Emlak İlanları
        </h1>
        <div className="max-w-3xl space-y-3">
          {intro.map((p, i) => (
            <p key={i} className="text-sm text-fg-muted leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Type Links */}
      <div className="flex flex-wrap gap-2 mb-10">
        {transactions.map((tx) =>
          propertyTypes.map((type) => (
            <Link
              key={`${tx.slug}-${type.slug}`}
              href={`/izmir/${slug}/${comboSlug(tx.slug, type.slug)}`}
              className="px-3.5 py-2 rounded-full text-xs font-medium border border-cream-line text-fg-muted hover:border-gold hover:text-gold-deep transition-colors"
            >
              {tx.name} {type.name}
            </Link>
          ))
        )}
      </div>

      {/* Neighborhoods */}
      {district.neighborhoods.length > 0 && (
        <section className="mb-14">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">
            {district.name} Mahalleleri
          </h2>
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
        <div className="flex items-end justify-between mb-6">
          <h2 className="display text-2xl md:text-3xl text-ink">
            Tüm İlanlar
          </h2>
          <span className="text-sm text-fg-muted">{listings.length} ilan</span>
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
