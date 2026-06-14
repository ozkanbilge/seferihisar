import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscribers-store";

/** Bülten aboneliği — admin "Bülten Aboneleri" panelinde görünür */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta girin." }, { status: 400 });
  }
  await addSubscriber(email);
  return NextResponse.json({ ok: true });
}
