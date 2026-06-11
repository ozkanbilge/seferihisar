"use client";

import { useEffect, useState } from "react";
import type { HomepageContent } from "@/lib/cms";
import { LANGS, type Lang } from "@/lib/i18n";

const ADMIN_KEY = "123321Aq";

const SECTION_LABELS: Record<keyof HomepageContent["sections"], string> = {
  stats: "İstatistik Barı",
  featured: "Öne Çıkan İlanlar",
  propertyTypes: "Gayrimenkul Türleri",
  districts: "Bölgeler",
  arsaSorgula: "Arsa Değeri Sorgulama",
  neighborhoods: "Mahalleler",
  whyUs: "Neden Biz",
  blog: "Blog",
  cta: "Alt İletişim Çağrısı",
};

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const cls =
    "w-full bg-cream-soft border border-cream-line rounded-xl px-3.5 py-2.5 text-xs text-fg focus:border-gold focus:outline-none transition-colors";
  return (
    <label className="block">
      <span className="block text-[0.65rem] font-semibold text-fg-muted uppercase tracking-wider mb-1">
        {label}
      </span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

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

  // İç içe alan güncelleme yardımcısı
  const set = (updater: (c: HomepageContent) => HomepageContent) =>
    setContent((c) => (c ? updater(structuredClone(c)) : c));

  return (
    <div className="space-y-6">
      {/* Dil sekmeleri */}
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

      {!content ? (
        <p className="text-xs text-fg-muted py-8 text-center">{msg || "Yükleniyor..."}</p>
      ) : (
        <div className="space-y-8">
          {/* Bölüm görünürlükleri */}
          <section className="bg-surface border border-cream-line rounded-2xl p-5">
            <h3 className="text-sm font-bold text-fg mb-4">Bölüm Görünürlüğü</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(SECTION_LABELS) as (keyof HomepageContent["sections"])[]).map((key) => (
                <label key={key} className="flex items-center gap-2 text-xs text-fg-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.sections[key]}
                    onChange={(e) =>
                      set((c) => {
                        c.sections[key] = e.target.checked;
                        return c;
                      })
                    }
                    className="accent-[#c0a062] w-4 h-4"
                  />
                  {SECTION_LABELS[key]}
                </label>
              ))}
            </div>
          </section>

          {/* Hero */}
          <section className="bg-surface border border-cream-line rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-fg">Hero (Giriş)</h3>
            <Field label="Üst Etiket" value={content.hero.eyebrow} onChange={(v) => set((c) => ((c.hero.eyebrow = v), c))} />
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Başlık" value={content.hero.title} onChange={(v) => set((c) => ((c.hero.title = v), c))} />
              <Field label="Altın Başlık" value={content.hero.titleGold} onChange={(v) => set((c) => ((c.hero.titleGold = v), c))} />
            </div>
            <Field label="Açıklama" textarea value={content.hero.subtitle} onChange={(v) => set((c) => ((c.hero.subtitle = v), c))} />
          </section>

          {/* Öne çıkanlar + diğer bölüm başlıkları */}
          <section className="bg-surface border border-cream-line rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-fg">Bölüm Başlıkları</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Öne Çıkanlar — Etiket" value={content.featured.eyebrow} onChange={(v) => set((c) => ((c.featured.eyebrow = v), c))} />
              <Field label="Öne Çıkanlar — Başlık" value={content.featured.title} onChange={(v) => set((c) => ((c.featured.title = v), c))} />
              <label className="block">
                <span className="block text-[0.65rem] font-semibold text-fg-muted uppercase tracking-wider mb-1">
                  Öne Çıkan İlan Adedi
                </span>
                <input
                  type="number"
                  min={3}
                  max={12}
                  value={content.featured.count}
                  onChange={(e) => set((c) => ((c.featured.count = parseInt(e.target.value, 10) || 6), c))}
                  className="w-full bg-cream-soft border border-cream-line rounded-xl px-3.5 py-2.5 text-xs text-fg focus:border-gold focus:outline-none"
                />
              </label>
              <Field label="Türler — Etiket" value={content.propertyTypes.eyebrow} onChange={(v) => set((c) => ((c.propertyTypes.eyebrow = v), c))} />
              <Field label="Türler — Başlık" value={content.propertyTypes.title} onChange={(v) => set((c) => ((c.propertyTypes.title = v), c))} />
              <Field label="Bölgeler — Etiket" value={content.districts.eyebrow} onChange={(v) => set((c) => ((c.districts.eyebrow = v), c))} />
              <Field label="Bölgeler — Başlık" value={content.districts.title} onChange={(v) => set((c) => ((c.districts.title = v), c))} />
              <Field label="Mahalleler — Etiket" value={content.neighborhoods.eyebrow} onChange={(v) => set((c) => ((c.neighborhoods.eyebrow = v), c))} />
              <Field label="Mahalleler — Başlık" value={content.neighborhoods.title} onChange={(v) => set((c) => ((c.neighborhoods.title = v), c))} />
              <Field label="Blog — Etiket" value={content.blog.eyebrow} onChange={(v) => set((c) => ((c.blog.eyebrow = v), c))} />
              <Field label="Blog — Başlık" value={content.blog.title} onChange={(v) => set((c) => ((c.blog.title = v), c))} />
            </div>
            <Field label="Bölgeler — Açıklama" textarea value={content.districts.subtitle} onChange={(v) => set((c) => ((c.districts.subtitle = v), c))} />
          </section>

          {/* Neden Biz */}
          <section className="bg-surface border border-cream-line rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-fg">Neden Biz</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Etiket" value={content.whyUs.eyebrow} onChange={(v) => set((c) => ((c.whyUs.eyebrow = v), c))} />
              <Field label="Başlık" value={content.whyUs.title} onChange={(v) => set((c) => ((c.whyUs.title = v), c))} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.whyUs.items.map((item, i) => (
                <div key={i} className="border border-cream-line rounded-xl p-3 space-y-2">
                  <Field label={`Kart ${i + 1} — Başlık`} value={item.title} onChange={(v) => set((c) => ((c.whyUs.items[i].title = v), c))} />
                  <Field label={`Kart ${i + 1} — Açıklama`} textarea value={item.desc} onChange={(v) => set((c) => ((c.whyUs.items[i].desc = v), c))} />
                </div>
              ))}
            </div>
          </section>

          {/* Alt CTA */}
          <section className="bg-surface border border-cream-line rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-fg">Alt İletişim Çağrısı</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Etiket" value={content.cta.eyebrow} onChange={(v) => set((c) => ((c.cta.eyebrow = v), c))} />
              <Field label="Başlık" value={content.cta.title} onChange={(v) => set((c) => ((c.cta.title = v), c))} />
              <Field label="Altın Başlık" value={content.cta.titleGold} onChange={(v) => set((c) => ((c.cta.titleGold = v), c))} />
            </div>
            <Field label="Açıklama" textarea value={content.cta.subtitle} onChange={(v) => set((c) => ((c.cta.subtitle = v), c))} />
          </section>

          <div className="flex items-center gap-4">
            <button
              onClick={save}
              disabled={saving}
              className="btn btn-gold text-xs px-8 py-3 font-bold uppercase tracking-wider"
            >
              {saving ? "Kaydediliyor..." : "Kaydet & Yayınla"}
            </button>
            {msg && <span className="text-xs font-semibold text-fg-muted">{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
