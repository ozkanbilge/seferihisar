"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { listings } from "@/data/listings";
import { formatPrice, formatArea } from "@/lib/format";
import { Phone, Star, Bed, AreaIcon, Bath, Check } from "@/components/icons";

export default function UserAccountPage() {
  const { userPhone, login, logout, favorites, toggleFavorite, appointments } = useApp();
  const [phoneInput, setPhoneInput] = useState("");
  const [activeTab, setActiveTab] = useState<"randevu" | "favori">("randevu");
  const [error, setError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      setError("Lütfen geçerli bir telefon numarası girin.");
      return;
    }
    setError("");
    login(phoneInput);
  };

  // Filter listings by favorites
  const myFavListings = listings.filter((l) => favorites.includes(l.slug));

  // Filter appointments for this user
  const myAppointments = appointments.filter((a) => a.userPhone === userPhone);

  if (!userPhone) {
    return (
      <div className="container-x py-16 md:py-24 min-h-[70vh] flex items-center justify-center">
        <div className="bg-white border border-cream-line rounded-2xl p-8 max-w-md w-full shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-gold via-gold-bright to-gold-deep" />
          
          <div className="text-center mb-8">
            <h1 className="display text-2xl md:text-3xl text-ink mb-3">Kullanıcı Girişi</h1>
            <p className="text-sm text-fg-muted">
              Beğendiğiniz gayrimenkulleri kaydetmek ve tek tuşla randevu oluşturmak için telefon numaranızla giriş yapın.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">
                Telefon Numaranız
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-fg-muted font-medium">
                  +90
                </span>
                <input
                  type="tel"
                  placeholder="5XX XXX XX XX"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-cream-soft border border-cream-line rounded-xl pl-14 pr-4 py-3.5 text-sm text-ink placeholder-fg-muted/40 focus:border-gold focus:outline-none transition-colors font-medium"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full btn btn-gold justify-center py-3.5 text-sm font-bold uppercase tracking-wider"
            >
              Giriş Yap
            </button>
          </form>

          <p className="text-[0.7rem] text-fg-muted/70 text-center mt-5">
            Giriş yaparak kullanım koşullarını kabul etmiş olursunuz. Şifresiz ve hızlı erişim sağlanır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-16 min-h-[80vh]">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white border border-cream-line rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 text-gold-deep text-xl font-bold">
              👤
            </div>
            <div>
              <span className="text-xs text-fg-muted uppercase tracking-wider block font-semibold">
                Hoş Geldiniz
              </span>
              <h1 className="text-lg md:text-xl font-bold text-ink">{userPhone}</h1>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/admin" className="btn btn-outline text-xs px-4 py-2 border-cream-line hover:border-gold">
              Admin Paneli
            </Link>
            <button
              onClick={logout}
              className="btn btn-outline text-xs px-4 py-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-cream-line mb-8 gap-6">
          <button
            onClick={() => setActiveTab("randevu")}
            className={`pb-4 text-sm font-semibold tracking-wide uppercase transition-all relative ${
              activeTab === "randevu"
                ? "text-gold-deep"
                : "text-fg-muted hover:text-ink"
            }`}
          >
            Randevularım ({myAppointments.length})
            {activeTab === "randevu" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gold-deep rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("favori")}
            className={`pb-4 text-sm font-semibold tracking-wide uppercase transition-all relative ${
              activeTab === "favori"
                ? "text-gold-deep"
                : "text-fg-muted hover:text-ink"
            }`}
          >
            Beğendiğim İlanlar ({myFavListings.length})
            {activeTab === "favori" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gold-deep rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "randevu" && (
          <div className="space-y-4">
            {myAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white border border-cream-line rounded-2xl shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mx-auto mb-4 border border-gold/15 text-2xl">
                  📅
                </div>
                <h3 className="text-base font-semibold text-ink mb-1">Randevunuz Bulunmuyor</h3>
                <p className="text-xs text-fg-muted max-w-xs mx-auto mb-5">
                  Herhangi bir gayrimenkul detay sayfasından tek tuşla hızlı randevu oluşturabilirsiniz.
                </p>
                <Link href="/satilik" className="btn btn-gold text-xs py-2 px-5">
                  İlanları İncele
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white border border-cream-line rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[0.65rem] font-bold text-fg-muted font-mono uppercase bg-cream-soft border border-cream-line px-2 py-0.5 rounded">
                          {app.id}
                        </span>
                        <span
                          className={`text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
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
                      </div>
                      <h3 className="text-sm md:text-base font-semibold text-ink leading-snug line-clamp-1">
                        {app.listingTitle}
                      </h3>
                      <div className="text-xs text-fg-muted flex items-center gap-3">
                        <span>📅 {app.date}</span>
                        <span>⏰ {app.time}</span>
                        <span className="text-gold-deep font-bold">
                          {formatPrice(app.listingPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full md:w-auto gap-2">
                      <a
                        href={`https://wa.me/905323994291?text=${encodeURIComponent(
                          `Merhaba Özkan Bey, hesabım üzerinden ${app.id} nolu randevumu teyit etmek istiyorum:\n\n🏡 *İlan:* ${app.listingTitle}\n📅 *Tarih/Saat:* ${app.date} - ${app.time}\n📞 *İletişim:* ${userPhone}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none btn btn-gold text-xs py-2 px-4 gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        WhatsApp Teyit
                      </a>
                      <Link
                        href={`/ilan/${app.listingSlug}`}
                        className="flex-1 md:flex-none btn btn-outline text-xs py-2 px-4 text-center border-cream-line hover:border-gold hover:text-gold-deep"
                      >
                        İlan Detayı
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "favori" && (
          <div>
            {myFavListings.length === 0 ? (
              <div className="text-center py-16 bg-white border border-cream-line rounded-2xl shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mx-auto mb-4 border border-gold/15 text-2xl">
                  ❤️
                </div>
                <h3 className="text-base font-semibold text-ink mb-1">Favori İlanınız Yok</h3>
                <p className="text-xs text-fg-muted max-w-xs mx-auto mb-5">
                  Beğendiğiniz portföyleri buraya ekleyerek daha sonra kolayca takip edebilirsiniz.
                </p>
                <Link href="/satilik" className="btn btn-gold text-xs py-2 px-5">
                  İlanları İncele
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myFavListings.map((item) => (
                  <div
                    key={item.slug}
                    className="bg-white border border-cream-line rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/3] bg-cream-soft overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <button
                        onClick={() => toggleFavorite(item.slug)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md text-red-500 hover:bg-white transition-colors"
                        title="Favorilerden Kaldır"
                      >
                        ❤️
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-fg-muted mb-2">
                          <span className="font-semibold text-gold-deep uppercase tracking-wider">
                            {item.transaction === "satilik" ? "Satılık" : "Kiralık"}
                          </span>
                          <span>İlan No: {item.ref}</span>
                        </div>
                        <h3 className="font-semibold text-sm text-ink mb-2 line-clamp-2 min-h-[2.5rem]">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-fg-muted mb-4 pt-3 border-t border-cream-soft">
                          <span className="flex items-center gap-1">
                            <AreaIcon className="w-3.5 h-3.5" /> {formatArea(item.area)}
                          </span>
                          {item.rooms && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5" /> {item.rooms}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-cream-line">
                        <span className="text-sm font-bold text-gold-deep">
                          {formatPrice(item.price)}
                        </span>
                        <Link
                          href={`/ilan/${item.slug}`}
                          className="text-xs font-semibold text-ink hover:text-gold-deep inline-flex items-center gap-1 transition-colors"
                        >
                          Detaylar
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
