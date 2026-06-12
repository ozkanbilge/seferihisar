import { promises as fs } from "fs";
import path from "path";
import { listings as seedListings, type Listing } from "@/data/listings";

/**
 * İlan deposu: koddaki örnek ilanlar (seed) + admin panelden yapılan
 * ekleme/düzenleme/silmelerin tutulduğu data/listings-admin.json birleşimi.
 * Düzenlenen seed ilanları slug bazında ezilir; silinenler gizlenir.
 */
const FILE = path.join(process.cwd(), "data", "listings-admin.json");

interface AdminListingsFile {
  upserts: Record<string, Listing>;
  deleted: string[];
}

async function readFile(): Promise<AdminListingsFile> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as AdminListingsFile;
  } catch {
    return { upserts: {}, deleted: [] };
  }
}

async function writeFile(data: AdminListingsFile) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
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
