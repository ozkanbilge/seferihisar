"use client";

import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { site } from "@/lib/site";
import { listings } from "@/data/listings";
import { Phone, Crown } from "@/components/icons";
import { HomepageEditor } from "@/components/admin/HomepageEditor";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";
import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";
import { ParselLogs } from "@/components/admin/ParselLogs";
import { EmsalEditor } from "@/components/admin/EmsalEditor";
import { ListingsEditor } from "@/components/admin/ListingsEditor";
import { MessagesPanel } from "@/components/admin/MessagesPanel";
import { SubscribersPanel } from "@/components/admin/SubscribersPanel";
import type { ServerAppointment } from "@/lib/appointments-store";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

type Panel = "randevular" | "mesajlar" | "bulten" | "ilanlar" | "anasayfa" | "site" | "iletisim" | "emsal" | "loglar";

const PANELS: { id: Panel; label: string }[] = [
  { id: "randevular", label: "Randevular" },
  { id: "mesajlar", label: "Mesajlar" },
  { id: "bulten", label: "Bülten" },
  { id: "ilanlar", label: "İlanlar" },
  { id: "anasayfa", label: "Anasayfa İçeriği" },
  { id: "site", label: "Site Metinleri" },
  { id: "iletisim", label: "İletişim Bilgileri" },
  { id: "emsal", label: "Emsal Fiyatları" },
  { id: "loglar", label: "Parsel Sorguları" },
];

