import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { districts } from "@/data/locations";
import { propertyTypes, transactions, comboSlug } from "@/data/property-types";
import { getAllListings } from "@/lib/listings-store";
import { blogPosts } from "@/data/blog";

/**
 * Dinamik sitemap — programmatic SEO sayfalarının tamamını otomatik üretir.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const push = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly"
  ) => {
    entries.push({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    });
  };

  // Statik / ana sayfalar
  push("/", 1.0, "daily");
  push("/satilik", 0.9, "daily");
  push("/kiralik", 0.9, "daily");
  push("/blog", 0.7, "weekly");
  push("/iletisim", 0.5, "yearly");

  // İlçe + mahalle + tür kombinasyonları (programmatic)
  for (const d of districts) {
    push(`/izmir/${d.slug}`, 0.8);

    // İlçe + tür/işlem
    for (const tx of transactions) {
      for (const t of propertyTypes) {
        push(`/izmir/${d.slug}/${comboSlug(tx.slug, t.slug)}`, 0.7);
      }
    }

    // Mahalle
    for (const n of d.neighborhoods) {
      push(`/izmir/${d.slug}/${n.slug}`, 0.75);
      // Mahalle + tür/işlem
      for (const tx of transactions) {
        for (const t of propertyTypes) {
          push(`/izmir/${d.slug}/${n.slug}/${comboSlug(tx.slug, t.slug)}`, 0.65);
        }
      }
    }
  }

  // İlan detayları
  for (const l of await getAllListings()) {
    push(`/ilan/${l.slug}`, 0.6);
  }

  // Blog yazıları
  for (const p of blogPosts) {
    entries.push({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
