"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Listing, Tier } from "@/data/listings";
import { districts } from "@/data/locations";
import { propertyTypes } from "@/data/property-types";
import { formatPrice } from "@/lib/format";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

const EMPTY: Listing = {
  slug: "",
  title: "",
  transaction: "satilik",
  typeSlug: "villa",
  districtSlug: "seferihisar",
  neighborhoodSlug: "",
  price: 0,
  area: 0,
  description: "",
  features: [],
  images: [],
  videos: [],
  tier: "ucretsiz",
  featured: false,
  createdAt: "",
  ref: "",
};

const slugify = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" }[c] ?? c))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const inputCls =
  "w-full bg-cream-soft border border-cream-line rounded-xl px-3.5 py-2.5 text-xs text-fg focus:border-gold focus:outline-none transition-colors";
const labelCls = "block text-[0.62rem] font-semibold text-fg-muted uppercase tracking-wider mb-1";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

export function ListingsEditor() {
  const [items, setItems] = useState<Listing[] | null>(null);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    fetch("/api/admin/listings", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setItems)
      .catch(() => setMsg("İlanlar yüklenemedi."));
  }, []);

  useEffect(load, [load]);

  const set = (patch: Partial<Listing>) =>
    setEditing((e) => (e ? { ...e, ...patch } : e));

  const startNew = () => {
    setEditing({ ...EMPTY, neighborhoodSlug: districts[0].neighborhoods[0].slug });
    setSlugTouched(false);
    setMsg("");
  };

  const startEdit = (l: Listing) => {
    setEditing({ ...EMPTY, ...l, videos: l.videos ?? [] });
    setSlugTouched(true);
    setMsg("");
  };

  const upload = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-key": ADMIN_KEY },
      body: fd,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setMsg(data?.error ?? "Yükleme başarısız.");
      return null;
    }
    return data.url as string;
  };

  const handleFiles = async (files: FileList | null, kind: "image" | "video") => {
    if (!files?.length || !editing) return;
    setUploading(true);
    setMsg("");
    for (const file of Array.from(files)) {
      const url = await upload(file);
      if (url) {
        setEditing((e) =>
          e
            ? kind === "image"
              ? { ...e, images: [...e.images, url] }
              : { ...e, videos: [...(e.videos ?? []), url] }
            : e
        );
      }
    }
    setUploading(false);
  };

  const moveImage = (i: number, dir: -1 | 1) =>
    setEditing((e) => {
      if (!e) return e;
      const imgs = [...e.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return e;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...e, images: imgs };
    });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify(editing),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Kaydedilemedi.");
      setMsg("Kaydedildi — ilan sitede yayında.");
      setEditing(null);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (slug: string) => {
    if (!confirm(`"${slug}" ilanı silinsin mi?`)) return;
    await fetch(`/api/admin/listings?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { "x-admin-key": ADMIN_KEY },
    });
    load();
  };

  const district = districts.find((d) => d.slug === editing?.districtSlug);

  /* ── Form görünümü ── */
  if (editing) {
    return (
      <div className="bg-surface border border-cream-line rounded-2xl p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-fg">
            {editing.ref ? `İlanı Düzenle — ${editing.ref}` : "Yeni İlan"}
          </h3>
          <button onClick={() => setEditing(null)} className="btn btn-outline text-[0.65rem] px-4 py-1.5">
            ← Listeye Dön
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="İlan Başlığı *" className="md:col-span-2">
            <input
              value={editing.title}
              onChange={(e) => {
                const title = e.target.value;
                set(slugTouched ? { title } : { title, slug: slugify(title) });
              }}
              placeholder="Sığacık Deniz Manzaralı Lüks Villa"
              className={inputCls}
            />
          </Field>
          <Field label="Slug (URL) *">
            <input
              value={editing.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set({ slug: slugify(e.target.value) });
              }}
              placeholder="sigacik-deniz-manzarali-villa"
              className={`${inputCls} font-mono`}
            />
          </Field>
          <Field label="İlan No">
            <input
              value={editing.ref}
              onChange={(e) => set({ ref: e.target.value })}
              placeholder="boş bırak → otomatik"
              className={`${inputCls} font-mono`}
            />
          </Field>

          <Field label="İşlem *">
            <select
              value={editing.transaction}
              onChange={(e) => set({ transaction: e.target.value as Listing["transaction"] })}
              className={inputCls}
            >
              <option value="satilik">Satılık</option>
              <option value="kiralik">Kiralık</option>
            </select>
          </Field>
          <Field label="Tür *">
            <select
              value={editing.typeSlug}
              onChange={(e) => set({ typeSlug: e.target.value })}
              className={inputCls}
            >
              {propertyTypes.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </Field>
          <Field label="İlçe *">
            <select
              value={editing.districtSlug}
              onChange={(e) => {
                const d = districts.find((x) => x.slug === e.target.value);
                set({ districtSlug: e.target.value, neighborhoodSlug: d?.neighborhoods[0]?.slug ?? "" });
              }}
              className={inputCls}
            >
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Mahalle *">
            <select
              value={editing.neighborhoodSlug}
              onChange={(e) => set({ neighborhoodSlug: e.target.value })}
              className={inputCls}
            >
              {district?.neighborhoods.map((n) => (
                <option key={n.slug} value={n.slug}>{n.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Fiyat (TL) *">
            <input
              type="number"
              value={editing.price || ""}
              onChange={(e) => set({ price: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="Alan (m²) *">
            <input
              type="number"
              value={editing.area || ""}
              onChange={(e) => set({ area: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="Oda (örn. 4+1)">
            <input value={editing.rooms ?? ""} onChange={(e) => set({ rooms: e.target.value || undefined })} className={inputCls} />
          </Field>
          <Field label="Banyo">
            <input type="number" value={editing.bath ?? ""} onChange={(e) => set({ bath: e.target.value ? Number(e.target.value) : undefined })} className={inputCls} />
          </Field>
          <Field label="Kat/Yapı">
            <input value={editing.floor ?? ""} onChange={(e) => set({ floor: e.target.value || undefined })} className={inputCls} />
          </Field>
          <Field label="Yapı Yaşı">
            <input value={editing.buildingAge ?? ""} onChange={(e) => set({ buildingAge: e.target.value || undefined })} className={inputCls} />
          </Field>
          <Field label="Isınma">
            <input value={editing.heating ?? ""} onChange={(e) => set({ heating: e.target.value || undefined })} className={inputCls} />
          </Field>

          <Field label="Vitrin Seviyesi">
            <select value={editing.tier} onChange={(e) => set({ tier: e.target.value as Tier })} className={inputCls}>
              <option value="ucretsiz">Standart</option>
              <option value="vitrin">Vitrin</option>
              <option value="premium">Premium</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-xs text-fg-muted cursor-pointer self-end pb-2.5">
            <input
              type="checkbox"
              checked={editing.featured}
              onChange={(e) => set({ featured: e.target.checked })}
              className="accent-[#c0a062] w-4 h-4"
            />
            Anasayfada &quot;Öne Çıkanlar&quot;da göster
          </label>

          <Field label="Açıklama *" className="md:col-span-2">
            <textarea
              value={editing.description}
              onChange={(e) => set({ description: e.target.value })}
              rows={4}
              className={`${inputCls} resize-y`}
            />
          </Field>
          <Field label="Özellikler (her satıra bir tane)" className="md:col-span-2">
            <textarea
              value={editing.features.join("\n")}
              onChange={(e) => set({ features: e.target.value.split("\n") })}
              rows={3}
              placeholder={"Deniz manzarası\nÖzel havuz\nAkıllı ev sistemi"}
              className={`${inputCls} resize-y`}
            />
          </Field>
        </div>

        {/* ── Görseller ── */}
        <div className="border-t border-cream-line pt-4">
          <span className={labelCls}>Görseller (ilk görsel kapak olur)</span>
          <div className="flex flex-wrap gap-3 mb-3">
            {editing.images.map((img, i) => (
              <div key={`${img}-${i}`} className="relative w-28 h-20 rounded-xl overflow-hidden ring-1 ring-gold/20 group">
                <Image src={img} alt={`Görsel ${i + 1}`} fill sizes="112px" className="object-cover" unoptimized />
                {i === 0 && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-gold text-ink text-[0.5rem] font-bold uppercase">Kapak</span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-1 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveImage(i, -1)} className="text-fg-invert text-[0.6rem] px-1 hover:text-gold" aria-label="Sola taşı">◀</button>
                  <button onClick={() => moveImage(i, 1)} className="text-fg-invert text-[0.6rem] px-1 hover:text-gold" aria-label="Sağa taşı">▶</button>
                  <button
                    onClick={() => set({ images: editing.images.filter((_, j) => j !== i) })}
                    className="text-red-400 text-[0.6rem] px-1 hover:text-red-300"
                    aria-label="Sil"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
              onChange={(e) => { handleFiles(e.target.files, "image"); e.target.value = ""; }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-gold text-[0.65rem] px-4 py-2">
              {uploading ? "Yükleniyor..." : "+ Resim Yükle"}
            </button>
            <input
              placeholder="veya URL yapıştır + Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = e.currentTarget.value.trim();
                  if (v) set({ images: [...editing.images, v] });
                  e.currentTarget.value = "";
                }
              }}
              className={`${inputCls} max-w-64`}
            />
          </div>
        </div>

        {/* ── Videolar ── */}
        <div className="border-t border-cream-line pt-4">
          <span className={labelCls}>Videolar (mp4 / webm / mov)</span>
          <div className="flex flex-wrap gap-3 mb-3">
            {(editing.videos ?? []).map((v, i) => (
              <div key={`${v}-${i}`} className="relative w-44 rounded-xl overflow-hidden ring-1 ring-gold/20">
                <video src={v} className="w-full h-24 object-cover bg-ink" muted />
                <button
                  onClick={() => set({ videos: (editing.videos ?? []).filter((_, j) => j !== i) })}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 text-red-400 text-[0.6rem] flex items-center justify-center hover:text-red-300"
                  aria-label="Videoyu sil"
                >✕</button>
              </div>
            ))}
          </div>
          <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" multiple hidden
            onChange={(e) => { handleFiles(e.target.files, "video"); e.target.value = ""; }} />
          <button onClick={() => videoRef.current?.click()} disabled={uploading} className="btn btn-outline text-[0.65rem] px-4 py-2">
            {uploading ? "Yükleniyor..." : "+ Video Yükle"}
          </button>
        </div>

        <div className="flex items-center gap-3 border-t border-cream-line pt-4">
          <button onClick={save} disabled={saving || uploading} className="btn btn-gold text-xs px-8 py-2.5 font-bold uppercase tracking-wider">
            {saving ? "Kaydediliyor..." : "Kaydet & Yayınla"}
          </button>
          {msg && <span className="text-xs font-semibold text-fg-muted">{msg}</span>}
        </div>
      </div>
    );
  }

  /* ── Liste görünümü ── */
  return (
    <div className="bg-surface border border-cream-line rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-cream-line flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-fg">İlan Yönetimi</h3>
          <p className="text-[0.65rem] text-fg-muted mt-0.5">
            {items ? `${items.length} ilan` : "—"} · düzenle, sil veya yeni ekle; değişiklikler anında yayında.
          </p>
        </div>
        <button onClick={startNew} className="btn btn-gold text-[0.65rem] px-4 py-2 font-bold uppercase tracking-wider">
          + Yeni İlan
        </button>
      </div>

      {!items ? (
        <p className="text-xs text-fg-muted text-center py-10">{msg || "Yükleniyor..."}</p>
      ) : (
        <div className="divide-y divide-cream-line">
          {items.map((l) => (
            <div key={l.slug} className="p-4 flex items-center gap-4 hover:bg-cream-soft/40 transition-colors">
              <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 ring-1 ring-gold/15 bg-ink-soft">
                {l.images[0] && (
                  <Image src={l.images[0]} alt={l.title} fill sizes="80px" className="object-cover" unoptimized />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-fg truncate">{l.title}</p>
                <p className="text-[0.62rem] text-fg-muted mt-0.5">
                  <span className="font-mono">{l.ref}</span> · {l.transaction === "satilik" ? "Satılık" : "Kiralık"} ·{" "}
                  <span className="font-semibold text-gold-deep">{formatPrice(l.price)}</span>
                  {l.videos?.length ? ` · 🎬 ${l.videos.length}` : ""}
                </p>
              </div>
              <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[0.58rem] font-bold uppercase tracking-wide border ${
                l.tier === "premium"
                  ? "bg-gold/10 text-gold-deep border-gold/30"
                  : l.tier === "vitrin"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "text-fg-muted border-cream-line"
              }`}>
                {l.tier === "ucretsiz" ? "standart" : l.tier}
              </span>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(l)} className="btn btn-outline text-[0.62rem] px-3 py-1.5">
                  Düzenle
                </button>
                <button onClick={() => remove(l.slug)} className="btn btn-outline text-[0.62rem] px-3 py-1.5 text-red-500 hover:border-red-400">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
