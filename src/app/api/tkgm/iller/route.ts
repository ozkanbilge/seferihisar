import { NextResponse } from "next/server";
import { fetchIller } from "@/lib/tkgm";

export async function GET() {
  try {
    return NextResponse.json(await fetchIller());
  } catch {
    return NextResponse.json(
      { error: "TKGM il listesi alınamadı. Lütfen daha sonra tekrar deneyin." },
      { status: 502 }
    );
  }
}
