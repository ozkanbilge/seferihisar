import { neon } from "@neondatabase/serverless";
import type { Lang } from "@/lib/i18n";

/**
 * Site geneli düzenlenebilir metinler — Neon Postgres'te `content_store`
 * tablosunda (key='site', lang) JSONB olarak tutulur. DB yoksa varsayılanlar
 * döner (yerel geliştirme bozulmaz).
 */

/* ----------------------------- Tip ----------------------------- */

export interface SiteContent {
  footer: {
    cta: { eyebrow: string; title: string; titleGold: string };
    trust: { title: string; sub: string }[];
    newsletter: { title: string; subtitle: string };
    followLabel: string;
    columns: { quickLinks: string; locations: string; deed: string; contact: string };
    bottom: { rights: string; privacy: string; terms: string };
  };
  stats: { labels: string[] };
  whyUs: { lead: string };
  arsa: { eyebrow: string; title: string; subtitle: string; badges: string[] };
  featured: { weekPick: string; listingBadge: string; viewListing: string };
  blogSection: { featuredBadge: string };
}

/* --------------------------- Varsayılan --------------------------- */

export const SITE_CONTENT_DEFAULTS: SiteContent = {
  footer: {
    cta: {
      eyebrow: "Hayalinizdeki Mülkü Bulun",
      title: "Doğru Yatırım İçin",
      titleGold: "Uzman Desteği Alın",
    },
    trust: [
      { title: "15+ Yıl", sub: "Bölge Deneyimi" },
      { title: "Tapu & İmar", sub: "Kontrollü Portföy" },
      { title: "Cittaslow", sub: "Seferihisar Uzmanı" },
      { title: "Ücretsiz", sub: "Ön Danışmanlık" },
    ],
    newsletter: {
      title: "Yeni İlanlardan Haberdar Olun",
      subtitle: "Fırsatları ve yeni portföyü ilk siz öğrenin.",
    },
    followLabel: "Bizi Takip Edin",
    columns: {
      quickLinks: "Hızlı Linkler",
      locations: "Popüler Bölgeler",
      deed: "Emlak & Tapu",
      contact: "İletişim",
    },
    bottom: {
      rights: "Tüm hakları saklıdır.",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Şartları",
    },
  },
  stats: {
    labels: ["İlçe", "Mahalle", "Gayrimenkul Türü", "Yıllık Deneyim"],
  },
  whyUs: {
    lead: "Seferihisar kıyısında 15 yılı aşkın süredir alıcı ve yatırımcılara rehberlik ediyoruz — her ilan tapudan kontrollü, her değer şeffaf, her adım bölgeyi bizzat yaşayan uzmanların danışmanlığıyla.",
  },
  arsa: {
    eyebrow: "Ücretsiz Emlak Aracı",
    title: "Anlık Arsa Değeri Sorgula",
    subtitle:
      "Ada ve parsel numaranızla taşınmazınızın TKGM kayıtlı alanını ve tahmini piyasa değerini anında öğrenin.",
    badges: ["TKGM Resmî Verisi", "Anında Sonuç", "%100 Ücretsiz"],
  },
  featured: {
    weekPick: "Haftanın Seçimi",
    listingBadge: "Vitrin İlanı",
    viewListing: "İlanı İncele",
  },
  blogSection: {
    featuredBadge: "Öne Çıkan",
  },
};

/* --------------------------- Depolama --------------------------- */

const KEY = "site";

function getConnectionString(): string | null {
  return (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.seferihisar_POSTGRES_PRISMA_URL ||
    process.env.seferihisar_DATABASE_URL ||
    process.env.seferihisar_POSTGRES_URL ||
    null
  );
}

let tableReady = false;

async function ensureTable(sql: ReturnType<typeof neon>) {
  if (tableReady) return;
  await sql`CREATE TABLE IF NOT EXISTS content_store (
    key text NOT NULL,
    lang text NOT NULL,
    data jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (key, lang)
  )`;
  tableReady = true;
}

/** Derin birleştirme: kaydedilen değerler varsayılanların üzerine yazılır,
 *  eksik/yeni alanlar varsayılandan tamamlanır (şema büyüdükçe güvenli). */
function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    const ov = (override ?? {}) as Record<string, unknown>;
    for (const k of Object.keys(out)) {
      if (k in ov) out[k] = deepMerge((base as Record<string, unknown>)[k], ov[k]);
    }
    return out as T;
  }
  return (override === undefined ? base : override) as T;
}

export async function getSiteContent(lang: Lang = "tr"): Promise<SiteContent> {
  const conn = getConnectionString();
  if (!conn) return SITE_CONTENT_DEFAULTS;
  try {
    const sql = neon(conn);
    await ensureTable(sql);
    const rows = (await sql`SELECT data FROM content_store WHERE key = ${KEY} AND lang = ${lang} LIMIT 1`) as { data: unknown }[];
    if (!rows.length) return SITE_CONTENT_DEFAULTS;
    return deepMerge(SITE_CONTENT_DEFAULTS, rows[0].data);
  } catch (error) {
    console.error("getSiteContent failed:", error);
    return SITE_CONTENT_DEFAULTS;
  }
}

export async function saveSiteContent(lang: Lang, content: SiteContent): Promise<void> {
  const conn = getConnectionString();
  if (!conn) throw new Error("Veritabanı bağlantısı yapılandırılmamış.");
  const merged = deepMerge(SITE_CONTENT_DEFAULTS, content);
  const sql = neon(conn);
  await ensureTable(sql);
  await sql`
    INSERT INTO content_store (key, lang, data, updated_at)
    VALUES (${KEY}, ${lang}, ${JSON.stringify(merged)}, now())
    ON CONFLICT (key, lang) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `;
}
