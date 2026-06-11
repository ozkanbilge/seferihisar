import { NextResponse } from "next/server";
import { fetchMahalleler } from "@/lib/tkgm";

export async function GET(request: Request) {
  const ilceId = parseInt(new URL(request.url).searchParams.get("ilce") || "", 10);
  if (isNaN(ilceId)) {
    return NextResponse.json({ error: "Geçersiz ilçe." }, { status: 400 });
  }

  try {
    return NextResponse.json(await fetchMahalleler(ilceId));
  } catch {
    return NextResponse.json(
      { error: "TKGM mahalle listesi alınamadı. Lütfen daha sonra tekrar deneyin." },
      { status: 502 }
    );
  }
}
