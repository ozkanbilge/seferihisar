"use client";

import { useState } from "react";
import { useApp, type Appointment } from "@/context/AppContext";
import Link from "next/link";
import { site } from "@/lib/site";
import { LuxeDatePicker, LuxeTimePicker } from "@/components/LuxeDatePicker";
import { Phone, Star } from "@/components/icons";

interface ListingSidebarProps {
  listingSlug: string;
  listingTitle: string;
  listingPrice: number;
  listingRef: string;
  listingsCount?: number;
}

export function ListingSidebar({
  listingSlug,
  listingTitle,
  listingRef,
  listingsCount,
}: ListingSidebarProps) {
  const { userPhone, login, createAppointment } = useApp();
  
  // Appointment Form state
  const [phoneInput, setPhoneInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [lastAppointment, setLastAppointment] = useState<Appointment | null>(null);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const phone = userPhone || phoneInput.trim();
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setError("Lütfen geçerli bir telefon numarası girin.");
      return;
    }
    if (!dateInput) {
      setError("Lütfen randevu tarihi seçin.");
      return;
    }

    setLoading(true);
    try {
      // Sunucuya kaydet — admin paneli her cihazdan görür
      const res = await fetch("/api/randevu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPhone: phone,
          listingSlug,
          listingTitle,
          date: dateInput,
          time: timeInput,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Randevu oluşturulamadı.");

      // Hesabım sayfası için yerel kopya (giriş yoksa önce kaydet)
      if (!userPhone) login(phone);
      const localApp = createAppointment(listingSlug, dateInput, timeInput);
      setLastAppointment(
        localApp ?? {
          id: data.id,
          userPhone: phone,
          listingSlug,
          listingTitle,
          listingPrice: 0,
          date: dateInput,
          time: timeInput,
          status: "pending",
          createdAt: new Date().toISOString(),
        }
      );
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Randevu oluşturulamadı.");
    } finally {
      setLoading(false);
    }
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
        <div className="flex items-center gap-3 min-[380px]:gap-4">
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

        {/* Telefon + tüm ilanları */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 mt-4 pt-4 border-t border-cream-line/60">
          <a
            href={site.phoneHref}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.65rem] min-[420px]:text-[0.68rem] font-bold tracking-wide whitespace-nowrap hover:shadow-[0_4px_16px_rgba(192,160,98,0.4)] transition-shadow"
          >
            <Phone className="w-3.5 h-3.5" />
            {site.phone.replace("+90 ", "0")}
          </a>
          <Link
            href="/satilik"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-gold/30 text-[0.65rem] min-[420px]:text-[0.68rem] font-bold text-fg whitespace-nowrap hover:border-gold hover:text-gold-bright transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M3 11 12 4l9 7M5 10v10h14V10" />
            </svg>
            Tüm İlanları{typeof listingsCount === "number" ? ` (${listingsCount})` : ""}
          </Link>
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
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
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
                  <LuxeTimePicker
                    value={timeInput}
                    onChange={setTimeInput}
                    options={["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]}
                  />
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
