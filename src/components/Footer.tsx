import Link from "next/link";
import { site, nav } from "@/lib/site";
import { NewsletterForm } from "@/components/NewsletterForm";
import { primaryDistrict } from "@/data/locations";
import {
  Crown,
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
        <Crown className="w-full h-full text-gold" />
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

      {/* Güven Şeridi — kraliyet güven sinyalleri */}
      <div className="relative border-b border-ink-line">
        <div className="container-x py-7 md:py-8">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
            {[
              {
                title: "15+ Yıl",
                sub: "Bölge Deneyimi",
                icon: <><path d="M12 2l2.4 6.9H22l-6 4.4 2.3 7-6.3-4.4L5.7 20l2.3-7-6-4.4h7.6z" /></>,
              },
              {
                title: "Tapu & İmar",
                sub: "Kontrollü Portföy",
                icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
              },
              {
                title: "Cittaslow",
                sub: "Seferihisar Uzmanı",
                icon: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></>,
              },
              {
                title: "Ücretsiz",
                sub: "Ön Danışmanlık",
                icon: <><path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 9.4 9.4 0 0 1-4-1L3 20l1.1-3.3A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 21 11.5z" /></>,
              },
            ].map((it, i) => (
              <li
                key={it.title}
                className={`group flex items-center gap-3.5 justify-center lg:justify-start lg:px-5 ${i > 0 ? "lg:border-l lg:border-ink-line" : ""}`}
              >
                <span className="relative shrink-0 w-11 h-11 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center transition-all duration-300 group-hover:border-gold/45 group-hover:bg-gold/15">
                  <svg className="w-[19px] h-[19px] text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{it.icon}</svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-fg-invert leading-tight">{it.title}</p>
                  <p className="text-[0.7rem] text-fg-invert-muted/70 tracking-wide">{it.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-x py-14 md:py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1.5 mb-4 group">
              <Crown className="w-16 h-16 -ml-2 text-gold transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-6" />
              <span className="inline-flex flex-col">
                <span className="text-fg-invert font-semibold text-sm tracking-[0.08em] uppercase font-[family-name:var(--font-cinzel)] royal-text whitespace-nowrap">
                  {site.shortName}
                </span>
                <span className="mt-1.5 h-px w-full bg-gradient-to-r from-gold/60 to-transparent" />
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
        {/* Başa dön — ortalanmış kraliyet madalyonu */}
        <a
          href="#hero"
          aria-label="Başa dön"
          className="group absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-ink border border-gold/40 flex items-center justify-center text-gold shadow-[0_4px_14px_rgba(0,0,0,0.45)] hover:bg-gold hover:text-ink hover:border-gold hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(192,160,98,0.4)] transition-all duration-300"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </a>
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
