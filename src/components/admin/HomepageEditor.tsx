"use client";

import { useEffect, useState } from "react";
import type { HomepageContent } from "@/lib/cms";
import { LANGS, type Lang } from "@/lib/i18n";
import { ContentTreeEditor, setByPath, type Json } from "@/components/admin/ContentTreeEditor";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

/** Anahtar → kullanıcı dostu Türkçe etiket */
const LABELS: Record<string, string> = {
  hero: "Hero (Üst Bölüm)",
  sections: "Bölüm Görünürlüğü",
  featured: "Öne Çıkan İlanlar",
  propertyTypes: "Gayrimenkul Türleri",
  districts: "Bölgeler",
  neighborhoods: "Mahalleler",
  whyUs: "Neden Biz",
  blog: "Blog",
  cta: "Alt İletişim Çağrısı",
  popularSearches: "Popüler Aramalar",
  stats: "İstatistik Barı",
  arsaSorgula: "Arsa Değeri Sorgulama",
  eyebrow: "Üst Etiket",
  title: "Başlık",
  titleGold: "Altın Başlık",
  subtitle: "Açıklama",
  count: "İlan Adedi",
  items: "Maddeler",
  desc: "Açıklama",
  label: "Etiket",
  href: "Bağlantı",
};

export function HomepageEditor() {
  const [lang, setLang] = useState<Lang>("tr");
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setContent(null);
    setMsg("");
    fetch(`/api/admin/homepage?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setContent)
      .catch(() => setMsg("İçerik yüklenemedi."));
  }, [lang]);

  const onSet = (path: (string | number)[], v: Json) =>
    setContent((c) => (c ? (setByPath(c as unknown as Json, path, v) as unknown as HomepageContent) : c));

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({ lang, content }),
      });
      if (!res.ok) throw new Error();
      setMsg("Kaydedildi — anasayfa anında güncellendi.");
    } catch {
      setMsg("Kaydedilemedi. Lütfen tekrar deneyin.");
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
        Hero, bölüm başlıkları, Neden Biz maddeleri, alt çağrı ve popüler aramaları
        düzenleyin; bölümlerin görünürlüğünü açıp kapatın. Kaydedince anasayfa anında
        güncellenir.
      </p>

      {content === null ? (
        <div className="text-sm text-fg-muted">Yükleniyor…</div>
      ) : (
        <ContentTreeEditor value={content as unknown as Record<string, Json>} onSet={onSet} labels={LABELS} />
      )}

      <div className="flex items-center gap-3 sticky bottom-0 bg-surface/95 backdrop-blur py-3 -mx-1 px-1 border-t border-cream-line">
        <button onClick={save} disabled={saving || !content} className="btn btn-gold px-6 text-xs disabled:opacity-60">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {msg && <span className="text-xs text-fg-muted">{msg}</span>}
      </div>
    </div>
  );
}
