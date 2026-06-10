"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo, Phone, Menu, Close } from "@/components/icons";
import { site, nav } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-ink-line">
      <div className="container-x flex items-center justify-between h-16 md:h-[72px]">
        <Link href="/" className="flex items-center gap-3 group" id="header-logo">
          <Logo className="w-14 h-14 md:w-20 md:h-20 text-gold transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3" />
          <span className="text-fg-invert font-bold text-2xl md:text-3xl tracking-tight font-[family-name:var(--font-display)] laser-text">
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
              <span>{item.label}</span>
              <span className="absolute bottom-1.5 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-gold to-gold-bright transition-all duration-300 -translate-x-1/2 group-hover:w-3/4 shadow-[0_0_8px_#c0a062]" />
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="hidden lg:inline-flex btn btn-gold text-xs py-2.5 px-5 shadow-[0_0_15px_rgba(192,160,98,0.15)] hover:shadow-[0_0_25px_rgba(192,160,98,0.3)]"
            id="header-cta"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            Bizi Arayın
          </a>
          <MobileMenuToggle />
        </div>
      </div>
    </header>
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
