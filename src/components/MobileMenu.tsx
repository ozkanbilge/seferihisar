"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Close, Phone, WhatsApp, Logo } from "@/components/icons";
import { site, nav } from "@/lib/site";
import { getClientLang, getDict, setClientLang, LANGS, type Lang } from "@/lib/i18n";

/** Menü öğeleri için minimal çizgi ikonlar */
function NavIcon({ href, className = "w-[18px] h-[18px]" }: { href: string; className?: string }) {
  const paths: Record<string, string> = {
    "/satilik": "M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6",
    "/kiralik": "M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 11v9m-3-3h6",
    "/izmir/seferihisar": "M9 20l-5.5-2.7V5.6L9 8m0 12l6-3m-6 3V8m6 9l5.5 2.7V8.3L15 5m0 12V5M9 8l6-3",
    "/blog": "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zm3 5h8m-8 4h8m-8 4h5",
    "/hesabim": "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 21c0-3.5 3.5-6 8-6s8 2.5 8 6",
    "/iletisim": "M3 8l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={paths[href] ?? "M9 5l7 7-7 7"} />
    </svg>
  );
}

export function MobileMenu({
  onClose,
  phoneHref = site.phoneHref,
  whatsappHref = `https://wa.me/${site.phoneHref.replace(/\D/g, "")}`,
}: {
  onClose: () => void;
  phoneHref?: string;
  whatsappHref?: string;
}) {
  const [lang, setLang] = useState<Lang>("tr");
  const [mounted, setMounted] = useState(false);
  const [light, setLight] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setLang(getClientLang());
    setLight(document.documentElement.classList.contains("light"));
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const t = getDict(lang);

  const chooseLang = (code: Lang) => {
    setClientLang(code);
    window.location.reload();
  };

  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
  };

  // Header'daki backdrop-blur, fixed konumlandırmayı bozduğu için
  // menü portal ile doğrudan body altına render edilir
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]" id="mobile-menu">
      {/* Karartılmış arka plan — dokununca kapanır */}
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sağdan açılan çekmece */}
      <div className="absolute inset-y-0 right-0 w-[82%] max-w-[320px] bg-ink-card border-l border-ink-line shadow-2xl flex flex-col animate-slide-left">
        {/* Üst altın çizgi */}
        <div className="h-[3px] bg-gradient-to-r from-gold-deep via-gold-bright to-gold shrink-0" />

        {/* Başlık */}
        <div className="flex items-center justify-between pl-4 pr-3 py-3 border-b border-ink-line shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Logo className="w-9 h-9 text-gold" />
            <span className="text-fg-invert font-semibold text-sm tracking-[0.08em] uppercase font-[family-name:var(--font-cinzel)]">
              {site.shortName}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-fg-invert-muted hover:text-gold hover:bg-ink/50 transition-colors"
            aria-label="Menüyü kapat"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* Navigasyon */}
        <nav className="flex-1 overflow-y-auto py-2">
          {nav.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 mx-2 my-0.5 px-3.5 py-3 rounded-xl text-[0.95rem] font-medium transition-colors animate-fade-up ${
                  active
                    ? "text-gold bg-gold/10 border border-gold/20"
                    : "text-fg-invert-muted hover:text-gold-bright hover:bg-ink/40 border border-transparent"
                }`}
                style={{ animationDelay: `${0.05 + i * 0.05}s` }}
              >
                <span className={active ? "text-gold" : "text-gold/60"}>
                  <NavIcon href={item.href} />
                </span>
                {t.nav[item.href] ?? item.label}
                <span className="ml-auto text-gold/40 text-sm">›</span>
              </Link>
            );
          })}
        </nav>

        {/* Dil + Tema */}
        <div className="px-4 py-3 border-t border-ink-line flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => chooseLang(l.code)}
                className={`px-3 py-1.5 rounded-full text-[0.68rem] font-bold tracking-wider transition-colors border ${
                  l.code === lang
                    ? "text-gold border-gold/40 bg-gold/10"
                    : "text-fg-invert-muted border-ink-line hover:border-gold/40 hover:text-gold-bright"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-ink-line text-fg-invert-muted hover:border-gold hover:text-gold-bright transition-colors"
            aria-label={light ? "Karanlık moda geç" : "Aydınlık moda geç"}
          >
            {light ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75 9.75 9.75 0 018.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25 9.75 9.75 0 0012.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* İletişim CTA'ları */}
        <div className="p-4 pt-1 grid grid-cols-2 gap-2.5 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <a href={phoneHref} className="btn btn-gold justify-center text-xs py-3 gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            {t.callUs}
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn justify-center text-xs py-3 gap-1.5 bg-[#25D366]/15 text-[#4ade80] border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-colors"
          >
            <WhatsApp className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
