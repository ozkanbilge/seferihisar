"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-content";
import { LANGS, type Lang } from "@/lib/i18n";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

/** Anahtar → kullanıcı dostu Türkçe etiket */
const LABELS: Record<string, string> = {
  footer: "Footer",
  stats: "İstatistik Barı",
  whyUs: "Neden Biz",
  arsa: "Arsa Sorgulama",
  featured: "Öne Çıkan İlanlar",
  blogSection: "Blog Bölümü",
  cta: "Alt Çağrı (CTA)",
  trust: "Güven Şeridi",
  newsletter: "Bülten",
  followLabel: "Takip Etiketi",
  columns: "Sütun Başlıkları",
  bottom: "Alt Bar",
  eyebrow: "Üst Etiket",
  title: "Başlık",
  titleGold: "Altın Başlık",
  subtitle: "Açıklama",
  sub: "Alt Metin",
  quickLinks: "Hızlı Linkler",
  locations: "Bölgeler",
  deed: "Emlak & Tapu",
  contact: "İletişim",
  rights: "Telif Metni",
  privacy: "Gizlilik",
  terms: "Şartlar",
  labels: "Etiketler",
  lead: "Tanıtım Metni",
  badges: "Rozetler",
  weekPick: "Haftanın Seçimi Rozeti",
  listingBadge: "Vitrin Rozeti",
  viewListing: "İncele Butonu",
  featuredBadge: "Öne Çıkan Rozeti",
};

function pretty(key: string): string {
  if (LABELS[key]) return LABELS[key];
  if (/^\d+$/.test(key)) return `#${Number(key) + 1}`;
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

type Json = string | number | boolean | Json[] | { [k: string]: Json };

function setByPath(root: Json, path: (string | number)[], value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[head as number] = setByPath(copy[head as number], rest, value);
    return copy;
  }
  const obj = { ...(root as Record<string, Json>) };
  obj[head as string] = setByPath(obj[head as string], rest, value);
  return obj;
}

function FieldInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const cls =
    "w-full bg-cream-soft border border-cream-line rounded-xl px-3.5 py-2.5 text-xs text-fg focus:border-gold focus:outline-none transition-colors";
  return (
    <label className="block">
      <span className="block text-[0.65rem] font-semibold text-fg-muted uppercase tracking-wider mb-1">
        {label}
      </span>
      {value.length > 55 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </label>
  );
}

function ValueEditor({
  k,
  value,
  path,
  onSet,
  depth,
}: {
  k: string;
  value: Json;
  path: (string | number)[];
  onSet: (path: (string | number)[], v: Json) => void;
  depth: number;
}) {
  if (typeof value === "string") {
    return <FieldInput label={pretty(k)} value={value} onChange={(v) => onSet(path, v)} />;
  }
  const entries: [string, Json][] = Array.isArray(value)
    ? value.map((v, i) => [String(i), v])
    : Object.entries(value as Record<string, Json>);

  return (
    <div className={depth === 0 ? "rounded-2xl border border-cream-line bg-cream-soft/50 p-4" : ""}>
      <p
        className={`font-bold text-fg mb-3 ${
          depth === 0
            ? "text-sm font-[family-name:var(--font-cinzel)] uppercase tracking-[0.1em] text-gold-deep flex items-center gap-2"
            : "text-[0.7rem] uppercase tracking-wider text-fg-muted"
        }`}
      >
        {depth === 0 && <span className="w-1.5 h-1.5 rotate-45 bg-gold" />}
        {pretty(k)}
      </p>
      <div className={depth === 0 ? "space-y-3" : "space-y-3 pl-3 border-l border-gold/20"}>
        {entries.map(([ck, cv]) => (
          <ValueEditor
            key={ck}
            k={ck}
            value={cv}
            path={[...path, Array.isArray(value) ? Number(ck) : ck]}
            onSet={onSet}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
}

export function SiteContentEditor() {
  const [lang, setLang] = useState<Lang>("tr");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setContent(null);
    setMsg("");
    fetch(`/api/admin/site-content?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setContent)
      .catch(() => setMsg("İçerik yüklenemedi."));
  }, [lang]);

  const onSet = (path: (string | number)[], v: Json) =>
    setContent((c) => (c ? (setByPath(c as unknown as Json, path, v) as unknown as SiteContent) : c));

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({ lang, content }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Kaydedilemedi.");
      }
      setMsg("Kaydedildi — site anında güncellendi.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              lang === l.code
                ? "border-gold text-gold bg-gold/10"
                : "border-cream-line text-fg-muted hover:border-gold/50"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-fg-muted leading-relaxed">
        Footer, istatistik etiketleri, arsa sorgulama, öne çıkan ilan rozetleri ve diğer
        site geneli metinleri buradan düzenleyebilirsiniz. Değişiklikler kaydedilince
        anında yayına yansır.
      </p>

      {content === null ? (
        <div className="text-sm text-fg-muted">Yükleniyor…</div>
      ) : (
        <div className="space-y-5">
          {Object.entries(content as unknown as Record<string, Json>).map(([k, v]) => (
            <ValueEditor key={k} k={k} value={v} path={[k]} onSet={onSet} depth={0} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 sticky bottom-0 bg-surface/95 backdrop-blur py-3 -mx-1 px-1 border-t border-cream-line">
        <button
          onClick={save}
          disabled={saving || !content}
          className="btn btn-gold px-6 text-xs disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {msg && <span className="text-xs text-fg-muted">{msg}</span>}
      </div>
    </div>
  );
}
