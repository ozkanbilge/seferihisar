"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Phone, Menu } from "@/components/icons";
import { site, nav } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { getDict, setClientLang, LANGS, type Lang } from "@/lib/i18n";

export function Header({ lang = "tr" }: { lang?: Lang }) {
  const t = getDict(lang);

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-ink-line">
      <div className="container-x flex items-center justify-between h-16 md:h-[72px]">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group" id="header-logo">
          <Crown className="w-16 h-16 min-[380px]:w-[72px] min-[380px]:h-[72px] md:w-24 md:h-24 translate-y-1 md:translate-y-3 text-gold transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
          <span className="font-semibold text-base min-[380px]:text-lg md:text-3xl tracking-[0.06em] md:tracking-[0.08em] uppercase font-[family-name:var(--font-cinzel)] royal-text whitespace-nowrap">
            {site.shortName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2" id="main-nav">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-3.5 py-2 text-[0.82rem] font-medium text-fg-invert-muted transition-all duration-300 hover:text-gold-bright group"
            >
              <span>{t.nav[item.href] ?? item.label}</span>
              <span className="absolute bottom-1.5 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-gold to-gold-bright transition-all duration-300 -translate-x-1/2 group-hover:w-3/4 shadow-[0_0_8px_#c0a062]" />
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden md:flex items-center gap-2 md:gap-3">
            <LanguageSwitcher current={lang} />
            <ThemeToggle />
          </span>
          <a
            href={site.phoneHref}
            className="hidden lg:inline-flex btn btn-gold text-xs py-2.5 px-5 shadow-[0_0_15px_rgba(192,160,98,0.15)] hover:shadow-[0_0_25px_rgba(192,160,98,0.3)]"
            id="header-cta"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            {t.callUs}
          </a>
          <MobileMenuToggle />

        </div>
      </div>
    </header>
  );
}

function LanguageSwitcher({ current }: { current: Lang }) {
  const [open, setOpen] = useState(false);

  const choose = (lang: Lang) => {
    setClientLang(lang);
    // Sunucu bileşenleri yeni dille tazelensin
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-ink-line text-[0.7rem] font-bold tracking-wider text-fg-invert-muted hover:border-gold hover:text-gold-bright transition-colors uppercase"
        aria-label="Dil seçimi"
        id="lang-switcher"
      >
        {current.toUpperCase()}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-ink-card border border-ink-line rounded-xl overflow-hidden shadow-xl z-50 min-w-[80px]">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => choose(l.code)}
              className={`block w-full px-4 py-2.5 text-xs font-semibold text-left transition-colors ${
                l.code === current
                  ? "text-gold bg-gold/10"
                  : "text-fg-invert-muted hover:text-gold-bright hover:bg-ink/50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full border border-ink-line text-fg-invert-muted hover:border-gold hover:text-gold-bright transition-colors"
      aria-label={light ? "Karanlık moda geç" : "Aydınlık moda geç"}
      id="theme-toggle"
    >
      {light ? (
        /* Ay — karanlık moda dön */
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75 9.75 9.75 0 018.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25 9.75 9.75 0 0012.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        /* Güneş — aydınlık moda geç */
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      )}
    </button>
  );
}

function MobileMenuToggle() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-fg-invert-muted hover:text-gold transition-colors"
        aria-label="Menüyü aç"
        id="mobile-menu-toggle"
      >
        <Menu className="w-6 h-6" />
      </button>
      {open && <MobileMenu onClose={() => setOpen(false)} />}
    </>
  );
}
