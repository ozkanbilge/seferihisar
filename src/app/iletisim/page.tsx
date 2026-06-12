import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Phone, Mail, MapPin } from "@/components/icons";
import { ContactForm } from "@/components/ContactForm";

export const metadata = buildMetadata({
  title: "İletişim",
  description:
    "Private Estate ile iletişime geçin. Satılık ve kiralık gayrimenkul danışmanlığı, ücretsiz değerleme ve portföy bilgisi için bize ulaşın.",
  path: "/iletisim",
});

export default function IletisimPage() {
  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb items={[{ label: "İletişim" }]} />

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
          <p className="eyebrow">İletişim</p>
          <span className="h-px w-14 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
        <h1 className="display text-3xl md:text-4xl text-fg mb-3">
          Bize Ulaşın
        </h1>
        <p className="text-fg-muted text-sm max-w-2xl leading-relaxed">
          Gayrimenkul danışmanlığı, ücretsiz değerleme veya portföy bilgisi için
          ekibimizle iletişime geçin.
        </p>
        <span className="block h-px w-24 mt-4 bg-gradient-to-r from-gold/50 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/50 via-gold/10 to-gold/40 shadow-[0_16px_44px_rgba(0,0,0,0.25)]">
            <span className="absolute top-2 left-2 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-10 pointer-events-none" aria-hidden />
            <span className="absolute top-2 right-2 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-gold/70 rounded-br z-10 pointer-events-none" aria-hidden />

            <div className="rounded-2xl bg-surface p-6">
              <h2 className="text-sm font-bold text-fg mb-5 font-[family-name:var(--font-cinzel)] uppercase tracking-[0.14em]">
                <span className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                  İletişim Bilgileri
                </span>
                <span className="block h-px mt-2.5 bg-gradient-to-r from-gold/40 to-transparent" />
              </h2>

              {/* Tıklanabilir eylem satırları */}
              <div className="space-y-2.5">
                <a
                  href={site.phoneHref}
                  className="group flex items-center gap-3.5 p-3 rounded-xl border border-gold/10 transition-all duration-300 hover:border-gold/40 hover:bg-gold/[0.04]"
                >
                  <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/45">
                    <Phone className="w-4 h-4 text-gold" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[0.6rem] text-gold/80 font-bold uppercase tracking-[0.16em]">Telefon</span>
                    <span className="block text-sm font-semibold text-fg">{site.phone}</span>
                  </span>
                  <span className="text-gold/40 group-hover:text-gold group-hover:translate-x-0.5 transition-all">›</span>
                </a>

                <a
                  href="https://wa.me/905323994291"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3.5 p-3 rounded-xl border border-gold/10 transition-all duration-300 hover:border-gold/40 hover:bg-gold/[0.04]"
                >
                  <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/45">
                    <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.88L2 22l5.3-1.29c1.4.78 3.01 1.22 4.7 1.22 5.52 0 10-4.48 10-10S17.524 2 12.004 2zm5.72 14.1c-.24.67-1.19 1.29-1.92 1.39-.49.07-1.12.11-3.23-.77-2.7-1.13-4.42-3.89-4.56-4.08-.13-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.32.24-.26.54-.32.71-.32h.51c.16 0 .38-.06.59.44.22.54.76 1.86.83 2 .07.14.12.31.02.51-.1.2-.21.32-.36.5-.15.18-.31.39-.45.52-.15.15-.31.31-.13.62.18.31.8 1.31 1.72 2.13.92.82 1.7 1.08 2.02 1.23.32.15.63.09.83-.05.21-.14 1.34-.63 1.57-.75.23-.12.38-.18.44-.29.06.11.06.64-.18 1.31z"/></svg>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[0.6rem] text-gold/80 font-bold uppercase tracking-[0.16em]">WhatsApp</span>
                    <span className="block text-sm font-semibold text-fg">Anında mesaj gönderin</span>
                  </span>
                  <span className="text-gold/40 group-hover:text-gold group-hover:translate-x-0.5 transition-all">›</span>
                </a>

                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center gap-3.5 p-3 rounded-xl border border-gold/10 transition-all duration-300 hover:border-gold/40 hover:bg-gold/[0.04]"
                >
                  <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/45">
                    <Mail className="w-4 h-4 text-gold" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[0.6rem] text-gold/80 font-bold uppercase tracking-[0.16em]">E-posta</span>
                    <span className="block text-sm font-semibold text-fg truncate">{site.email}</span>
                  </span>
                  <span className="text-gold/40 group-hover:text-gold group-hover:translate-x-0.5 transition-all">›</span>
                </a>

                <div className="group flex items-start gap-3.5 p-3 rounded-xl border border-gold/10">
                  <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gold" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[0.6rem] text-gold/80 font-bold uppercase tracking-[0.16em]">Adres</span>
                    <span className="block text-sm font-medium text-fg leading-snug">
                      {site.address.street}
                      <span className="block text-fg-muted text-xs mt-0.5">
                        {site.address.locality}, {site.address.region} {site.address.postalCode}
                      </span>
                    </span>
                  </span>
                </div>
              </div>

              {/* Flörür ayraç */}
              <div className="flex items-center gap-2.5 my-5">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
                <span className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
              </div>

              {/* Çalışma saatleri */}
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
                  </svg>
                </span>
                <div className="flex-1 text-xs">
                  <span className="block text-[0.6rem] text-gold/80 font-bold uppercase tracking-[0.16em] mb-1">Çalışma Saatleri</span>
                  <div className="flex justify-between text-fg-muted gap-3">
                    <span>Pzt – Cmt</span>
                    <span className="font-semibold text-fg">09:00 – 19:00</span>
                  </div>
                  <div className="flex justify-between text-fg-muted gap-3">
                    <span>Pazar</span>
                    <span className="font-semibold text-gold-deep">Randevu ile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Konum — lüks harita kartı */}
          <div className="group relative rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/50 via-gold/10 to-gold/40 shadow-[0_16px_44px_rgba(0,0,0,0.25)]">
            {/* Köşebent süslemeleri */}
            <span className="absolute top-2 left-2 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-20 pointer-events-none" aria-hidden />
            <span className="absolute top-2 right-2 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-20 pointer-events-none" aria-hidden />
            <span className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-20 pointer-events-none" aria-hidden />
            <span className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-gold/70 rounded-br z-20 pointer-events-none" aria-hidden />

            <div className="rounded-2xl overflow-hidden bg-surface">
              {/* Başlık şeridi */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gold/15">
                <span className="flex items-center gap-2 text-[0.7rem] font-bold text-fg font-[family-name:var(--font-cinzel)] uppercase tracking-[0.16em]">
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                  Konum
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.62rem] font-bold uppercase tracking-wider hover:shadow-[0_0_14px_rgba(192,160,98,0.45)] transition-shadow"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 11l19-8-8 19-2.5-8.5z" />
                  </svg>
                  Yol Tarifi
                </a>
              </div>

              {/* Harita: temaya uyumlu siyah-beyaz, hover'da renklenir */}
              <div className="relative h-64">
                <iframe
                  title="Private Estate Konumu"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${site.geo.lat},${site.geo.lng}&zoom=14`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[85%] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0"
                />
                {/* Adres rozeti */}
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-ink/80 backdrop-blur-md border border-gold/25 pointer-events-none">
                  <span className="w-6 h-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <span className="text-[0.62rem] font-semibold text-fg-invert leading-snug">
                    {site.address.street}
                    <span className="block text-fg-invert-muted font-normal">{site.address.locality}, {site.address.region}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="relative rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/50 via-gold/10 to-gold/40 shadow-[0_16px_44px_rgba(0,0,0,0.25)]">
            <span className="absolute top-2 left-2 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-10 pointer-events-none" aria-hidden />
            <span className="absolute top-2 right-2 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-gold/70 rounded-br z-10 pointer-events-none" aria-hidden />
            <div className="rounded-2xl bg-surface p-6 md:p-8">
              <h2 className="text-sm font-bold text-fg mb-2 font-[family-name:var(--font-cinzel)] uppercase tracking-[0.14em] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                Mesaj Gönderin
              </h2>
              <p className="text-sm text-fg-muted mb-1.5">
                Formu doldurun, en kısa sürede size dönüş yapacağız.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-px w-12 bg-gradient-to-r from-gold/50 to-transparent" />
                <span className="w-1 h-1 rotate-45 bg-gold/60" />
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
