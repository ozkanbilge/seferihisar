import { NextResponse } from "next/server";
import { addMessage } from "@/lib/messages-store";

/** İletişim formu gönderimi (halka açık) */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { name, phone, email, subject, message } = body ?? {};
  if (
    typeof name !== "string" || name.trim().length < 2 ||
    typeof phone !== "string" || phone.replace(/\D/g, "").length < 10 ||
    typeof message !== "string" || message.trim().length < 5
  ) {
    return NextResponse.json(
      { error: "Lütfen ad, geçerli telefon ve mesajınızı eksiksiz girin." },
      { status: 400 }
    );
  }
  const msg = await addMessage({
    name: name.trim().slice(0, 80),
    phone: phone.trim().slice(0, 20),
    email: typeof email === "string" && email.trim() ? email.trim().slice(0, 120) : undefined,
    subject: typeof subject === "string" && subject.trim() ? subject.trim().slice(0, 120) : undefined,
    message: message.trim().slice(0, 4000),
  });
  return NextResponse.json({ ok: true, id: msg.id });
}
