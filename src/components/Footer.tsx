import Link from "next/link";
import { site, nav } from "@/lib/site";
import { primaryDistrict } from "@/data/locations";
import {
  Logo,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "@/components/icons";

export function Footer() {
  const topNeighborhoods = primaryDistrict.neighborhoods.slice(0, 6);

  return (
    <footer className="bg-ink text-fg-invert-muted" id="site-footer">
      {/* CTA Band */}
      <div className="border-b border-ink-line">
        <div className="container-x py-14 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="eyebrow mb-3">Hayalinizdeki Mülkü Bulun</p>
            <h2 className="display text-3xl md:text-4xl text-fg-invert">
              Doğru Yatırım İçin<br />
              <span className="text-gold">Uzman Desteği</span> Alın
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={site.phoneHref} className="btn btn-gold">
              <Phone className="w-4 h-4" />
              {site.phone}
            </a>
            <Link href="/iletisim" className="btn btn-ghost">
              İletişime Geçin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-x py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <Logo className="w-9 h-9 text-gold" />
              <span className="text-fg-invert font-semibold text-base tracking-tight font-[family-name:var(--font-display)]">
                {site.shortName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-fg-invert-muted/80">
              {site.description.slice(0, 140)}…
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: site.social.instagram, label: "Instagram" },
                { Icon: Facebook, href: site.social.facebook, label: "Facebook" },
                { Icon: Youtube, href: site.social.youtube, label: "YouTube" },
                { Icon: Linkedin, href: site.social.linkedin, label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-ink-line flex items-center justify-center text-fg-invert-muted hover:border-gold hover:text-gold transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-fg-invert font-semibold text-sm mb-5 tracking-wide uppercase font-[family-name:var(--font-display)] text-gold">
              Hızlı Linkler
            </h3>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-gold-bright transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="text-fg-invert font-semibold text-sm mb-5 tracking-wide uppercase font-[family-name:var(--font-display)] text-gold">
              Popüler Bölgeler
            </h3>
            <ul className="space-y-3">
              {topNeighborhoods.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/izmir/${n.districtSlug}/${n.slug}`}
                    className="text-sm hover:text-gold-bright transition-colors"
                  >
                    {n.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Real Estate & Deed Links */}
          <div>
            <h3 className="text-fg-invert font-semibold text-sm mb-5 tracking-wide uppercase font-[family-name:var(--font-display)] text-gold">
              Emlak & Tapu
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Web Tapu İşlemleri", href: "https://webtapu.tkgm.gov.tr/" },
                { label: "TKGM Parsel Sorgulama", href: "https://parselsorgu.tkgm.gov.tr/" },
                { label: "E-Devlet Tapu Bilgileri", href: "https://www.turkiye.gov.tr/tapu-ve-kadastro-genel-mudurlugu" },
                { label: "Seferihisar İmar Sorgu", href: "https://www.seferihisar.bel.tr/" },
                { label: "E-Devlet İmar Durumu", href: "https://www.turkiye.gov.tr/cevre-ve-sehircilik-imar-durumu-sorgulama" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-gold-bright transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-fg-invert font-semibold text-sm mb-5 tracking-wide uppercase font-[family-name:var(--font-display)] text-gold">
              İletişim
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <a href={site.phoneHref} className="hover:text-gold-bright transition-colors font-semibold">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-gold-bright transition-colors"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-fg-invert-muted/80">
                  {site.address.street}
                  <br />
                  {site.address.locality}, {site.address.region}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ink-line">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fg-invert-muted/70">
          <p>© {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <Link href="/gizlilik" className="hover:text-gold-bright transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="hover:text-gold-bright transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
