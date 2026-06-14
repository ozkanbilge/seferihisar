import { promises as fs } from "fs";
import path from "path";
import type { Lang } from "@/lib/i18n";
import { getRawContent, setRawContent } from "@/lib/site-content";

/**
 * Anasayfa içeriği Neon Postgres'te (content_store) tutulur; parsel logları ve
 * emsal fiyatları yerel data/ klasöründe JSON olarak tutulur.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const PARSEL_LOG_FILE = path.join(DATA_DIR, "parsel-logs.json");
const PARSEL_LOG_LIMIT = 500;

export interface HomepageContent {
  hero: {
    eyebrow: string;
    title: string;
    titleGold: string;
    subtitle: string;
  };
  sections: {
    stats: boolean;
    featured: boolean;
    propertyTypes: boolean;
    districts: boolean;
    arsaSorgula: boolean;
    neighborhoods: boolean;
    whyUs: boolean;
    blog: boolean;
    cta: boolean;
  };
  featured: { eyebrow: string; title: string; count: number };
  propertyTypes: { eyebrow: string; title: string };
  districts: { eyebrow: string; title: string; subtitle: string };
  neighborhoods: { eyebrow: string; title: string };
  whyUs: {
    eyebrow: string;
    title: string;
    items: { title: string; desc: string }[];
  };
  blog: { eyebrow: string; title: string };
  cta: { eyebrow: string; title: string; titleGold: string; subtitle: string };
  /** Arama barı altındaki popüler arama çipleri */
  popularSearches: { label: string; href: string }[];
}

export const HOMEPAGE_DEFAULTS: HomepageContent = {
  hero: {
    eyebrow: "Ege'nin Sakin Şehri",
    title: "Doğru Gayrimenkul,",
    titleGold: "Doğru Yatırım.",
    subtitle:
      "Seferihisar ve çevresindeki satılık villa, arsa, daire ve yazlık ilanları. Güncel fiyatlar, bölge rehberleri ve yatırım fırsatları tek platformda.",
  },
  sections: {
    stats: true,
    featured: true,
    propertyTypes: true,
    districts: true,
    arsaSorgula: true,
    neighborhoods: true,
    whyUs: true,
    blog: true,
    cta: true,
  },
  featured: { eyebrow: "Öne Çıkan İlanlar", title: "Seçkin Portföyümüz", count: 6 },
  propertyTypes: { eyebrow: "Gayrimenkul Türleri", title: "Ne Arıyorsunuz?" },
  districts: {
    eyebrow: "Prestijli Yatırım",
    title: "Ege'nin İncisi Bölgelerimiz",
    subtitle:
      "Uzmanlık alanımız olan sahil şeridinde yatırım değeri yüksek, premium projelerin yükseldiği en popüler bölgeler.",
  },
  neighborhoods: { eyebrow: "Mahalleler", title: "Seferihisar Mahalleleri" },
  whyUs: {
    eyebrow: "Neden Biz?",
    title: "Güvenle Yatırım Yapın",
    items: [
      {
        title: "Yerel Uzmanlık",
        desc: "Seferihisar ve çevresinde 15+ yıllık deneyimle bölgeyi en iyi biz tanırız.",
      },
      {
        title: "Doğrulanmış İlanlar",
        desc: "Her ilan ekibimiz tarafından kontrol edilir; tapu, imar ve değerleme bilgileri doğrulanır.",
      },
      {
        title: "Ücretsiz Danışmanlık",
        desc: "Yatırım kararınızda profesyonel destek alın — ilk görüşme her zaman ücretsizdir.",
      },
      {
        title: "Şeffaf Fiyatlandırma",
        desc: "Gizli komisyon yok. Tüm maliyetler net olarak paylaşılır.",
      },
    ],
  },
  blog: { eyebrow: "Blog & Rehber", title: "Güncel Yazılar" },
  cta: {
    eyebrow: "Hemen İletişime Geçin",
    title: "Hayalinizdeki Ege Yaşamına",
    titleGold: "Bir Adım Kaldı",
    subtitle:
      "Villa, arsa veya yazlık yatırımınızda doğru kararı vermek için uzman ekibimizle tanışın.",
  },
  popularSearches: [
    { label: "Seferihisar Satılık Villa", href: "/izmir/seferihisar/satilik-villa" },
    { label: "Seferihisar Satılık Arsa", href: "/izmir/seferihisar/satilik-arsa" },
    { label: "Sığacık Satılık Villa", href: "/izmir/seferihisar/sigacik/satilik-villa" },
    { label: "Seferihisar Satılık Yazlık", href: "/izmir/seferihisar/satilik-yazlik" },
    { label: "Seferihisar Satılık Tarla", href: "/izmir/seferihisar/satilik-tarla" },
    { label: "Seferihisar Kiralık Daire", href: "/izmir/seferihisar/kiralik-daire" },
    { label: "Urla Satılık Yazlık", href: "/izmir/urla/satilik-yazlik" },
  ],
};

