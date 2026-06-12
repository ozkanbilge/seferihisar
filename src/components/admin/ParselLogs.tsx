"use client";

import { useCallback, useEffect, useState } from "react";
import type { ParselLogEntry } from "@/lib/cms";
import { formatPrice } from "@/lib/format";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

const DURUM_BADGE: Record<ParselLogEntry["durum"], { label: string; cls: string }> = {
  bulundu: { label: "Bulundu", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  bulunamadi: { label: "Bulunamadı", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  limit: { label: "TKGM Limiti", cls: "bg-red-500/10 text-red-600 border-red-500/20" },
  hata: { label: "Hata", cls: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function ParselLogs() {
  const [logs, setLogs] = useState<ParselLogEntry[] | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    setMsg("");
    fetch("/api/admin/parsel-logs", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setLogs)
      .catch(() => setMsg("Loglar yüklenemedi."));
  }, []);

  useEffect(load, [load]);

  const clear = async () => {
    if (!confirm("Tüm parsel sorgu logları silinsin mi?")) return;
    await fetch("/api/admin/parsel-logs", {
      method: "DELETE",
      headers: { "x-admin-key": ADMIN_KEY },
    });
    load();
  };

  return (
    <div className="bg-surface border border-cream-line rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-cream-line flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-fg">Arsa Değeri Sorgu Logları</h3>
          <p className="text-[0.65rem] text-fg-muted mt-0.5">
            Sitedeki her TKGM parsel sorgusu buraya işlenir (son 500 kayıt).
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn btn-outline text-[0.65rem] px-3 py-1.5">
            Yenile
          </button>
          <button
            onClick={clear}
            className="btn btn-outline text-[0.65rem] px-3 py-1.5 text-red-500 hover:border-red-400"
          >
            Temizle
          </button>
        </div>
      </div>

      {!logs ? (
        <p className="text-xs text-fg-muted text-center py-10">{msg || "Yükleniyor..."}</p>
      ) : logs.length === 0 ? (
        <p className="text-xs text-fg-muted text-center py-10">Henüz parsel sorgusu yapılmamış.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[0.62rem] uppercase tracking-wider text-fg-muted border-b border-cream-line">
                <th className="px-5 py-3 font-semibold">Tarih</th>
                <th className="px-3 py-3 font-semibold">Müşteri</th>
                <th className="px-3 py-3 font-semibold">Bölge</th>
                <th className="px-3 py-3 font-semibold">Ada/Parsel</th>
                <th className="px-3 py-3 font-semibold">Durum</th>
                <th className="px-3 py-3 font-semibold">Alan</th>
                <th className="px-5 py-3 font-semibold text-right">Tahmini Değer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-line">
              {logs.map((log, i) => (
                <tr key={`${log.ts}-${i}`} className="hover:bg-cream-soft/40 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap text-fg-muted">
                    {new Date(log.ts).toLocaleString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-3">
                    {log.musteriAd ? (
                      <>
                        <span className="block font-semibold text-fg whitespace-nowrap">{log.musteriAd}</span>
                        {log.musteriTel && (
                          <a
                            href={`tel:${log.musteriTel.replace(/\s/g, "")}`}
                            className="text-[0.62rem] text-gold-deep hover:text-gold-bright font-medium whitespace-nowrap"
                          >
                            {log.musteriTel}
                          </a>
                        )}
                      </>
                    ) : (
                      <span className="text-fg-muted">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-semibold text-fg">
                    {[log.il, log.ilce, log.mahalle].filter(Boolean).join(" / ") || "—"}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-fg whitespace-nowrap">
                    {log.ada} / {log.parsel}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full border text-[0.6rem] font-bold uppercase tracking-wide ${DURUM_BADGE[log.durum].cls}`}
                    >
                      {DURUM_BADGE[log.durum].label}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-fg-muted">
                    {log.alan ? `${log.alan.toLocaleString("tr-TR")} m²` : "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gold-deep whitespace-nowrap">
                    {log.tahminiDeger ? formatPrice(log.tahminiDeger) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
