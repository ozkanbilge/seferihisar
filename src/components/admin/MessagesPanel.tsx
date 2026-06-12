"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactMessage } from "@/lib/messages-store";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

export function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    setMsg("");
    fetch("/api/admin/messages", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setMessages)
      .catch(() => setMsg("Mesajlar yüklenemedi."));
  }, []);

  useEffect(load, [load]);

  const toggleRead = async (m: ContactMessage) => {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify({ id: m.id, read: !m.read }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Mesaj silinsin mi?")) return;
    await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-admin-key": ADMIN_KEY },
    });
    load();
  };

  const unread = messages?.filter((m) => !m.read).length ?? 0;

  return (
    <div className="bg-surface border border-cream-line rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-cream-line flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-fg">İletişim Mesajları</h3>
          <p className="text-[0.65rem] text-fg-muted mt-0.5">
            {messages ? `${messages.length} mesaj · ${unread} okunmamış` : "—"}
          </p>
        </div>
        <button onClick={load} className="btn btn-outline text-[0.65rem] px-3 py-1.5">
          Yenile
        </button>
      </div>

      {!messages ? (
        <p className="text-xs text-fg-muted text-center py-10">{msg || "Yükleniyor..."}</p>
      ) : messages.length === 0 ? (
        <p className="text-xs text-fg-muted text-center py-10">Henüz mesaj yok.</p>
      ) : (
        <div className="divide-y divide-cream-line">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-5 transition-colors ${m.read ? "opacity-70" : "bg-gold/[0.04]"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {!m.read && <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />}
                    <span className="text-sm font-bold text-fg">{m.name}</span>
                    {m.subject && (
                      <span className="px-2 py-0.5 rounded-full border border-gold/25 text-[0.6rem] font-semibold text-gold-deep">
                        {m.subject}
                      </span>
                    )}
                  </div>
                  <p className="text-[0.62rem] text-fg-muted mt-1">
                    <span className="font-mono">{m.id}</span> ·{" "}
                    {new Date(m.createdAt).toLocaleString("tr-TR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}{" "}
                    · {m.phone}
                    {m.email ? ` · ${m.email}` : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${m.phone.replace(/\D/g, "").replace(/^0/, "90")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline text-[0.62rem] px-3 py-1.5"
                  >
                    WhatsApp
                  </a>
                  <button onClick={() => toggleRead(m)} className="btn btn-outline text-[0.62rem] px-3 py-1.5">
                    {m.read ? "Okunmadı yap" : "Okundu"}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    className="btn btn-outline text-[0.62rem] px-3 py-1.5 text-red-500 hover:border-red-400"
                  >
                    Sil
                  </button>
                </div>
              </div>
              <p className="text-xs text-fg-muted leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
