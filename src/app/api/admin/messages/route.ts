import { NextResponse } from "next/server";
import { getMessages, setMessageRead, deleteMessage } from "@/lib/messages-store";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  return NextResponse.json(await getMessages());
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string" || typeof body?.read !== "boolean") {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const ok = await setMessageRead(body.id, body.read);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  const ok = await deleteMessage(id);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
}
