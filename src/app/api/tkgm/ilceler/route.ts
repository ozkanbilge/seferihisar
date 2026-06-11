import { NextResponse } from "next/server";
import { fetchIlceler } from "@/lib/tkgm";

export async function GET(request: Request) {
  const ilId = parseInt(new URL(request.url).searchParams.get("il") || "", 10);
  if (isNaN(ilId)) {
    return NextResponse.json({ error: "Geçersiz il." }, { status: 400 });
  }

  try {
    return NextResponse.json(await fetchIlceler(ilId));
  } catch {
    return NextResponse.json(
      { error: "TKGM ilçe listesi alınamadı. Lütfen daha sonra tekrar deneyin." },
      { status: 502 }
    );
  }
}
