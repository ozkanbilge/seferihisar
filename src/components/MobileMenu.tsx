"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Close, Logo } from "@/components/icons";
import { site, nav } from "@/lib/site";

export function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-sm bg-ink/98 backdrop-blur-2xl flex flex-col animate-slide-left shadow-2xl border-l border-ink-line" id="mobile-menu">
      <div className="flex items-center justify-between px-5 h-16">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
          <Logo className="w-8 h-8 text-gold" />
          <span className="text-fg-invert font-bold text-xl laser-text">{site.shortName}</span>
        </Link>
        <button
          onClick={onClose}
          className="p-2 text-fg-invert-muted hover:text-gold transition-colors"
          aria-label="Menüyü kapat"
        >
          <Close className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="w-full text-center py-4 text-xl font-medium text-fg-invert-muted border-b border-ink-line transition-colors hover:text-gold-bright"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-8 pb-10 space-y-3">
        <a
          href={site.phoneHref}
          className="btn btn-gold w-full justify-center text-sm"
        >
          {site.phone}
        </a>
        <a
          href={`mailto:${site.email}`}
          className="btn btn-ghost w-full justify-center text-sm"
        >
          {site.email}
        </a>
      </div>
    </div>
  );
}
