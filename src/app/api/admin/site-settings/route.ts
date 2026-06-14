import { NextResponse } from "next/server";
import { getRawSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json(await getRawSiteSettings());
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.content !== "object") {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  try {
    await saveSiteSettings(body.content);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Kaydedilemedi." },
      { status: 500 },
    );
  }
}
