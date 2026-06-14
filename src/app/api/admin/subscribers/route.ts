import { NextResponse } from "next/server";
import { getSubscribers, removeSubscriber } from "@/lib/subscribers-store";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  return NextResponse.json(await getSubscribers());
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const email = new URL(request.url).searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email gerekli." }, { status: 400 });
  await removeSubscriber(email);
  return NextResponse.json({ ok: true });
}
