import { NextResponse } from "next/server";
import { getAllListings, upsertListing, deleteListing } from "@/lib/listings-store";
import { isAdminRequest } from "@/lib/admin-auth";
import type { Listing } from "@/data/listings";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  return NextResponse.json(await getAllListings());
}

const REQUIRED: (keyof Listing)[] = [
  "slug",
  "title",
  "transaction",
  "typeSlug",
  "districtSlug",
  "neighborhoodSlug",
  "price",
  "area",
  "description",
];

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as Listing | null;
  if (!body || REQUIRED.some((k) => body[k] === undefined || body[k] === "")) {
    return NextResponse.json(
      { error: `Zorunlu alanlar eksik: ${REQUIRED.join(", ")}` },
      { status: 400 }
    );
  }
  if (!/^[a-z0-9-]+$/.test(body.slug)) {
    return NextResponse.json(
      { error: "Slug yalnızca küçük harf, rakam ve tire içerebilir." },
      { status: 400 }
    );
  }

  const listing: Listing = {
    ...body,
    price: Number(body.price),
    area: Number(body.area),
    bath: body.bath ? Number(body.bath) : undefined,
    features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
    images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
    videos: Array.isArray(body.videos) ? body.videos.filter(Boolean) : undefined,
    tier: body.tier ?? "ucretsiz",
    featured: Boolean(body.featured),
    createdAt: body.createdAt || new Date().toISOString().slice(0, 10),
    ref: body.ref || `PE-${Date.now().toString().slice(-6)}`,
  };
  await upsertListing(listing);
  return NextResponse.json({ ok: true, slug: listing.slug });
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug gerekli." }, { status: 400 });
  }
  await deleteListing(slug);
  return NextResponse.json({ ok: true });
}
