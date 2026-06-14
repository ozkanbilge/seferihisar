import { NextResponse } from "next/server";
import { getViews, incrementView } from "@/lib/blog-views-store";

export const dynamic = "force-dynamic";

const valid = (s: string | null) => !!s && /^[a-z0-9-]+$/.test(s);

/** Okunma sayısını getir */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!valid(slug)) return NextResponse.json({ error: "Geçersiz slug." }, { status: 400 });
  return NextResponse.json({ views: await getViews(slug!) });
}

/** Okunmayı artır */
export async function POST(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!valid(slug)) return NextResponse.json({ error: "Geçersiz slug." }, { status: 400 });
  return NextResponse.json({ views: await incrementView(slug!) });
}
