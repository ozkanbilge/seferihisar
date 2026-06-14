"use client";

import { useCallback, useEffect, useState } from "react";
import type { Subscriber } from "@/lib/subscribers-store";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

export function SubscribersPanel() {
  const [subs, setSubs] = useState<Subscriber[] | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    setMsg("");
    fetch("/api/admin/subscribers", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setSubs)
      .catch(() => setMsg("Aboneler yüklenemedi."));
  }, []);

  useEffect(load, [load]);

  const remove = async (email: string) => {
    if (!confirm(`"${email}" aboneliği silinsin mi?`)) return;
    await fetch(`/api/admin/subscribers?email=${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: { "x-admin-key": ADMIN_KEY },
    });
    load();
  };

  const copyAll = async () => {
    if (!subs?.length) return;
    try {
      await navigator.clipboard.writeText(subs.map((s) => s.email).join(", "));
      setMsg("Tüm e-postalar panoya kopyalandı.");
      setTimeout(() => setMsg(""), 2500);
    } catch {}
  };

  return (
    <div className="bg-surface border border-cream-line rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-cream-line flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-fg">Bülten Aboneleri</h3>
          <p className="text-[0.65rem] text-fg-muted mt-0.5">
            {subs ? `${subs.length} abone` : "—"} · &quot;Yeni İlanlardan Haberdar Olun&quot; bölümünden gelen e-postalar.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyAll} className="btn btn-outline text-[0.65rem] px-3 py-1.5">
            Tümünü Kopyala
          </button>
          <button onClick={load} className="btn btn-outline text-[0.65rem] px-3 py-1.5">
            Yenile
          </button>
        </div>
      </div>

      {!subs ? (
        <p className="text-xs text-fg-muted text-center py-10">{msg || "Yükleniyor..."}</p>
      ) : subs.length === 0 ? (
        <p className="text-xs text-fg-muted text-center py-10">Henüz abone yok.</p>
      ) : (
        <>
          {msg && <p className="text-[0.65rem] text-gold-deep font-semibold px-5 pt-3">{msg}</p>}
          <div className="divide-y divide-cream-line">
            {subs.map((s) => (
              <div key={s.email} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-cream-soft/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 8l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></svg>
                  </span>
                  <div className="min-w-0">
                    <a href={`mailto:${s.email}`} className="block text-xs font-semibold text-fg hover:text-gold-bright transition-colors truncate">
                      {s.email}
                    </a>
                    <span className="text-[0.6rem] text-fg-muted">
                      {new Date(s.createdAt).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => remove(s.email)}
                  className="btn btn-outline text-[0.62rem] px-3 py-1.5 text-red-500 hover:border-red-400 shrink-0"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
