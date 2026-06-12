import { NextResponse } from "next/server";
import { addAppointment } from "@/lib/appointments-store";

/** Müşteri randevu talebi (halka açık) */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { userPhone, listingSlug, listingTitle, date, time } = body ?? {};
  if (
    typeof userPhone !== "string" || userPhone.replace(/\D/g, "").length < 10 ||
    typeof listingSlug !== "string" || !listingSlug ||
    typeof listingTitle !== "string" || !listingTitle ||
    typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    typeof time !== "string" || !/^\d{2}:\d{2}$/.test(time)
  ) {
    return NextResponse.json({ error: "Geçersiz randevu bilgisi." }, { status: 400 });
  }
  const app = await addAppointment({
    userPhone: userPhone.slice(0, 20),
    listingSlug: listingSlug.slice(0, 120),
    listingTitle: listingTitle.slice(0, 200),
    date,
    time,
  });
  return NextResponse.json({ ok: true, id: app.id });
}
