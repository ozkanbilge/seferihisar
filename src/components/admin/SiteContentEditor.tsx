"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-content";
import { LANGS, type Lang } from "@/lib/i18n";
import { ContentTreeEditor, setByPath, type Json } from "@/components/admin/ContentTreeEditor";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

/** Anahtar → kullanıcı dostu Türkçe etiket */
const LABELS: Record<string, string> = {
  footer: "Footer",
  stats: "İstatistik Barı",
  whyUs: "Neden Biz",
  arsa: "Arsa Sorgulama",
  featured: "Öne Çıkan İlanlar",
  blogSection: "Blog Bölümü",
  districts: "Bölgeler",
  guide: "Yatırım Rehberi",
  cta: "Alt Çağrı (CTA)",
  trust: "Güven Şeridi",
  newsletter: "Bülten",
  followLabel: "Takip Etiketi",
  columns: "Sütun Başlıkları",
  bottom: "Alt Bar",
  eyebrow: "Üst Etiket",
  title: "Başlık",
  titleGold: "Altın Başlık",
  titleLead: "Başlık (Düz)",
  subtitle: "Açıklama",
  sub: "Alt Metin",
  desc: "Açıklama",
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
  vitrinBadge: "Vitrin Rozeti",
  neighborhoodWord: "“Mahalle” Kelimesi",
  explore: "Keşfet Etiketi",
  faq: "Sık Sorulan Sorular",
  listingDetail: "İlan Detay",
  blogDetail: "Blog Detay",
  featuresTitle: "Özellikler Başlığı",
  locationTitle: "Konum Başlığı",
  locationNote: "Konum Notu",
  mapButton: "Harita Butonu",
  similarEyebrow: "Benzer — Üst Etiket",
  similarTitle: "Benzer — Başlık",
  othersEyebrow: "Diğer Yazılar — Üst Etiket",
  othersTitle: "Diğer Yazılar — Başlık",
  allPosts: "Tüm Yazılar Butonu",
  cittaslow: "Cittaslow Rozeti",
  place: "Yer Adı",
  caption: "Altyazı",
  quote: "Vurgu Alıntısı",
  highlights: "Avantajlar",
};

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
        Footer, istatistik etiketleri, arsa sorgulama, öne çıkan ilan rozetleri, Yatırım
        Rehberi ve diğer site geneli metinleri buradan düzenleyebilirsiniz. Değişiklikler
        kaydedilince anında yayına yansır.
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
