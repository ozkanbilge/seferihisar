import { listings as seedListings, type Listing } from "@/data/listings";
import { getRawContent, setRawContent } from "@/lib/site-content";

/**
 * İlan deposu: koddaki örnek ilanlar (seed) + admin panelden yapılan
 * ekleme/düzenleme/silmelerin tutulduğu içerik (Neon Postgres) birleşimi.
 * Düzenlenen seed ilanları slug bazında ezilir; silinenler gizlenir.
 */
const KEY = "listings";

interface AdminListingsFile {
  upserts: Record<string, Listing>;
  deleted: string[];
}

// Build sırasında (statik sayfalar) tekrar tekrar çağrılır; kısa TTL'li memo.
let memo: { data: AdminListingsFile; exp: number } | null = null;
const TTL_MS = 30_000;

async function readFile(): Promise<AdminListingsFile> {
  const now = Date.now();
  if (memo && memo.exp > now) return memo.data;
  const raw = (await getRawContent(KEY, "tr")) as AdminListingsFile | null;
  const data = raw ?? { upserts: {}, deleted: [] };
  memo = { data, exp: now + TTL_MS };
  return data;
}

async function writeFile(data: AdminListingsFile) {
  await setRawContent(KEY, "tr", data);
  memo = null;
}

/** Seed + admin birleşimi; en yeni ilan önde */
export async function getAllListings(): Promise<Listing[]> {
  const admin = await readFile();
  const deleted = new Set(admin.deleted);
  const map = new Map<string, Listing>();
  for (const l of seedListings) map.set(l.slug, l);
  for (const [slug, l] of Object.entries(admin.upserts)) map.set(slug, l);
  return [...map.values()]
    .filter((l) => !deleted.has(l.slug))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getListing(slug: string): Promise<Listing | null> {
  const all = await getAllListings();
  return all.find((l) => l.slug === slug) ?? null;
}

export async function getFeaturedListings(): Promise<Listing[]> {
  return (await getAllListings()).filter((l) => l.featured);
}

export async function upsertListing(listing: Listing) {
  const admin = await readFile();
  admin.upserts[listing.slug] = listing;
  admin.deleted = admin.deleted.filter((s) => s !== listing.slug);
  await writeFile(admin);
}

export async function deleteListing(slug: string) {
  const admin = await readFile();
  delete admin.upserts[slug];
  if (!admin.deleted.includes(slug)) admin.deleted.push(slug);
  await writeFile(admin);
}
