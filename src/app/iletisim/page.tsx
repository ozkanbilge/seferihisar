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
        <p className="eyebrow mb-3">İletişim</p>
        <h1 className="display text-3xl md:text-4xl text-fg mb-3">
          Bize Ulaşın
        </h1>
        <p className="text-fg-muted text-sm max-w-2xl leading-relaxed">
          Gayrimenkul danışmanlığı, ücretsiz değerleme veya portföy bilgisi için
          ekibimizle iletişime geçin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-cream-line bg-surface p-6">
            <h2 className="text-base font-semibold text-fg mb-5">
              İletişim Bilgileri
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold-deep" />
                </div>
                <div>
                  <p className="text-xs text-fg-muted uppercase tracking-wider mb-1">
                    Telefon
                  </p>
                  <a
                    href={site.phoneHref}
                    className="text-sm font-medium text-fg hover:text-gold-bright transition-colors"
                  >
                    {site.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold-deep" />
                </div>
                <div>
                  <p className="text-xs text-fg-muted uppercase tracking-wider mb-1">
                    E-posta
                  </p>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm font-medium text-fg hover:text-gold-bright transition-colors"
                  >
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold-deep" />
                </div>
                <div>
                  <p className="text-xs text-fg-muted uppercase tracking-wider mb-1">
                    Adres
                  </p>
                  <p className="text-sm text-fg">
                    {site.address.street}
                    <br />
                    {site.address.locality}, {site.address.region}{" "}
                    {site.address.postalCode}
                  </p>
                </div>
              </li>
            </ul>
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
          <div className="rounded-2xl border border-cream-line bg-surface p-6 md:p-8">
            <h2 className="text-base font-semibold text-fg mb-2">
              Mesaj Gönderin
            </h2>
            <p className="text-sm text-fg-muted mb-6">
              Formu doldurun, en kısa sürede size dönüş yapacağız.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
