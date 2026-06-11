import { NextResponse } from "next/server";
import { getHomepage, saveHomepage } from "@/lib/cms";
import { isAdminRequest } from "@/lib/admin-auth";
import { isLang } from "@/lib/i18n";

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") || "tr";
  if (!isLang(lang)) {
    return NextResponse.json({ error: "Geçersiz dil." }, { status: 400 });
  }
  return NextResponse.json(await getHomepage(lang));
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || !isLang(body.lang) || typeof body.content !== "object") {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  await saveHomepage(body.lang, body.content);
  return NextResponse.json({ ok: true });
}
