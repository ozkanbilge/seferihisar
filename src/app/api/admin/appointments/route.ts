import { NextResponse } from "next/server";
import { getAppointments, setAppointmentStatus } from "@/lib/appointments-store";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  return NextResponse.json(await getAppointments());
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const { id, status } = body ?? {};
  if (typeof id !== "string" || !["pending", "approved", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const ok = await setAppointmentStatus(id, status);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Randevu bulunamadı." }, { status: 404 });
}
