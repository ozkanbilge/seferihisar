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

          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden border border-cream-line h-64">
            <iframe
              title="Private Estate Konumu"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${site.geo.lat},${site.geo.lng}&zoom=14`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
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
