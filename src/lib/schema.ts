import { site } from "./site";
import type { Listing } from "@/data/listings";
import { formatPrice } from "./format";

/** JSON-LD builder'ları — schema.org yapılandırılmış veri */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    url: site.url,
    image: `${site.url}/og-default.jpg`,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: "İzmir Seferihisar",
    sameAs: Object.values(site.social),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/satilik?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function listingSchema(l: Listing, placeName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: l.title,
    description: l.description,
    url: `${site.url}/ilan/${l.slug}`,
    image: l.images,
    datePosted: l.createdAt,
    offers: {
      "@type": "Offer",
      price: l.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      description: formatPrice(l.price),
    },
    about: {
      "@type": "Residence",
      name: l.title,
      floorSize: {
        "@type": "QuantitativeValue",
        value: l.area,
        unitCode: "MTK",
      },
      ...(l.rooms ? { numberOfRooms: l.rooms } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: placeName,
        addressRegion: "İzmir",
        addressCountry: "TR",
      },
    },
  };
}

export function itemListSchema(
  listings: Listing[],
  name: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 20).map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/ilan/${l.slug}`,
      name: l.title,
    })),
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/og-default.jpg` },
    },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };
}
