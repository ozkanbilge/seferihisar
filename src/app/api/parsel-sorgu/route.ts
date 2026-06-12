import { NextResponse } from "next/server";
import { fetchParsel, TkgmLimitError, TkgmDownError } from "@/lib/tkgm";
import { estimateUnitPrice, VALUATION } from "@/lib/valuation";
import { appendParselLog } from "@/lib/cms";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mahalleId = parseInt(searchParams.get("mahalleId") || "", 10);
  const ada = parseInt(searchParams.get("ada") || "", 10);
  const parsel = parseInt(searchParams.get("parsel") || "", 10);
  // Yalnızca loglama için: seçilen idari birim adları
  const logIl = searchParams.get("il") || "";
  const logIlce = searchParams.get("ilce") || "";
  const logMahalle = searchParams.get("mah") || "";

  if (isNaN(mahalleId) || isNaN(ada) || ada < 0 || isNaN(parsel) || parsel < 1) {
    return NextResponse.json(
      { error: "Geçersiz mahalle, ada veya parsel bilgisi." },
      { status: 400 }
    );
  }

  const log = (
    durum: "bulundu" | "bulunamadi" | "limit" | "hata",
    extra: { il?: string; ilce?: string; mahalle?: string; alan?: number; nitelik?: string; tahminiDeger?: number | null } = {}
  ) =>
    appendParselLog({
      ts: new Date().toISOString(),
      il: extra.il || logIl,
      ilce: extra.ilce || logIlce,
      mahalle: extra.mahalle || logMahalle,
      ada,
      parsel,
      durum,
      alan: extra.alan,
      nitelik: extra.nitelik,
      tahminiDeger: extra.tahminiDeger,
    }).catch(() => {});

  let data;
  try {
    data = await fetchParsel(mahalleId, ada, parsel);
  } catch (err) {
    if (err instanceof TkgmDownError) {
      await log("hata");
      return NextResponse.json(
        { error: "TKGM parsel servisinde şu anda geçici bir kesinti var (sorun Tapu Kadastro tarafında). Lütfen bir süre sonra tekrar deneyin." },
        { status: 503 }
      );
    }
    if (err instanceof TkgmLimitError) {
      await log("limit");
      return NextResponse.json(
        { error: "TKGM günlük sorgu limiti aşıldı. Lütfen yarın tekrar deneyin veya bizimle iletişime geçin." },
        { status: 429 }
      );
    }
    await log("hata");
    return NextResponse.json(
      { error: "TKGM parsel servisine ulaşılamadı. Lütfen daha sonra tekrar deneyin." },
      { status: 502 }
    );
  }

  if (!data) {
    await log("bulunamadi");
    return NextResponse.json(
      { error: `Parsel bulunamadı: ${ada} ada / ${parsel} parsel. Bilgileri kontrol edin.` },
      { status: 404 }
    );
  }

  // "602,28" -> 602.28
  const alan = parseFloat(data.alan.replace(/\./g, "").replace(",", ".")) || 0;

  const unit = await estimateUnitPrice(data.ilceAd, data.mahalleAd);
  const birimFiyat = unit?.price ?? null;
  const tahminiDeger =
    birimFiyat && alan > 0 ? Math.round(alan * birimFiyat) : null;
  // Satış güvencesi: tahmini değerin %30 üzeri
  const garantiDeger = tahminiDeger
    ? Math.round(tahminiDeger * VALUATION.guaranteeMultiplier)
    : null;

  // Parsel poligonunun ağırlık merkezi
  const coordinates =
    data.ring.length > 0
      ? {
          lat: data.ring.reduce((s, p) => s + p[1], 0) / data.ring.length,
          lng: data.ring.reduce((s, p) => s + p[0], 0) / data.ring.length,
        }
      : null;

  await log("bulundu", {
    il: data.ilAd,
    ilce: data.ilceAd,
    mahalle: data.mahalleAd,
    alan,
    nitelik: data.nitelik,
    tahminiDeger,
  });

  return NextResponse.json({
    il: data.ilAd,
    ilce: data.ilceAd,
    mahalle: data.mahalleAd,
    ada: data.adaNo,
    parsel: data.parselNo,
    alan,
    alanText: data.alan,
    nitelik: data.nitelik,
    pafta: data.pafta,
    mevkii: data.mevkii,
    zeminDurum: data.zeminKmdurum,
    birimFiyat,
    fiyatKaynak: unit?.source ?? null,
    tahminiDeger,
    garantiDeger,
    coordinates,
    ring: data.ring,
    sorguNo: `TKGM-${data.adaNo}-${data.parselNo}-${Date.now().toString().slice(-4)}`,
  });
}
