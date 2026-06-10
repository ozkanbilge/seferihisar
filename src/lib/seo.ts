import type { Metadata } from "next";
import { site } from "./site";

interface SeoInput {
  title: string;
  description: string;
  /** "/izmir/seferihisar" gibi path — canonical için */
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

/** Tüm sayfalarda tutarlı metadata üretir (canonical + OpenGraph + Twitter). */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex,
}: SeoInput): Metadata {
  const url = `${site.url}${path}`;
  const ogImage = image ?? `${site.url}/og-default.jpg`;
  const fullTitle =
    title === site.name ? title : `${title} | ${site.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

/* ---- Programmatic başlık & açıklama şablonları ---- */

export function listingTitleTemplate(parts: {
  neighborhood?: string;
  district: string;
  transaction: string; // Satılık / Kiralık
  type?: string; // Villa, Arsa...
}): string {
  const place = parts.neighborhood ?? parts.district;
  if (parts.type) {
    return `${place} ${parts.transaction} ${parts.type} İlanları`;
  }
  return `${place} ${parts.transaction} İlanları`;
}

export function metaDescriptionTemplate(parts: {
  place: string;
  transaction: string;
  type?: string;
  count: number;
}): string {
  const subject = parts.type
    ? `${parts.transaction.toLowerCase()} ${parts.type.toLowerCase()}`
    : `${parts.transaction.toLowerCase()} gayrimenkul`;
  return `${parts.place} bölgesindeki ${subject} ilanlarını keşfedin. ${parts.count}+ güncel portföy, gerçek fiyatlar, detaylı fotoğraflar ve yatırım fırsatları ${site.name}'da.`;
}
