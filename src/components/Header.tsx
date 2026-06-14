"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Phone, Menu } from "@/components/icons";
import { site, nav } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { getDict, setClientLang, LANGS, type Lang } from "@/lib/i18n";

export function Header({
  lang = "tr",
  phoneHref = site.phoneHref,
  whatsappHref = `https://wa.me/${site.phoneHref.replace(/\D/g, "")}`,
}: {
  lang?: Lang;
  phoneHref?: string;
  whatsappHref?: string;
}) {
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
            href={phoneHref}
            className="hidden lg:inline-flex btn btn-gold text-xs py-2.5 px-5 shadow-[0_0_15px_rgba(192,160,98,0.15)] hover:shadow-[0_0_25px_rgba(192,160,98,0.3)]"
            id="header-cta"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            {t.callUs}
          </a>
          <MobileMenuToggle phoneHref={phoneHref} whatsappHref={whatsappHref} />

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

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !light;
    const apply = () => {
      setLight(next);
      document.documentElement.classList.toggle("light", next);
      try {
        localStorage.setItem("theme", next ? "light" : "dark");
      } catch {}
    };

    type VTDocument = Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const doc = document as VTDocument;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // View Transitions destekliyse: tıklanan noktadan dairesel açılma
    if (!doc.startViewTransition || reduce) {
      apply();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={toggle}
      className="group relative inline-flex items-center w-[3.6rem] h-[1.7rem] rounded-full overflow-hidden border transition-colors duration-500 active:scale-95"
      style={{
        borderColor: "rgba(192,160,98,0.35)",
        background: light
          ? "linear-gradient(135deg, #bfe0f5 0%, #e8d9a8 100%)"
          : "linear-gradient(135deg, #0b1020 0%, #1a1530 100%)",
      }}
      aria-label={light ? "Karanlık moda geç" : "Aydınlık moda geç"}
      aria-pressed={light}
      id="theme-toggle"
      title={light ? "Karanlık moda geç" : "Aydınlık moda geç"}
    >
      {/* Gece yıldızları */}
      <span className={`absolute inset-0 transition-opacity duration-500 ${light ? "opacity-0" : "opacity-100"}`} aria-hidden>
        <span className="theme-star absolute top-1.5 left-2 w-[3px] h-[3px] rounded-full bg-gold-bright" style={{ animationDelay: "0s" }} />
        <span className="theme-star absolute top-3 left-4 w-[2px] h-[2px] rounded-full bg-gold-bright/80" style={{ animationDelay: "0.6s" }} />
        <span className="theme-star absolute bottom-1.5 left-3 w-[2px] h-[2px] rounded-full bg-gold-bright/70" style={{ animationDelay: "1.2s" }} />
        <span className="theme-star absolute top-2 left-6 w-[2.5px] h-[2.5px] rounded-full bg-gold-bright/90" style={{ animationDelay: "0.3s" }} />
      </span>

      {/* Gündüz bulutları */}
      <span className={`absolute inset-0 transition-opacity duration-500 ${light ? "opacity-100" : "opacity-0"}`} aria-hidden>
        <span className="absolute bottom-1.5 right-6 w-3 h-1.5 rounded-full bg-white/70" />
        <span className="absolute bottom-2.5 right-5 w-2 h-1 rounded-full bg-white/60" />
        <span className="absolute top-2 right-8 w-2.5 h-1 rounded-full bg-white/50" />
      </span>

      {/* Kayan gök cismi topuzu */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-[1.35rem] h-[1.35rem] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          light ? "left-[0.2rem]" : "left-[1.85rem]"
        }`}
        style={{
          background: light
            ? "radial-gradient(circle at 35% 35%, #fff4cf, #f0c64e 55%, #d8a72e)"
            : "radial-gradient(circle at 35% 35%, #fdfaf0, #e9e3d0 60%, #c9c2ac)",
          boxShadow: light
            ? "0 0 10px rgba(240,198,78,0.7), 0 1px 4px rgba(0,0,0,0.25)"
            : "0 0 8px rgba(233,227,208,0.45), 0 1px 4px rgba(0,0,0,0.4)",
        }}
      >
        {light ? (
          /* Güneş ışınları — yavaş döner */
          <svg className="theme-sun-rays absolute inset-0 w-full h-full text-[#d8a72e]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19" />
          </svg>
        ) : (
          /* Ay kraterleri */
          <span aria-hidden>
            <span className="absolute top-[5px] left-[6px] w-[3px] h-[3px] rounded-full bg-black/10" />
            <span className="absolute top-[10px] left-[11px] w-[2px] h-[2px] rounded-full bg-black/10" />
            <span className="absolute top-[12px] left-[5px] w-[2.5px] h-[2.5px] rounded-full bg-black/[0.08]" />
          </span>
        )}
      </span>
    </button>
  );
}

function MobileMenuToggle({
  phoneHref,
  whatsappHref,
}: {
  phoneHref: string;
  whatsappHref: string;
}) {
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
      {open && <MobileMenu onClose={() => setOpen(false)} phoneHref={phoneHref} whatsappHref={whatsappHref} />}
    </>
  );
}
