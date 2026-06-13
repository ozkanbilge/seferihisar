import { NextResponse } from "next/server";
import { addMessage } from "@/lib/messages-store";

/** Bülten aboneliği — admin Mesajlar panelinde görünür */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta girin." }, { status: 400 });
  }
  await addMessage({
    name: "Bülten Abonesi",
    phone: "-",
    email: email.slice(0, 120),
    subject: "Bülten Aboneliği",
    message: `Yeni bülten aboneliği: ${email}`,
  });
  return NextResponse.json({ ok: true });
}
