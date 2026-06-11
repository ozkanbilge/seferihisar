import { NextResponse } from "next/server";
import { getEmsalList, saveEmsalList } from "@/lib/cms";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  return NextResponse.json(await getEmsalList());
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }
  await saveEmsalList(body);
  return NextResponse.json({ ok: true });
}
