import { districts } from "@/data/locations";
import { findEmsalPrice } from "@/lib/cms";

/**
 * Arsa değerleme parametreleri — tek yerden güncellenir.
 * Emsal kaynağı şimdilik src/data/locations.ts'teki mahalle ortalama
 * konut m² satış fiyatlarıdır. Gerçek emsal API'sine (ör. Endeksa)
 * geçileceğinde yalnızca estimateUnitPrice içi değiştirilmelidir.
 */
export const VALUATION = {
  /** Arsa m² fiyatı ≈ konut m² satış ortalamasının bu oranı */
  landToHousingRatio: 0.4,
  /** Gösterilen tahmine uygulanan pazarlık indirimi (%20 düşük) */
  marketDiscount: 0.8,
  /** Seferihisar Emlak satış garantisi çarpanı (%30 üzeri) */
  guaranteeMultiplier: 1.3,
} as const;

const trLower = (s: string) => s.toLocaleLowerCase("tr");

export interface UnitPriceResult {
  price: number;
  /** "emsal": admin'in girdiği gerçek emsal; "tahmin": konut ortalamasından türetilmiş */
  source: "emsal" | "tahmin";
}

/**
 * Arsa m² birim fiyatı. Önce admin panelden girilen gerçek emsal verisine
 * bakar; yoksa yerel konut ortalamasından tahmin türetir. Veri olmayan
 * bölgeler için null.
 */
export async function estimateUnitPrice(
  ilceAd: string,
  mahalleAd: string
): Promise<UnitPriceResult | null> {
  const emsal = await findEmsalPrice(ilceAd, mahalleAd);
  if (emsal) return { price: emsal, source: "emsal" };

  const district = districts.find((d) => trLower(d.name) === trLower(ilceAd));
  if (!district) return null;

  const neighborhood = district.neighborhoods.find(
    (n) => trLower(n.name) === trLower(mahalleAd)
  );
  const avgSale =
    neighborhood?.avgM2.sale ??
    district.neighborhoods.reduce((sum, n) => sum + n.avgM2.sale, 0) /
      district.neighborhoods.length;

  return {
    price: Math.round(avgSale * VALUATION.landToHousingRatio * VALUATION.marketDiscount),
    source: "tahmin",
  };
}
