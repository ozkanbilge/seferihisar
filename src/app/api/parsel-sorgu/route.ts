import { NextResponse } from "next/server";
import { primaryDistrict } from "@/data/locations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adaStr = searchParams.get("ada") || "";
  const parselStr = searchParams.get("parsel") || "";
  const mahalleSlug = searchParams.get("mahalle") || "";

  const ada = parseInt(adaStr, 10);
  const parsel = parseInt(parselStr, 10);

  if (isNaN(ada) || isNaN(parsel) || !mahalleSlug) {
    return NextResponse.json(
      { error: "Geçersiz ada, parsel veya mahalle bilgisi." },
      { status: 400 }
    );
  }

  // Mahalle bulma ve ortalama fiyat bilgisi alma
  const mahalle = primaryDistrict.neighborhoods.find((n) => n.slug === mahalleSlug) || primaryDistrict.neighborhoods[0];

  // Deterministik alan (m²) hesaplama (250m² - 1000m² arası)
  const alan = ((ada * parsel * 7 + 120) % 750) + 250;

  // Deterministik İmar Durumu belirleme
  const imarDurumlari = [
    "Konut İmarlı (%30 / 2 Kat İmarlı)",
    "Tarım İmarlı (Zeytinlik / Bağ Bahçe)",
    "Konut İmarlı (%25 / 2 Kat Villa İmarlı)",
    "Ticari + Konut İmarlı (%40 / 3 Kat)",
    "İmarsız (Doğal Sit Alanı / Koruma Sınırında)",
  ];
  const imarIndeksi = (ada + parsel) % imarDurumlari.length;
  const imarDurumu = imarDurumlari[imarIndeksi];

  // Ortalama m² fiyatına göre arsa m² fiyatı türetme
  const mahalleAvgSale = mahalle.avgM2.sale * 0.4; // Arsa m² fiyatı konutun %40'ı kabul edilir
  const birimFiyat = Math.round(mahalleAvgSale * (1 + (parsel % 5) / 10)); // Parsel numarasına göre küçük varyasyon
  const tahminiDeger = alan * birimFiyat;

  // Harita için simüle edilmiş lokal poligon koordinatları (Sığacık civarı merkezli)
  const baseLat = 38.196;
  const baseLng = 26.838;
  const offsetLat = ((ada % 100) / 1000) - 0.05;
  const offsetLng = ((parsel % 100) / 1000) - 0.05;
  
  const coordinates = {
    lat: baseLat + offsetLat,
    lng: baseLng + offsetLng,
  };

  return NextResponse.json({
    ada,
    parsel,
    mahalle: mahalle.name,
    alan,
    imarDurumu,
    birimFiyat,
    tahminiDeger,
    coordinates,
    sorguNo: `CAD-${ada}-${parsel}-${Date.now().toString().slice(-4)}`,
  });
}
