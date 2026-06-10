import type { District, Neighborhood } from "@/data/locations";
import type { PropertyType, Transaction } from "@/data/property-types";
import { formatPrice } from "./format";

/**
 * Programmatic SEO içerik üreteci.
 * Mahalle + tür + işlem kombinasyonuna göre özgün metin/FAQ üretir.
 */

export function regionIntro(
  district: District,
  neighborhood?: Neighborhood,
  type?: PropertyType,
  transaction?: Transaction
): string[] {
  const place = neighborhood ? neighborhood.name : district.name;
  const tx = transaction?.name.toLowerCase() ?? "satılık ve kiralık";
  const t = type ? type.name.toLowerCase() : "gayrimenkul";

  const p1 = neighborhood
    ? `${neighborhood.name}, ${district.name} ilçesinin ${neighborhood.character} olarak öne çıkar. ${neighborhood.sea}. ${place} bölgesinde ${tx} ${t} arayanlar için güncel portföyümüzü aşağıda inceleyebilirsiniz.`
    : `${district.summary} ${district.name} genelinde ${tx} ${t} ilanları, konum ve özelliklerine göre geniş bir yelpazede sunulmaktadır.`;

  const p2 = neighborhood
    ? `Bölgenin öne çıkan değerleri arasında ${neighborhood.highlights
        .slice(0, 3)
        .join(", ")} yer alır. Ortalama ${
        transaction?.slug === "kiralik" ? "kira" : "satış"
      } m² değeri yaklaşık ${formatPrice(
        transaction?.slug === "kiralik"
          ? neighborhood.avgM2.rent
          : neighborhood.avgM2.sale
      )} seviyesindedir; bu değer konum, manzara ve yapı özelliklerine göre değişkenlik gösterir.`
    : district.about[1] ?? "";

  const p3 = type
    ? `${place} bölgesinde ${t} segmenti; ${type.blurb.toLowerCase()} ${
        transaction?.slug === "kiralik"
          ? "Kiralama sürecinde sözleşme ve aidat detaylarını mutlaka netleştirin."
          : "Yatırım kararı öncesi imar durumu, tapu ve değerleme kontrolü öneririz."
      }`
    : `${place} bölgesi, Ege'nin sakin yaşamını ve güçlü yatırım potansiyelini bir arada sunar. Doğru portföy seçimi için uzman ekibimizden ücretsiz danışmanlık alabilirsiniz.`;

  return [p1, p2, p3].filter(Boolean);
}

export function regionFaq(
  district: District,
  neighborhood?: Neighborhood,
  type?: PropertyType,
  transaction?: Transaction
): { q: string; a: string }[] {
  const place = neighborhood ? neighborhood.name : district.name;
  const t = type ? type.name.toLowerCase() : "gayrimenkul";
  const avg = neighborhood
    ? transaction?.slug === "kiralik"
      ? neighborhood.avgM2.rent
      : neighborhood.avgM2.sale
    : null;

  const faqs: { q: string; a: string }[] = [];

  faqs.push({
    q: `${place}'da ${t} fiyatları ne kadar?`,
    a: avg
      ? `${place} bölgesinde ortalama m² değeri yaklaşık ${formatPrice(
          avg
        )} seviyesindedir. Fiyatlar konum, deniz mesafesi, yapı yaşı ve manzaraya göre değişir. Güncel ilanları yukarıdaki listede inceleyebilirsiniz.`
      : `${place} bölgesinde ${t} fiyatları konum ve özelliklere göre geniş bir aralıkta seyreder. Güncel portföyümüzdeki gerçek ilan fiyatlarını listede görebilirsiniz.`,
  });

  faqs.push({
    q: `${place} yatırım için uygun mu?`,
    a: `${place}, ${district.name} bölgesinin sınırlı imarı ve artan talebi nedeniyle orta-uzun vadede güçlü bir yatırım potansiyeli sunar. Özellikle deniz manzaralı ve imarlı portföyler değer artışında öne çıkar.`,
  });

  if (neighborhood) {
    faqs.push({
      q: `${place}'da denize yakın gayrimenkuller hangi bölgelerde bulunur?`,
      a: `${neighborhood.sea}. Denize yakınlık, hem yaşam konforu hem de yeniden satış/kira değeri açısından bölgedeki en belirleyici kriterlerden biridir.`,
    });
  }

  faqs.push({
    q: `${district.name}'da yaşam ve ulaşım nasıl?`,
    a: `${district.name}, İzmir merkeze otoyol bağlantısıyla kolay ulaşılır; sakin yaşam, doğal koylar ve gelişen sosyal donatılarıyla hem daimi konut hem yazlık için tercih edilir.`,
  });

  return faqs;
}
