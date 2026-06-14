"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/site-settings";
import { ContentTreeEditor, setByPath, type Json } from "@/components/admin/ContentTreeEditor";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

const LABELS: Record<string, string> = {
  phone: "Telefon (Görünen)",
  whatsapp: "WhatsApp Numarası (90...)",
  email: "E-posta",
  address: "Adres",
  street: "Cadde / Sokak",
  locality: "İlçe",
  region: "İl",
  postalCode: "Posta Kodu",
  social: "Sosyal Medya",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  agent: "Danışman",
  name: "Ad Soyad",
  title: "Ünvan",
  initials: "Baş Harfler",
  memberSince: "Üyelik Yılı",
};

export function SiteSettingsEditor() {
  const [content, setContent] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setContent)
      .catch(() => setMsg("Bilgiler yüklenemedi."));
  }, []);

  const onSet = (path: (string | number)[], v: Json) =>
    setContent((c) => (c ? (setByPath(c as unknown as Json, path, v) as unknown as SiteSettings) : c));

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Kaydedilemedi.");
      }
      setMsg("Kaydedildi — site genelinde güncellendi.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-fg-muted leading-relaxed">
        Telefon, WhatsApp, e-posta, adres, sosyal medya ve danışman bilgileri. Buradaki
        değişiklikler footer, header, iletişim sayfası ve site genelinde geçerli olur.
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
