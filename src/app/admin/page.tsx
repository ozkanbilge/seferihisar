"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp, type Appointment } from "@/context/AppContext";
import { listings } from "@/data/listings";
import { formatPrice } from "@/lib/format";
import { Phone, Check, Close, Logo } from "@/components/icons";

export default function AdminPage() {
  const {
    adminLoggedIn,
    adminLogin,
    adminLogout,
    appointments,
    updateAppointmentStatus,
  } = useApp();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "cancelled">("all");

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
  const cancelledApps = appointments.filter((a) => a.status === "cancelled").length;

  if (!adminLoggedIn) {
    return (
      <div className="container-x py-16 md:py-24 min-h-[80vh] flex items-center justify-center">
        <div className="bg-white border border-cream-line rounded-2xl p-8 max-w-md w-full shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-gold via-gold-bright to-gold-deep" />

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-12 h-12 text-gold" />
            </div>
            <h1 className="display text-2xl text-ink mb-1">Yönetim Paneli</h1>
            <p className="text-xs text-fg-muted">
              Lütfen yönetici giriş bilgilerini yazın.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">
                E-posta Adresi
              </label>
              <input
                type="email"
                placeholder="root@ozkanbilge.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-cream-soft border border-cream-line rounded-xl px-4 py-3 text-xs text-ink placeholder-fg-muted/40 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">
                Şifre
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-cream-soft border border-cream-line rounded-xl px-4 py-3 text-xs text-ink placeholder-fg-muted/40 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full btn btn-gold justify-center py-3.5 text-xs font-bold uppercase tracking-wider mt-4"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-16 min-h-[85vh]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-cream-line rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 text-gold" />
            <div>
              <h1 className="text-lg font-bold text-ink leading-tight">Seferihisar Emlak</h1>
              <span className="text-xs text-gold-deep font-semibold">Yönetim & Randevu Paneli</span>
            </div>
          </div>
          <button
            onClick={adminLogout}
            className="btn btn-outline text-xs px-4 py-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 self-start sm:self-auto"
          >
            Panelden Çıkış
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Toplam Randevu", val: totalApps, color: "text-ink bg-cream-soft" },
            { label: "Onay Bekleyenler", val: pendingApps, color: "text-amber-600 bg-amber-500/5" },
            { label: "Onaylananlar", val: approvedApps, color: "text-emerald-600 bg-emerald-500/5" },
            { label: "Toplam Portföy", val: listings.length, color: "text-gold-deep bg-gold/5" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-cream-line rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[0.65rem] text-fg-muted uppercase tracking-wider font-semibold block">
                {stat.label}
              </span>
              <span className={`text-2xl md:text-3xl font-extrabold block ${stat.color.split(" ")[0]}`}>
                {stat.val}
              </span>
            </div>
          ))}
        </div>

        {/* Appointments Section */}
        <div className="bg-white border border-cream-line rounded-2xl shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-cream-line flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="display text-xl text-ink">Randevu İstekleri</h2>

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
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === tab.id
                      ? "bg-white text-gold-deep shadow-sm"
                      : "text-fg-muted hover:text-ink"
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
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-cream-soft/30 transition-colors"
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

                    <h3 className="font-semibold text-sm md:text-base text-ink line-clamp-1">
                      {app.listingTitle}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs text-fg-muted">
                      <div>👤 Müşteri: <span className="font-semibold text-ink">{app.userPhone}</span></div>
                      <div>📅 Tarih: <span className="font-semibold text-ink">{app.date}</span></div>
                      <div>⏰ Saat: <span className="font-semibold text-ink">{app.time}</span></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/${app.userPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Merhaba, Seferihisar Emlak'tan Özkan Bilge ben. ${app.listingTitle} ilanı için yapmış olduğunuz ${app.date} - ${app.time} tarihli randevu talebinizle alakalı iletişime geçiyorum.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline text-xs px-4 py-2 border-cream-line hover:border-gold hover:text-gold-deep gap-1.5"
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
      </div>
    </div>
  );
}
