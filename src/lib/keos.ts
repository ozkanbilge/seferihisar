/**
 * Seferihisar Belediyesi KEOS E-İmar servisi istemcisi.
 * Akış: tapu mahalle adı + ada/parsel -> parselid -> imar.aspx sayfasından
 * yapılaşma koşullarının ayrıştırılması. Yanıtlar windows-1254 kodludur.
 */

const KEOS_BASE = "http://keos.seferihisar.bel.tr/imardurumu";

const KEOS_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; PrivateEstate/1.0)",
  Accept: "*/*",
};

export interface KeosImar {
  parselid: number;
  meriPlan: string;
  katAdedi: string;
  taks: string;
  kaks: string;
  insaatNizami: string;
  binaYuksekligi: string;
  onBahce: string;
  yanBahce: string;
  arkaBahce: string;
  /** Resmî E-İmar belge sayfası */
  kaynakUrl: string;
}

/** Mahalle adı eşleştirme: aksan/boşluk bağımsız (SIĞACIK ~ Sığacık) */
const normalize = (s: string) =>
  s
    .toLocaleUpperCase("tr")
    .replace(/[^A-ZÇĞİÖŞÜ]/g, "")
    .replace(/İ/g, "I");

async function fetchDecoded(url: string): Promise<string> {
  const res = await fetch(url, { headers: KEOS_HEADERS, cache: "no-store" });
  if (!res.ok) throw new Error(`KEOS ${res.status}`);
  const buf = await res.arrayBuffer();
  return new TextDecoder("windows-1254").decode(buf);
}

/** Etiket -> değer ayrıştırma: tag'leri söküp etiketten sonraki ilk dolu hücreyi alır */
function extractField(tokens: string[], label: string): string {
  const idx = tokens.findIndex((t) => t.startsWith(label));
  if (idx === -1) return "";
  for (let i = idx + 1; i < Math.min(idx + 4, tokens.length); i++) {
    const v = tokens[i].trim();
    if (v && v !== label) return v;
  }
  return "";
}

// Bellek içi önbellek: imar verisi gün içinde değişmez, belediye servisini yormayalım
const imarCache = new Map<string, { data: KeosImar | null; expires: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function fetchKeosImar(
  tapuMahalleAdi: string,
  ada: string,
  parsel: string
): Promise<KeosImar | null> {
  const cacheKey = `${normalize(tapuMahalleAdi)}/${ada}/${parsel}`;
  const cached = imarCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.data;

  // 1) KEOS tapu mahalle listesinden gerçek adı bul
  const mahalleler = (JSON.parse(
    await fetchDecoded(`${KEOS_BASE}/service/imarsvc.aspx?type=tapuMahalle`)
  )) as { TAPU_MAH_ADI: string }[];
  const target = normalize(tapuMahalleAdi);
  const keosMahalle = mahalleler.find((m) => normalize(m.TAPU_MAH_ADI) === target)?.TAPU_MAH_ADI;
  if (!keosMahalle) {
    imarCache.set(cacheKey, { data: null, expires: Date.now() + CACHE_TTL });
    return null;
  }

  // 2) Ada/parsel -> parselid
  const params = new URLSearchParams({
    type: "adaparsel",
    adaparsel: `${ada}/${parsel}`,
    ilce: "-100000",
    tmahalle: keosMahalle,
    tamKelimeAra: "1",
  });
  const hits = (JSON.parse(
    await fetchDecoded(`${KEOS_BASE}/service/imarsvc.aspx?${params}`)
  )) as { ADAPARSEL: string; OBJECTID: number }[];
  const hit = hits.find((h) => h.ADAPARSEL === `${ada}/${parsel}`) ?? hits[0];
  if (!hit) {
    imarCache.set(cacheKey, { data: null, expires: Date.now() + CACHE_TTL });
    return null;
  }

  // 3) İmar sayfasını ayrıştır
  const kaynakUrl = `${KEOS_BASE}/imar.aspx?parselid=${hit.OBJECTID}`;
  let html = await fetchDecoded(kaynakUrl);
  html = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const tokens = html
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((t) => t.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const data: KeosImar = {
    parselid: hit.OBJECTID,
    meriPlan: extractField(tokens, "Mer'i İmar Planı"),
    katAdedi: extractField(tokens, "Kat Adedi"),
    taks: extractField(tokens, "T.A.K.S"),
    kaks: extractField(tokens, "K.A.K.S"),
    insaatNizami: extractField(tokens, "İnşaat Nizamı"),
    binaYuksekligi: extractField(tokens, "Bina Yüksekliği"),
    onBahce: extractField(tokens, "Ön Bahçe"),
    yanBahce: extractField(tokens, "Yan Bahçe"),
    arkaBahce: extractField(tokens, "Arka Bahçe"),
    kaynakUrl,
  };

  imarCache.set(cacheKey, { data, expires: Date.now() + CACHE_TTL });
  return data;
}
