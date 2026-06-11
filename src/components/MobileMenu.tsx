"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Close, Phone } from "@/components/icons";
import { site, nav } from "@/lib/site";
import { getClientLang, getDict, type Lang } from "@/lib/i18n";

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const [lang, setLang] = useState<Lang>("tr");

  useEffect(() => {
    setLang(getClientLang());
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const t = getDict(lang);

  return (
    <div className="fixed inset-0 z-[100]" id="mobile-menu">
      {/* Karartılmış arka plan — dokununca kapanır */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />

      {/* Kompakt menü kartı */}
      <div className="absolute top-3 right-3 left-3 max-w-xs ml-auto bg-ink-card border border-ink-line rounded-2xl shadow-2xl overflow-hidden animate-slide-left">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-line">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold">Menü</span>
          <button
            onClick={onClose}
            className="p-1.5 -m-1 text-fg-invert-muted hover:text-gold transition-colors"
            aria-label="Menüyü kapat"
          >
            <Close className="w-4 h-4" />
          </button>
        </div>

        <nav className="py-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-fg-invert-muted hover:text-gold-bright hover:bg-ink/40 transition-colors"
            >
              {t.nav[item.href] ?? item.label}
              <span className="text-gold/40 text-xs">›</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-line">
          <a href={site.phoneHref} className="btn btn-gold w-full justify-center text-xs py-2.5">
            <Phone className="w-3.5 h-3.5" />
            {site.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
