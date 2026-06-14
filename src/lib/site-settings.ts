import { getRawContent, setRawContent } from "@/lib/site-content";
import { site } from "@/lib/site";

/**
 * İletişim / kimlik bilgileri — admin panelden düzenlenir, Neon Postgres'te
 * (content_store key='site-settings') tutulur. site.ts varsayılan kaynaktır.
 */
export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: { street: string; locality: string; region: string; postalCode: string };
  social: { instagram: string; facebook: string; youtube: string; linkedin: string };
  agent: { name: string; title: string; initials: string; memberSince: string };
}

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  phone: site.phone,
  whatsapp: site.phoneHref.replace(/\D/g, ""),
  email: site.email,
  address: {
    street: site.address.street,
    locality: site.address.locality,
    region: site.address.region,
    postalCode: site.address.postalCode,
  },
  social: {
    instagram: site.social.instagram,
    facebook: site.social.facebook,
    youtube: site.social.youtube,
    linkedin: site.social.linkedin,
  },
  agent: {
    name: site.agent.name,
    title: site.agent.title,
    initials: site.agent.initials,
    memberSince: site.agent.memberSince,
  },
};

export type ResolvedSettings = SiteSettings & { phoneHref: string; whatsappHref: string };

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
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

function resolve(s: SiteSettings): ResolvedSettings {
  return {
    ...s,
    phoneHref: `tel:${s.phone.replace(/[^\d+]/g, "")}`,
    whatsappHref: `https://wa.me/${s.whatsapp.replace(/\D/g, "")}`,
  };
}

// Modül seviyesi TTL'li memo (build + runtime dostu)
let memo: { data: ResolvedSettings; exp: number } | null = null;
const TTL_MS = 30_000;

export async function getSiteSettings(): Promise<ResolvedSettings> {
  const now = Date.now();
  if (memo && memo.exp > now) return memo.data;
  const raw = await getRawContent("site-settings", "tr");
  const data = resolve(deepMerge(SITE_SETTINGS_DEFAULTS, raw));
  memo = { data, exp: now + TTL_MS };
  return data;
}

export async function saveSiteSettings(s: SiteSettings): Promise<void> {
  await setRawContent("site-settings", "tr", deepMerge(SITE_SETTINGS_DEFAULTS, s));
  memo = null;
}

/** Editör için ham (çözümlenmemiş) ayarları döndürür. */
export async function getRawSiteSettings(): Promise<SiteSettings> {
  const raw = await getRawContent("site-settings", "tr");
  return deepMerge(SITE_SETTINGS_DEFAULTS, raw);
}
