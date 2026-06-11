"use client";

import { useEffect, useState } from "react";
import type { EmsalEntry } from "@/lib/cms";

const ADMIN_KEY = "123321Aq";

/**
 * Gerçek emsal arsa fiyatları (TL/m²). Arsa değeri sorgulamada buradaki
 * fiyatlar varsa tahmin yerine bunlar kullanılır.
 */
export function EmsalEditor() {
  const [rows, setRows] = useState<EmsalEntry[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/emsal", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setRows)
      .catch(() => setMsg("Emsal listesi yüklenemedi."));
  }, []);

  const update = (i: number, key: keyof EmsalEntry, value: string) =>
    setRows((rs) => {
      if (!rs) return rs;
      const next = [...rs];
      next[i] = { ...next[i], [key]: key === "fiyat" ? Number(value) : value };
      return next;
    });

  const save = async () => {
    if (!rows) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/emsal", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify(rows),
      });
      if (!res.ok) throw new Error();
      setMsg("Kaydedildi — değerlemeler artık bu fiyatları kullanıyor.");
    } catch {
      setMsg("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full bg-cream-soft border border-cream-line rounded-lg px-3 py-2 text-xs text-fg focus:border-gold focus:outline-none";

  return (
    <div className="bg-surface border border-cream-line rounded-2xl p-5 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-fg">Gerçek Emsal Arsa Fiyatları</h3>
        <p className="text-[0.65rem] text-fg-muted mt-0.5 leading-relaxed">
          İlçe + mahalle için gerçek satış emsallerine dayanan arsa m² fiyatını girin.
          Arsa değeri sorgulamasında buradaki fiyat varsa otomatik tahmin yerine bu kullanılır.
        </p>
      </div>

      {!rows ? (
        <p className="text-xs text-fg-muted text-center py-6">{msg || "Yükleniyor..."}</p>
      ) : (
        <>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-[0.62rem] uppercase tracking-wider text-fg-muted font-semibold px-1">
              <span>İlçe</span>
              <span>Mahalle</span>
              <span>Arsa Fiyatı (TL/m²)</span>
              <span />
            </div>
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <input value={row.ilce} onChange={(e) => update(i, "ilce", e.target.value)} placeholder="Seferihisar" className={inputCls} />
                <input value={row.mahalle} onChange={(e) => update(i, "mahalle", e.target.value)} placeholder="Sığacık" className={inputCls} />
                <input
                  type="number"
                  value={row.fiyat || ""}
                  onChange={(e) => update(i, "fiyat", e.target.value)}
                  placeholder="25000"
                  className={inputCls}
                />
                <button
                  onClick={() => setRows((rs) => rs!.filter((_, j) => j !== i))}
                  className="p-2 text-red-400 hover:text-red-500 transition-colors"
                  aria-label="Satırı sil"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setRows((rs) => [...(rs ?? []), { ilce: "Seferihisar", mahalle: "", fiyat: 0 }])}
              className="btn btn-outline text-[0.65rem] px-4 py-2"
            >
              + Satır Ekle
            </button>
            <button onClick={save} disabled={saving} className="btn btn-gold text-[0.65rem] px-6 py-2 font-bold uppercase tracking-wider">
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            {msg && <span className="text-[0.65rem] font-semibold text-fg-muted">{msg}</span>}
          </div>
        </>
      )}
    </div>
  );
}