export default function AdminPage() {
  const { adminLoggedIn, adminLogin, adminLogout } = useApp();

  // Randevular sunucudan gelir (tüm müşteri cihazlarından)
  const [appointments, setAppointments] = useState<ServerAppointment[]>([]);
  const loadAppointments = useCallback(() => {
    fetch("/api/admin/appointments", { headers: { "x-admin-key": ADMIN_KEY } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setAppointments)
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (adminLoggedIn) loadAppointments();
  }, [adminLoggedIn, loadAppointments]);

  const updateAppointmentStatus = async (id: string, status: "approved" | "cancelled") => {
    await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify({ id, status }),
    });
    loadAppointments();
  };

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "cancelled">("all");
  const [panel, setPanel] = useState<Panel>("randevular");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailInput || !passwordInput) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    const success = adminLogin(emailInput, passwordInput);
    if (!success) {
      setError("Hatalı e-posta adresi veya şifre.");
    }
  };

  // Filtered Appointments
  const filteredApps = appointments.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  // Calculate stats
  const totalApps = appointments.length;
  const pendingApps = appointments.filter((a) => a.status === "pending").length;
  const approvedApps = appointments.filter((a) => a.status === "approved").length;

  if (!adminLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-b from-ink-soft to-ink">
        {/* Dolaşan altın ambiyans */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[360px] rounded-full bg-gold/[0.08] blur-3xl animate-ambient pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[260px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />
        {/* İnce ızgara dokusu */}
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#c0a062_1px,transparent_1px),linear-gradient(to_bottom,#c0a062_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

        <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-gold/60 via-gold/12 to-gold/50 shadow-[0_30px_70px_rgba(0,0,0,0.5)] max-w-md w-full">
          <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-10 pointer-events-none" aria-hidden />
          <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-10 pointer-events-none" aria-hidden />
          <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-10 pointer-events-none" aria-hidden />
          <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-gold/70 rounded-br z-10 pointer-events-none" aria-hidden />
          <div className="rounded-[19px] bg-ink-card relative overflow-hidden p-8 md:p-10">
            {/* Üst altın şerit */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep" />

            <div className="text-center mb-8">
              {/* Halkalı logo */}
              <div className="relative inline-flex mb-4">
                <span className="absolute inset-0 rounded-full bg-gold/15 blur-xl animate-glow" />
                <Crown className="relative w-24 h-24 text-gold" />
              </div>
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
              <h1 className="text-2xl font-bold mb-1.5 font-[family-name:var(--font-cinzel)] uppercase tracking-[0.12em] royal-text">Yönetim Paneli</h1>
              <p className="text-xs text-fg-invert-muted/70">
                Lütfen yönetici giriş bilgilerini yazın.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[0.62rem] font-bold text-gold/80 uppercase tracking-[0.16em] mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/70">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 8l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></svg>
                  </span>
                  <input
                    type="email"
                    placeholder="admin@ornek.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-ink/60 border border-ink-line rounded-xl pl-11 pr-4 py-3 text-xs text-fg-invert placeholder-fg-invert-muted/30 focus:border-gold/60 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.62rem] font-bold text-gold/80 uppercase tracking-[0.16em] mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/70">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-ink/60 border border-ink-line rounded-xl pl-11 pr-4 py-3 text-xs text-fg-invert placeholder-fg-invert-muted/30 focus:border-gold/60 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full btn btn-gold justify-center py-3.5 text-xs font-bold uppercase tracking-[0.14em] mt-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
                Giriş Yap
              </button>
            </form>

            {/* Güvenli erişim rozeti */}
            <div className="flex items-center justify-center gap-1.5 mt-5 text-[0.6rem] text-fg-invert-muted/50 uppercase tracking-[0.14em]">
              <svg className="w-3 h-3 text-gold/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z" /><path d="M9 12l2 2 4-4" /></svg>
              Güvenli Yönetici Erişimi
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-16 min-h-[85vh] relative overflow-hidden">
      <div className="absolute -top-10 right-0 w-[420px] h-[260px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="card-luxe flex flex-col sm:flex-row justify-between sm:items-center gap-4 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            {/* Yönetici profil avatarı: varak monogram + taç rozeti */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-deep via-gold to-gold-bright p-[2px]">
                <div className="w-full h-full rounded-full bg-ink flex items-center justify-center">
                  <span className="font-[family-name:var(--font-cinzel-deco)] font-bold text-xl royal-text">
                    {site.agent.initials}
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gold flex items-center justify-center border-2 border-surface">
                <svg className="w-3.5 h-3.5 text-ink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 17h16M5 15l1.5-8L11 12l1-7 1 7 4.5-5L19 15z" />
                </svg>
              </span>
            </div>
            <div>
              <span className="text-[0.6rem] text-gold uppercase tracking-[0.18em] font-bold block">Yönetici</span>
              <h1 className="text-lg font-bold text-fg leading-tight">{site.agent.name}</h1>
              <span className="text-[0.68rem] text-fg-muted font-medium">
                {site.shortName} · Yönetim &amp; Randevu Paneli
              </span>
            </div>
          </div>
          <button
            onClick={adminLogout}
            className="btn btn-outline text-xs px-4 py-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 self-start sm:self-auto"
          >
            Panelden Çıkış
          </button>
        </div>

        {/* Panel Sekmeleri */}
        <div className="flex flex-wrap gap-1.5 bg-surface border border-cream-line p-1.5 rounded-2xl">
          {PANELS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPanel(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                panel === p.id
                  ? "bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink shadow-[0_2px_12px_rgba(192,160,98,0.35)]"
                  : "text-fg-muted hover:text-gold-bright border border-transparent"
              }`}
            >
              {panel === p.id && <span className="w-1.5 h-1.5 rotate-45 bg-ink/60 shrink-0" />}
              {p.label}
            </button>
          ))}
        </div>

        {panel === "mesajlar" && <MessagesPanel />}
        {panel === "bulten" && <SubscribersPanel />}
        {panel === "ilanlar" && <ListingsEditor />}
        {panel === "anasayfa" && <HomepageEditor />}
        {panel === "site" && <SiteContentEditor />}
        {panel === "iletisim" && <SiteSettingsEditor />}
        {panel === "emsal" && <EmsalEditor />}
        {panel === "loglar" && <ParselLogs />}

        {panel === "randevular" && (
        <>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative">
          {[
            { label: "Toplam Randevu", val: totalApps, color: "text-fg",
              icon: <path d="M3 8l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /> },
            { label: "Onay Bekleyenler", val: pendingApps, color: "text-amber-600",
              icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></> },
            { label: "Onaylananlar", val: approvedApps, color: "text-emerald-600",
              icon: <path d="M9 12l2 2 4-4M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z" /> },
            { label: "Toplam Portföy", val: listings.length, color: "text-gold-deep",
              icon: <path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6" /> },
          ].map((stat, i) => (
            <div key={stat.label} className="group card-luxe rounded-2xl p-5 relative overflow-hidden">
              <span className="absolute top-2 right-3 text-3xl font-[family-name:var(--font-cinzel)] font-bold text-gold/10 select-none pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/40">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{stat.icon}</svg>
              </div>
              <span className="text-[0.62rem] text-fg-muted uppercase tracking-[0.12em] font-semibold block mb-0.5">
                {stat.label}
              </span>
              <span className={`text-2xl md:text-3xl font-bold block font-[family-name:var(--font-cinzel)] ${stat.color}`}>
                {stat.val}
              </span>
              <span className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Appointments Section */}
        <div className="bg-surface border border-gold/15 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden relative">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-gold/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="display text-xl text-fg flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
              Randevu İstekleri
            </h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 bg-cream-soft border border-cream-line p-1 rounded-xl">
              {[
                { id: "all", label: "Tümü" },
                { id: "pending", label: "Bekleyenler" },
                { id: "approved", label: "Onaylananlar" },
                { id: "cancelled", label: "İptal Edilenler" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as "all" | "pending" | "approved" | "cancelled")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === tab.id
                      ? "bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink shadow-[0_2px_10px_rgba(192,160,98,0.35)]"
                      : "text-fg-muted hover:text-gold-bright"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table / List */}
          {filteredApps.length === 0 ? (
            <div className="text-center py-16 text-fg-muted text-xs">
              Bu filtreye uygun herhangi bir randevu kaydı bulunmamaktadır.
            </div>
          ) : (
            <div className="divide-y divide-cream-soft">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-gold/[0.04] transition-colors border-l-2 border-transparent hover:border-gold/40"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[0.62rem] font-bold text-fg-muted font-mono bg-cream-soft border border-cream-line px-2 py-0.5 rounded">
                        {app.id}
                      </span>
                      <span
                        className={`text-[0.6rem] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          app.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                            : app.status === "cancelled"
                            ? "bg-red-500/10 text-red-700 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                        }`}
                      >
                        {app.status === "approved"
                          ? "Onaylandı"
                          : app.status === "cancelled"
                          ? "İptal Edildi"
                          : "Onay Bekliyor"}
                      </span>
                      <span className="text-xs text-fg-muted">
                        Talep: {new Date(app.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm md:text-base text-fg line-clamp-1">
                      {app.listingTitle}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs text-fg-muted">
                      <div>Müşteri: <span className="font-semibold text-fg">{app.userPhone}</span></div>
                      <div>Tarih: <span className="font-semibold text-fg">{app.date}</span></div>
                      <div>Saat: <span className="font-semibold text-fg">{app.time}</span></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/${app.userPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Merhaba, Private Estate'ten Özkan Bilge ben. ${app.listingTitle} ilanı için yapmış olduğunuz ${app.date} - ${app.time} tarihli randevu talebinizle alakalı iletişime geçiyorum.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline text-xs px-4 py-2 border-cream-line hover:border-gold hover:text-gold-bright gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Müşteri ile İletişim
                    </a>

                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(app.id, "approved")}
                          className="btn btn-gold text-xs px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 border-none gap-1"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(app.id, "cancelled")}
                          className="btn btn-outline text-xs px-4 py-2 text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
                        >
                          İptal Et
                        </button>
                      </>
                    )}

                    {app.status === "approved" && (
                      <button
                        onClick={() => updateAppointmentStatus(app.id, "cancelled")}
                        className="btn btn-outline text-xs px-4 py-2 text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
                      >
                        İptal Et
                      </button>
                    )}

                    {app.status === "cancelled" && (
                      <button
                        onClick={() => updateAppointmentStatus(app.id, "approved")}
                        className="btn btn-gold text-xs px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 border-none"
                      >
                        Onayla
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
