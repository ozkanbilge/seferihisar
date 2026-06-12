/**
 * TKGM Parsel Sorgu (parselsorgu.tkgm.gov.tr) servis istemcisi.
 * Resmi CBS API'si üzerinden il/ilçe/mahalle listeleri ve parsel detayı çeker.
 */

const TKGM_BASE = "https://cbsapi.tkgm.gov.tr/megsiswebapi.v3/api";

const TKGM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; SeferihisarEmlak/1.0)",
  Accept: "application/json",
};

export interface TkgmItem {
  id: number;
  text: string;
}

export interface TkgmParsel {
  ilAd: string;
  ilceAd: string;
  mahalleAd: string;
  adaNo: string;
  parselNo: string;
  /** Türkçe ondalık formatında m² ("602,28") */
  alan: string;
  nitelik: string;
  pafta: string;
  mevkii: string;
  zeminKmdurum: string;
  ozet: string;
  /** Dış halka koordinatları [lng, lat][] */
  ring: [number, number][];
}

interface TkgmFeatureCollection {
  features: { properties: TkgmItem }[];
}

/** İdari birim listelerinden ağır geometri verisini atıp sadece id/ad döndürür. */
async function fetchIdariListe(path: string): Promise<TkgmItem[]> {
  const res = await fetch(`${TKGM_BASE}/idariYapi/${path}`, {
    headers: TKGM_HEADERS,
    // İdari birimler nadiren değişir; 1 gün önbellekte tut
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error(`TKGM idari birim servisi yanıt vermedi (${res.status})`);
  }
  const data = (await res.json()) as TkgmFeatureCollection;
  return data.features
    .map((f) => ({ id: f.properties.id, text: f.properties.text }))
    .sort((a, b) => a.text.localeCompare(b.text, "tr"));
}

export const fetchIller = () => fetchIdariListe("ilListe");
export const fetchIlceler = (ilId: number) => fetchIdariListe(`ilceListe/${ilId}`);
export const fetchMahalleler = (ilceId: number) => fetchIdariListe(`mahalleListe/${ilceId}`);

export class TkgmDownError extends Error {
  constructor() {
    super("TKGM parsel servisi geçici olarak hizmet dışı.");
    this.name = "TkgmDownError";
  }
}

export class TkgmLimitError extends Error {
  constructor() {
    super("TKGM günlük sorgu limiti aşıldı.");
    this.name = "TkgmLimitError";
  }
}

/* Kadastro kaydı nadiren değişir; başarılı sonuçları 24 saat bellekte tutarak
   TKGM'nin IP başına günlük sorgu limitini koruyoruz */
const parselCache = new Map<string, { data: TkgmParsel; expires: number }>();
const PARSEL_CACHE_TTL = 24 * 60 * 60 * 1000;

export async function fetchParsel(
  mahalleId: number,
  ada: number,
  parsel: number
): Promise<TkgmParsel | null> {
  const cacheKey = `${mahalleId}/${ada}/${parsel}`;
  const cached = parselCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.data;

  // TKGM zaman zaman anlık kesinti yaşar: bir kez kısa beklemeyle yeniden dene
  let res: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      res = await fetch(`${TKGM_BASE}/parsel/${mahalleId}/${ada}/${parsel}`, {
        headers: TKGM_HEADERS,
        cache: "no-store",
      });
      if (res.status < 500) break;
    } catch {
      res = null;
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
  }

  // Servis çökmüşse: elde bayat önbellek varsa onu sun, yoksa kesinti bildir
  if (!res || res.status >= 500) {
    if (cached) return cached.data;
    throw new TkgmDownError();
  }
  if (res.status === 404) return null;
  if (res.status === 403) {
    // TKGM IP başına günlük sorgu limiti uygular
    throw new TkgmLimitError();
  }
  if (!res.ok) {
    throw new Error(`TKGM parsel servisi yanıt vermedi (${res.status})`);
  }

  const feature = await res.json();
  const props = feature?.properties;
  if (!props?.adaNo) return null;

  const coordinates = feature?.geometry?.coordinates;
  // Polygon -> [ring][nokta][lng,lat]; MultiPolygon -> bir seviye daha derin
  const ring: [number, number][] =
    feature?.geometry?.type === "MultiPolygon"
      ? coordinates?.[0]?.[0] ?? []
      : coordinates?.[0] ?? [];

  const result: TkgmParsel = {
    ilAd: props.ilAd ?? "",
    ilceAd: props.ilceAd ?? "",
    mahalleAd: props.mahalleAd ?? "",
    adaNo: props.adaNo ?? "",
    parselNo: props.parselNo ?? "",
    alan: props.alan ?? "",
    nitelik: props.nitelik ?? "",
    pafta: props.pafta ?? "",
    mevkii: props.mevkii ?? "",
    zeminKmdurum: props.zeminKmdurum ?? "",
    ozet: props.ozet ?? "",
    ring,
  };
  parselCache.set(cacheKey, { data: result, expires: Date.now() + PARSEL_CACHE_TTL });
  return result;
}
