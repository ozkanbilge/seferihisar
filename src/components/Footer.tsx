import Link from "next/link";
import { site, nav } from "@/lib/site";
import { NewsletterForm } from "@/components/NewsletterForm";
import { primaryDistrict } from "@/data/locations";
import {
  Logo,
  Phone,
  Mail,
  MapPin,
  WhatsApp,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "@/components/icons";

/** Elmas işaretli, altın alt çizgili sütun başlığı */
function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-gold font-semibold text-xs mb-5 tracking-[0.18em] uppercase font-[family-name:var(--font-cinzel)]">
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
        {children}
      </span>
      <span className="block h-px mt-2.5 bg-gradient-to-r from-gold/40 to-transparent" />
    </h3>
  );
}

/** Hover'da altın elmas belirip sağa kayan link */
function FooterLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "group inline-flex items-center gap-2 text-sm text-fg-invert-muted hover:text-gold-bright transition-all duration-300";
  const diamond = (
    <span className="w-1 h-1 rotate-45 bg-gold/0 group-hover:bg-gold transition-all duration-300 shrink-0" />
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {diamond}
        <span className="group-hover:translate-x-0.5 transition-transform duration-300">{children}</span>
        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {diamond}
      <span className="group-hover:translate-x-0.5 transition-transform duration-300">{children}</span>
    </Link>
  );
}

export function Footer() {
  const topNeighborhoods = primaryDistrict.neighborhoods.slice(0, 6);

  return (
    <footer className="relative bg-gradient-to-b from-ink to-[#08090c] text-fg-invert-muted overflow-hidden" id="site-footer">
      {/* Üst altın ayraç + sakin ambiyans */}
      <div className="divider-gold" />
      <div className="absolute -top-24 left-1/4 w-[520px] h-[360px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[380px] h-[280px] rounded-full bg-gold/[0.04] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />
      {/* Dev filigran arma */}
      <div className="absolute -right-24 -bottom-24 w-[420px] h-[420px] opacity-[0.035] pointer-events-none select-none" aria-hidden>
        <Logo className="w-full h-full text-gold" />
      </div>

      {/* CTA Band — davetiye çerçeveli kraliyet paneli */}
      <div className="relative border-b border-ink-line">
        <div className="container-x py-12 md:py-16">
          <div className="group relative overflow-hidden rounded-2xl border border-gold/25 bg-ink-soft/40 px-7 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_44px_rgba(0,0,0,0.4)]">
            {/* Köşe süslemeleri */}
            <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-gold/60 rounded-tl z-10" aria-hidden />
            <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-gold/60 rounded-tr z-10" aria-hidden />
            <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-gold/60 rounded-bl z-10" aria-hidden />
            <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-gold/60 rounded-br z-10" aria-hidden />
            {/* Dolaşan altın hale + ışık süpürmesi */}
            <span className="absolute -top-16 left-1/4 w-72 h-44 rounded-full bg-gold/[0.08] blur-3xl animate-ambient pointer-events-none" />
            <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/[0.05] to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

          {/* Dekoratif madalyon ikon */}
          <span className="relative hidden md:flex w-16 h-16 rounded-full bg-gold/10 border border-gold/25 items-center justify-center shrink-0 animate-glow">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M3 11 12 4l9 7M5 10v10h14V10" /><path d="M10 20v-5h4v5" />
            </svg>
          </span>

          <div className="relative flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60 md:hidden" />
              <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
              <p className="eyebrow">Hayalinizdeki Mülkü Bulun</p>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60 md:hidden" />
            </div>
            <h2 className="font-[family-name:var(--font-cinzel)] uppercase text-2xl md:text-3xl lg:text-4xl text-fg-invert tracking-[0.05em] leading-snug">
              Doğru Yatırım İçin
              <br />
              <span className="royal-text font-semibold">Uzman Desteği Alın</span>
            </h2>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={site.phoneHref} className="btn btn-gold group/btn px-6">
              <Phone className="w-4 h-4 animate-pulse" />
              {site.phone}
            </a>
            <Link href="/iletisim" className="btn btn-ghost group/btn px-6">
              İletişime Geçin
            </Link>
          </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-x py-14 md:py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <Logo className="w-12 h-12 text-gold transition-transform duration-500 group-hover:scale-105" />
              <span className="text-fg-invert font-semibold text-sm tracking-[0.08em] uppercase font-[family-name:var(--font-cinzel)]">
                {site.shortName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs text-fg-invert-muted/80">
              {site.description.slice(0, 140)}…
            </p>

            {/* Bülten aboneliği */}
            <div className="mb-6">
              <p className="flex items-center gap-2 text-[0.62rem] font-bold text-gold uppercase tracking-[0.16em] mb-2.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 8l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></svg>
                Yeni İlanlardan Haberdar Olun
              </p>
              <NewsletterForm />
            </div>

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
                  className="w-9 h-9 rounded-full border border-ink-line flex items-center justify-center text-fg-invert-muted hover:border-gold hover:text-gold hover:shadow-[0_0_14px_rgba(192,160,98,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <ColumnTitle>Hızlı Linkler</ColumnTitle>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <ColumnTitle>Popüler Bölgeler</ColumnTitle>
            <ul className="space-y-3">
              {topNeighborhoods.map((n) => (
                <li key={n.slug}>
                  <FooterLink href={`/izmir/${n.districtSlug}/${n.slug}`}>{n.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Real Estate & Deed Links */}
          <div>
            <ColumnTitle>Emlak &amp; Tapu</ColumnTitle>
            <ul className="space-y-3">
              {[
                { label: "Web Tapu İşlemleri", href: "https://webtapu.tkgm.gov.tr/" },
                { label: "TKGM Parsel Sorgulama", href: "https://parselsorgu.tkgm.gov.tr/" },
                { label: "E-Devlet Tapu Bilgileri", href: "https://www.turkiye.gov.tr/tapu-ve-kadastro-genel-mudurlugu" },
                { label: "Seferihisar İmar Sorgu", href: "https://www.seferihisar.bel.tr/" },
                { label: "E-Devlet İmar Durumu", href: "https://www.turkiye.gov.tr/cevre-ve-sehircilik-imar-durumu-sorgulama" },
              ].map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} external>
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <ColumnTitle>İletişim</ColumnTitle>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-gold" />
                </span>
                <a href={site.phoneHref} className="hover:text-gold-bright transition-colors font-semibold pt-1.5">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0">
                  <WhatsApp className="w-3.5 h-3.5 text-gold" />
                </span>
                <a
                  href="https://wa.me/905323994291"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-bright transition-colors pt-1.5"
                >
                  WhatsApp Destek Hattı
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                </span>
                <a href={`mailto:${site.email}`} className="hover:text-gold-bright transition-colors pt-1.5">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                </span>
                <span className="text-fg-invert-muted/80 pt-1">
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
      <div className="relative border-t border-ink-line">
        {/* Ortalanmış mini flörür */}
        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="w-2 h-2 rotate-45 bg-gold/80" />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
        <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fg-invert-muted/70">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-[family-name:var(--font-cinzel)] tracking-wider text-gold/80 uppercase">{site.name}</span>
            . Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/gizlilik" className="hover:text-gold-bright transition-colors">
              Gizlilik Politikası
            </Link>
            <span className="w-1 h-1 rotate-45 bg-gold/40" />
            <Link href="/kullanim-sartlari" className="hover:text-gold-bright transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
