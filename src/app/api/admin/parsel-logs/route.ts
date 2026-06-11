import { NextResponse } from "next/server";
import { getParselLogs, clearParselLogs } from "@/lib/cms";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  return NextResponse.json(await getParselLogs());
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  await clearParselLogs();
  return NextResponse.json({ ok: true });
}