const HOMEPAGE_DEFAULTS_EN: HomepageContent = {
  ...HOMEPAGE_DEFAULTS,
  hero: {
    eyebrow: "The Slow City of the Aegean",
    title: "The Right Property,",
    titleGold: "The Right Investment.",
    subtitle:
      "Villas, land, apartments and summer houses for sale in Seferihisar and its surroundings. Current prices, regional guides and investment opportunities on a single platform.",
  },
  featured: { eyebrow: "Featured Listings", title: "Our Select Portfolio", count: 6 },
  propertyTypes: { eyebrow: "Property Types", title: "What Are You Looking For?" },
  districts: {
    eyebrow: "Prestigious Investment",
    title: "Pearl Districts of the Aegean",
    subtitle:
      "The most popular coastal areas with high investment value where premium projects rise — our field of expertise.",
  },
  neighborhoods: { eyebrow: "Neighborhoods", title: "Seferihisar Neighborhoods" },
  whyUs: {
    eyebrow: "Why Us?",
    title: "Invest with Confidence",
    items: [
      { title: "Local Expertise", desc: "With 15+ years of experience in Seferihisar and its surroundings, no one knows the region better." },
      { title: "Verified Listings", desc: "Every listing is checked by our team; title deed, zoning and valuation details are verified." },
      { title: "Free Consultancy", desc: "Get professional support for your investment decision — the first meeting is always free." },
      { title: "Transparent Pricing", desc: "No hidden commission. All costs are shared clearly." },
    ],
  },
  blog: { eyebrow: "Blog & Guide", title: "Latest Articles" },
  cta: {
    eyebrow: "Get in Touch Now",
    title: "One Step Away From",
    titleGold: "Your Dream Aegean Life",
    subtitle:
      "Meet our expert team to make the right decision on your villa, land or summer house investment.",
  },
  popularSearches: [
    { label: "Seferihisar Villas for Sale", href: "/izmir/seferihisar/satilik-villa" },
    { label: "Seferihisar Land for Sale", href: "/izmir/seferihisar/satilik-arsa" },
    { label: "Sığacık Villas", href: "/izmir/seferihisar/sigacik/satilik-villa" },
    { label: "Seferihisar Summer Houses", href: "/izmir/seferihisar/satilik-yazlik" },
    { label: "Apartments for Rent", href: "/izmir/seferihisar/kiralik-daire" },
    { label: "Urla Summer Houses", href: "/izmir/urla/satilik-yazlik" },
  ],
};

const HOMEPAGE_DEFAULTS_AR: HomepageContent = {
  ...HOMEPAGE_DEFAULTS,
  hero: {
    eyebrow: "المدينة الهادئة على بحر إيجة",
    title: "العقار الصحيح،",
    titleGold: "الاستثمار الصحيح.",
    subtitle:
      "فلل وأراضٍ وشقق ومنازل صيفية للبيع في سفريحصار وما حولها. أسعار محدثة وأدلة المناطق وفرص الاستثمار في منصة واحدة.",
  },
  featured: { eyebrow: "عقارات مميزة", title: "محفظتنا المختارة", count: 6 },
  propertyTypes: { eyebrow: "أنواع العقارات", title: "عمّ تبحث؟" },
  districts: {
    eyebrow: "استثمار مرموق",
    title: "مناطق لؤلؤة بحر إيجة",
    subtitle:
      "أكثر المناطق الساحلية شعبية ذات القيمة الاستثمارية العالية حيث ترتفع المشاريع الفاخرة — مجال خبرتنا.",
  },
  neighborhoods: { eyebrow: "الأحياء", title: "أحياء سفريحصار" },
  whyUs: {
    eyebrow: "لماذا نحن؟",
    title: "استثمر بثقة",
    items: [
      { title: "خبرة محلية", desc: "بخبرة تزيد عن 15 عامًا في سفريحصار وما حولها، نعرف المنطقة أفضل من الجميع." },
      { title: "عقارات موثقة", desc: "يتم فحص كل إعلان من قبل فريقنا؛ يتم التحقق من الطابو والتنظيم والتقييم." },
      { title: "استشارة مجانية", desc: "احصل على دعم احترافي لقرارك الاستثماري — اللقاء الأول مجاني دائمًا." },
      { title: "تسعير شفاف", desc: "لا عمولات خفية. جميع التكاليف تُعرض بوضوح." },
    ],
  },
  blog: { eyebrow: "المدونة والدليل", title: "أحدث المقالات" },
  cta: {
    eyebrow: "تواصل معنا الآن",
    title: "خطوة واحدة تفصلك عن",
    titleGold: "حياة أحلامك على بحر إيجة",
    subtitle:
      "تعرّف على فريقنا المتخصص لاتخاذ القرار الصحيح في استثمارك بالفلل أو الأراضي أو المنازل الصيفية.",
  },
  popularSearches: [
    { label: "فلل للبيع في سفريحصار", href: "/izmir/seferihisar/satilik-villa" },
    { label: "أراضٍ للبيع في سفريحصار", href: "/izmir/seferihisar/satilik-arsa" },
    { label: "فلل صيجاجك", href: "/izmir/seferihisar/sigacik/satilik-villa" },
    { label: "منازل صيفية في سفريحصار", href: "/izmir/seferihisar/satilik-yazlik" },
    { label: "شقق للإيجار", href: "/izmir/seferihisar/kiralik-daire" },
    { label: "منازل صيفية في أورلا", href: "/izmir/urla/satilik-yazlik" },
  ],
};

