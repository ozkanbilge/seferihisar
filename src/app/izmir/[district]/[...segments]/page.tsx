import { notFound } from "next/navigation";
import Link from "next/link";
import {
  districts,
  districtBySlug,
  neighborhoodBySlug,
} from "@/data/locations";
import {
  propertyTypes,
  transactions,
  parseTypeCombo,
  comboSlug,
} from "@/data/property-types";
import { filterListings } from "@/lib/query";
import { regionIntro, regionFaq } from "@/lib/content";
import { ListingGrid } from "@/components/ListingGrid";
import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
} from "@/lib/schema";
import {
  buildMetadata,
  listingTitleTemplate,
  metaDescriptionTemplate,
} from "@/lib/seo";
import type { Metadata } from "next";

/**
 * Catch-all route handles:
 *   /izmir/seferihisar/sigacik           → neighborhood
 *   /izmir/seferihisar/satilik-villa     → district + type combo
 *   /izmir/seferihisar/sigacik/satilik-villa → neighborhood + type combo
 */

interface Params {
  district: string;
  segments: string[];
}

export function generateStaticParams() {
  const params: { district: string; segments: string[] }[] = [];

  for (const d of districts) {
    // district + combo: /izmir/seferihisar/satilik-villa
    for (const tx of transactions) {
      for (const t of propertyTypes) {
        params.push({
          district: d.slug,
          segments: [comboSlug(tx.slug, t.slug)],
        });
      }
    }
    // neighborhood: /izmir/seferihisar/sigacik
    for (const n of d.neighborhoods) {
      params.push({ district: d.slug, segments: [n.slug] });
      // neighborhood + combo: /izmir/seferihisar/sigacik/satilik-villa
      for (const tx of transactions) {
        for (const t of propertyTypes) {
          params.push({
            district: d.slug,
            segments: [n.slug, comboSlug(tx.slug, t.slug)],
          });
        }
      }
    }
  }

  return params;
}

function resolveSegments(districtSlug: string, segments: string[]) {
  const district = districtBySlug(districtSlug);
  if (!district) return null;

  if (segments.length === 1) {
    // Could be neighborhood or type combo
    const combo = parseTypeCombo(segments[0]);
    if (combo) {
      return { district, neighborhood: undefined, combo };
    }
    const neighborhood = neighborhoodBySlug(districtSlug, segments[0]);
    if (neighborhood) {
      return { district, neighborhood, combo: undefined };
    }
    return null;
  }

  if (segments.length === 2) {
    // neighborhood + combo
    const neighborhood = neighborhoodBySlug(districtSlug, segments[0]);
    const combo = parseTypeCombo(segments[1]);
    if (neighborhood && combo) {
      return { district, neighborhood, combo };
    }
    return null;
  }

  return null;
}

export async function generateMetadata(
  props: { params: Promise<{ district: string; segments: string[] }> }
): Promise<Metadata> {
  const { district: districtSlug, segments } = await props.params;
  const resolved = resolveSegments(districtSlug, segments);
  if (!resolved) return {};

  const { district, neighborhood, combo } = resolved;
  const listings = filterListings({
    districtSlug: district.slug,
    neighborhoodSlug: neighborhood?.slug,
    transaction: combo?.transaction.slug,
    typeSlug: combo?.type.slug,
  });

  const title = listingTitleTemplate({
    neighborhood: neighborhood?.name,
    district: district.name,
    transaction: combo?.transaction.name ?? "Satılık & Kiralık",
    type: combo?.type.name,
  });

  const place = neighborhood?.name ?? district.name;
  const description = metaDescriptionTemplate({
    place,
    transaction: combo?.transaction.name ?? "Satılık & Kiralık",
    type: combo?.type.name,
    count: listings.length,
  });

  const pathParts = [`/izmir/${district.slug}`, ...segments];
  return buildMetadata({
    title,
    description,
    path: pathParts.join("/"),
  });
}

export default async function SegmentsPage(
  props: { params: Promise<{ district: string; segments: string[] }> }
) {
  const { district: districtSlug, segments } = await props.params;
  const resolved = resolveSegments(districtSlug, segments);
  if (!resolved) notFound();

  const { district, neighborhood, combo } = resolved;

  const listings = filterListings({
    districtSlug: district.slug,
    neighborhoodSlug: neighborhood?.slug,
    transaction: combo?.transaction.slug,
    typeSlug: combo?.type.slug,
  });

  const intro = regionIntro(
    district,
    neighborhood,
    combo?.type,
    combo?.transaction
  );
  const faqs = regionFaq(
    district,
    neighborhood,
    combo?.type,
    combo?.transaction
  );

  const place = neighborhood?.name ?? district.name;
  const h1Parts: string[] = [place];
  if (combo) {
    h1Parts.push(combo.transaction.name, combo.type.name, "İlanları");
  } else {
    h1Parts.push("Emlak İlanları");
  }

  // Breadcrumb
  const crumbs: BreadcrumbItem[] = [
    { label: "İzmir", href: "/" },
    { label: district.name, href: `/izmir/${district.slug}` },
  ];
  if (neighborhood && combo) {
    crumbs.push({
      label: neighborhood.name,
      href: `/izmir/${district.slug}/${neighborhood.slug}`,
    });
    crumbs.push({ label: `${combo.transaction.name} ${combo.type.name}` });
  } else if (neighborhood) {
    crumbs.push({ label: neighborhood.name });
  } else if (combo) {
    crumbs.push({ label: `${combo.transaction.name} ${combo.type.name}` });
  }

  const bcPath = [
    { name: "Ana Sayfa", path: "/" },
    { name: "İzmir", path: "/" },
    { name: district.name, path: `/izmir/${district.slug}` },
  ];
  if (neighborhood) {
    bcPath.push({
      name: neighborhood.name,
      path: `/izmir/${district.slug}/${neighborhood.slug}`,
    });
  }

  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb items={crumbs} />

      {/* Heading */}
      <div className="mb-10">
        <p className="eyebrow mb-3">{district.name}</p>
        <h1 className="display text-3xl md:text-4xl text-fg mb-4">
          {h1Parts.join(" ")}
        </h1>
        <div className="max-w-3xl space-y-3">
          {intro.map((p, i) => (
            <p key={i} className="text-sm text-fg-muted leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Filter Links (only on neighborhood pages without combo) */}
      {neighborhood && !combo && (
        <div className="flex flex-wrap gap-2 mb-10">
          {transactions.map((tx) =>
            propertyTypes.map((type) => (
              <Link
                key={`${tx.slug}-${type.slug}`}
                href={`/izmir/${district.slug}/${neighborhood.slug}/${comboSlug(tx.slug, type.slug)}`}
                className="px-3.5 py-2 rounded-full text-xs font-medium border border-cream-line text-fg-muted hover:border-gold hover:text-gold-bright transition-colors"
              >
                {tx.name} {type.name}
              </Link>
            ))
          )}
        </div>
      )}

      {/* Listings */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="display text-2xl text-fg">İlanlar</h2>
          <span className="text-sm text-fg-muted">{listings.length} ilan</span>
        </div>
        <ListingGrid listings={listings} />
      </section>

      {/* FAQ */}
      <FaqSection faqs={faqs} />

      <JsonLd
        data={[
          itemListSchema(listings, h1Parts.join(" ")),
          faqSchema(faqs),
          breadcrumbSchema(bcPath),
        ]}
      />
    </div>
  );
}
