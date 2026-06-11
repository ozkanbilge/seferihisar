"use client";

import { useState } from "react";
import { useApp, type Appointment } from "@/context/AppContext";
import { site } from "@/lib/site";
import { LuxeDatePicker } from "@/components/LuxeDatePicker";
import { Phone, Star } from "@/components/icons";

interface ListingSidebarProps {
  listingSlug: string;
  listingTitle: string;
  listingPrice: number;
  listingRef: string;
}

export function ListingSidebar({
  listingSlug,
  listingTitle,
  listingRef,
}: ListingSidebarProps) {
  const { userPhone, login, toggleFavorite, isFavorite, createAppointment } = useApp();
  
  // Appointment Form state
  const [phoneInput, setPhoneInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [lastAppointment, setLastAppointment] = useState<Appointment | null>(null);

  const fav = isFavorite(listingSlug);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userPhone && (!phoneInput || phoneInput.length < 10)) {
      setError("Lütfen geçerli bir telefon numarası girin.");
      return;
    }

    if (!dateInput) {
      setError("Lütfen bir randevu tarihi seçin.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Login if not already logged in
      if (!userPhone) {
        login(phoneInput);
      }

      const app = createAppointment(listingSlug, dateInput, timeInput);
      setLastAppointment(app);
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  const handleWhatsAppShare = () => {
    if (!lastAppointment) return;
    const phone = userPhone || phoneInput;
    const message = `Merhaba Özkan Bey, web siteniz üzerinden bir randevu oluşturmak istiyorum:\n\n🏡 *İlan:* ${listingTitle} (Ref: ${listingRef})\n📅 *Tarih:* ${dateInput}\n⏰ *Saat:* ${timeInput}\n📞 *Telefon:* ${phone}\n\nRandevuyu teyit etmenizi rica ederim.`;
    const whatsappUrl = `https://wa.me/905323994291?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6 sticky top-24">
      {/* Action Buttons */}
      {/* İlan Danışmanı */}
      <div className="card-luxe rounded-2xl p-5">
        <div className="flex items-center gap-4">
          {/* Varak monogram avatarı */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-deep via-gold to-gold-bright p-[2px]">
              <div className="w-full h-full rounded-full bg-ink flex items-center justify-center">
                <span className="font-[family-name:var(--font-cinzel-deco)] font-bold text-xl royal-text">
                  {site.agent.initials}
                </span>
              </div>
            </div>
            {/* Doğrulanmış rozeti */}
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold flex items-center justify-center border-2 border-surface">
              <svg className="w-3 h-3 text-ink" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-fg leading-tight">{site.agent.name}</h3>
            <p className="text-[0.65rem] text-gold-deep font-semibold mt-0.5">{site.agent.title}</p>
            <p className="text-[0.62rem] text-fg-muted mt-1 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              Üyelik: {site.agent.memberSince}&apos;dan beri · {new Date().getFullYear() - Number(site.agent.memberSince)} yıl
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-cream-line rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-fg mb-4">Bu İlanla İlgileniyor musunuz?</h3>
        
        <div className="flex flex-col gap-3">
          {/* Favorite Toggle Button */}
          <button
            onClick={() => toggleFavorite(listingSlug)}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              fav
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                : "bg-cream-soft text-fg-muted border-cream-line hover:border-gold hover:text-gold-bright"
            }`}
          >
            <span>{fav ? "❤️ Favorilerden Kaldır" : "🤍 Beğendiklerime Ekle"}</span>
          </button>

          {/* Quick Call */}
          <a href={site.phoneHref} className="btn btn-gold w-full justify-center text-xs uppercase font-bold tracking-wider py-3">
            <Phone className="w-3.5 h-3.5" />
            Hemen Arayın
          </a>
        </div>
      </div>

      {/* Appointment Booking Form */}
      <div className="bg-surface border border-cream-line rounded-2xl p-6 shadow-sm relative">
        <div className="absolute top-0 left-0 w-full h-[3px] rounded-t-2xl bg-gradient-to-r from-gold to-gold-deep" />
        
        {!success ? (
          <>
            <h3 className="text-base font-semibold text-fg mb-2">Hızlı Randevu Al</h3>
            <p className="text-xs text-fg-muted mb-5 leading-relaxed">
              Temsilcimiz Özkan Bilge ile bu mülkü yerinde gezmek için hızlıca randevu talebi oluşturun.
            </p>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              {/* Phone Input if not logged in */}
              {!userPhone && (
                <div>
                  <label className="block text-[0.65rem] font-semibold text-fg-muted uppercase tracking-wider mb-1">
                    Telefon Numaranız
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-fg-muted font-bold">
                      +90
                    </span>
                    <input
                      type="tel"
                      placeholder="5XX XXX XX XX"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-cream-soft border border-cream-line rounded-xl pl-12 pr-3 py-2.5 text-xs text-fg placeholder-fg-muted/40 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Date Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.65rem] font-semibold text-fg-muted uppercase tracking-wider mb-1">
                    Randevu Tarihi
                  </label>
                  <LuxeDatePicker
                    value={dateInput}
                    onChange={setDateInput}
                    label="Tarih seçin"
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] font-semibold text-fg-muted uppercase tracking-wider mb-1">
                    Saat
                  </label>
                  <select
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="w-full bg-cream-soft border border-cream-line rounded-xl px-3 py-2.5 text-xs text-fg focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-gold justify-center text-xs uppercase font-bold tracking-wider py-3"
              >
                {loading ? "Talep Gönderiliyor..." : "Randevu Talebi Oluştur"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4 animate-fade-up">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-semibold text-fg">Randevu Talebiniz Alındı</h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Talebiniz sisteme iletildi. Randevu detaylarınızı &quot;Hesabım&quot; panelinden takip edebilirsiniz.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="w-full btn btn-gold justify-center text-xs uppercase font-bold tracking-wider py-2.5"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp ile İlet
              </button>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs text-fg-muted hover:text-fg transition-colors font-medium underline decoration-dotted"
              >
                Yeni Randevu İste
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