const DEFAULTS_BY_LANG: Record<Lang, HomepageContent> = {
  tr: HOMEPAGE_DEFAULTS,
  en: HOMEPAGE_DEFAULTS_EN,
  ar: HOMEPAGE_DEFAULTS_AR,
};

/** Kayıtlı içerik eksik alan içerirse o dilin varsayılanlarıyla tamamlar */
function mergeContent(saved: Partial<HomepageContent>, lang: Lang): HomepageContent {
  const d = DEFAULTS_BY_LANG[lang];
  return {
    hero: { ...d.hero, ...saved.hero },
    sections: { ...d.sections, ...saved.sections },
    featured: { ...d.featured, ...saved.featured },
    propertyTypes: { ...d.propertyTypes, ...saved.propertyTypes },
    districts: { ...d.districts, ...saved.districts },
    neighborhoods: { ...d.neighborhoods, ...saved.neighborhoods },
    whyUs: {
      ...d.whyUs,
      ...saved.whyUs,
      items: saved.whyUs?.items?.length ? saved.whyUs.items : d.whyUs.items,
    },
    blog: { ...d.blog, ...saved.blog },
    cta: { ...d.cta, ...saved.cta },
    popularSearches: saved.popularSearches?.length ? saved.popularSearches : d.popularSearches,
  };
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function getHomepage(lang: Lang = "tr"): Promise<HomepageContent> {
  const saved = (await getRawContent("homepage", lang)) as Partial<HomepageContent> | null;
  return mergeContent(saved ?? {}, lang);
}

export async function saveHomepage(lang: Lang, content: Partial<HomepageContent>) {
  const merged = mergeContent(content, lang);
  await setRawContent("homepage", lang, merged);
}

/* ---- Parsel sorgu logları ---- */

export interface ParselLogEntry {
  ts: string;
  /** Sorgulayan müşteri */
  musteriAd?: string;
  musteriTel?: string;
  il: string;
  ilce: string;
  mahalle: string;
  ada: number;
  parsel: number;
  durum: "bulundu" | "bulunamadi" | "limit" | "hata";
  alan?: number;
  nitelik?: string;
  tahminiDeger?: number | null;
}

export async function appendParselLog(entry: ParselLogEntry) {
  const logs = await readJson<ParselLogEntry[]>(PARSEL_LOG_FILE, []);
  logs.unshift(entry);
  await writeJson(PARSEL_LOG_FILE, logs.slice(0, PARSEL_LOG_LIMIT));
}

export async function getParselLogs(): Promise<ParselLogEntry[]> {
  return readJson<ParselLogEntry[]>(PARSEL_LOG_FILE, []);
}

export async function clearParselLogs() {
  await writeJson(PARSEL_LOG_FILE, []);
}

/* ---- Emsal arsa fiyatları (admin panelden yönetilir) ---- */

const EMSAL_FILE = path.join(DATA_DIR, "emsal.json");

export interface EmsalEntry {
  ilce: string;
  mahalle: string;
  /** Gerçek emsal arsa fiyatı (TL/m²) */
  fiyat: number;
}

export async function getEmsalList(): Promise<EmsalEntry[]> {
  return readJson<EmsalEntry[]>(EMSAL_FILE, []);
}

export async function saveEmsalList(list: EmsalEntry[]) {
  const clean = list
    .filter((e) => e.ilce?.trim() && e.mahalle?.trim() && Number(e.fiyat) > 0)
    .map((e) => ({ ilce: e.ilce.trim(), mahalle: e.mahalle.trim(), fiyat: Math.round(Number(e.fiyat)) }));
  await writeJson(EMSAL_FILE, clean);
}

/** İlçe+mahalle için admin'in girdiği gerçek emsal TL/m² fiyatı (yoksa null) */
export async function findEmsalPrice(ilce: string, mahalle: string): Promise<number | null> {
  const lower = (s: string) => s.toLocaleLowerCase("tr");
  const list = await getEmsalList();
  const hit = list.find(
    (e) => lower(e.ilce) === lower(ilce) && lower(e.mahalle) === lower(mahalle)
  );
  return hit ? hit.fiyat : null;
}
