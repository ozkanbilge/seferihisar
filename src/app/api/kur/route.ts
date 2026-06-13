import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Canlı kur kaynağı: altin.doviz.com/harem (Harem Altın).
 * Sayfadaki data-socket-key işaretli değerler ayrıştırılır;
 * 2 dakika önbellekte tutulur.
 */
const SOURCE_URL = "https://altin.doviz.com/harem";

// "6.185,72" -> 6185.72
const parseTr = (s: string) => parseFloat(s.replace(/\./g, "").replace(",", "."));

function extract(html: string, key: string, attr: string): string | null {
  const re = new RegExp(
    `data-socket-key="${key}"[^>]*data-socket-attr="${attr}"[^>]*>\\s*([^<]+?)\\s*<`
  );
  return re.exec(html)?.[1] ?? null;
}

const trend = (changeText: string | null): "up" | "down" =>
  changeText?.includes("-") ? "down" : "up";

export async function GET() {
  try {
    const res = await fetch(SOURCE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "text/html",
      },
      next: { revalidate: 120 },
    });
    if (!res.ok) throw new Error(`Kaynak ${res.status} döndü`);
    const html = await res.text();

    const usdRaw = extract(html, "USD", "s");
    const eurRaw = extract(html, "EUR", "s");
    const goldRaw = extract(html, "23-gram-altin", "ask"); // Harem gram altın satış

    if (!usdRaw || !eurRaw || !goldRaw) throw new Error("Değerler ayrıştırılamadı");

    return NextResponse.json({
      usd: parseTr(usdRaw),
      eur: parseTr(eurRaw),
      gold: parseTr(goldRaw),
      usdTrend: trend(extract(html, "USD", "c")),
      eurTrend: trend(extract(html, "EUR", "c")),
      goldTrend: trend(extract(html, "23-gram-altin", "c")),
      usdChange: (extract(html, "USD", "c") || "").trim(),
      eurChange: (extract(html, "EUR", "c") || "").trim(),
      goldChange: (extract(html, "23-gram-altin", "c") || "").trim(),
      source: "altin.doviz.com/harem",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Kur verisi alınamadı." }, { status: 502 });
  }
}
