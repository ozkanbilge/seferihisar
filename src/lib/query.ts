import { listings, type Listing } from "@/data/listings";

export interface ListingFilter {
  transaction?: "satilik" | "kiralik";
  typeSlug?: string;
  districtSlug?: string;
  neighborhoodSlug?: string;
}

export function filterListings(f: ListingFilter, source: Listing[] = listings): Listing[] {
  return source
    .filter((l) => (f.transaction ? l.transaction === f.transaction : true))
    .filter((l) => (f.typeSlug ? l.typeSlug === f.typeSlug : true))
    .filter((l) => (f.districtSlug ? l.districtSlug === f.districtSlug : true))
    .filter((l) =>
      f.neighborhoodSlug ? l.neighborhoodSlug === f.neighborhoodSlug : true
    )
    .sort((a, b) => tierRank(b) - tierRank(a) || +new Date(b.createdAt) - +new Date(a.createdAt));
}

function tierRank(l: Listing): number {
  return l.tier === "premium" ? 2 : l.tier === "vitrin" ? 1 : 0;
}

export interface PriceStats {
  count: number;
  min: number;
  max: number;
  avg: number;
  avgPerM2: number | null;
}

export function priceStats(list: Listing[]): PriceStats | null {
  if (list.length === 0) return null;
  const prices = list.map((l) => l.price);
  const perM2 = list.filter((l) => l.area > 0).map((l) => l.price / l.area);
  return {
    count: list.length,
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    avgPerM2: perM2.length
      ? Math.round(perM2.reduce((a, b) => a + b, 0) / perM2.length)
      : null,
  };
}
