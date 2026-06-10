"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsApp } from "@/components/icons";

export function MobileBottomBar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("home");
    } else if (pathname === "/satilik") {
      setActiveTab("satilik");
    } else if (pathname === "/kiralik") {
      setActiveTab("kiralik");
    } else {
      setActiveTab("");
    }
  }, [pathname]);

  const handleArsaScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("arsa-sorgulama");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveTab("arsa");
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-ink/85 backdrop-blur-xl border-t border-ink-line px-4 pb-safe-bottom">
      <div className="flex items-center justify-between h-16 max-w-lg mx-auto">
        {/* Ana Sayfa */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-colors ${
            activeTab === "home" ? "text-gold" : "text-fg-invert-muted"
          }`}
          onClick={() => setActiveTab("home")}
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[0.62rem] font-semibold tracking-wider uppercase">Ana Sayfa</span>
        </Link>

        {/* Satılık */}
        <Link
          href="/satilik"
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-colors ${
            activeTab === "satilik" ? "text-gold" : "text-fg-invert-muted"
          }`}
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-[0.62rem] font-semibold tracking-wider uppercase">Satılık</span>
        </Link>

        {/* Arsa Sorgula (Özel Hızlı Buton) */}
        <Link
          href="/#arsa-sorgulama"
          onClick={handleArsaScroll}
          className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-colors ${
            activeTab === "arsa" ? "text-gold" : "text-fg-invert-muted"
          }`}
        >
          <div className="absolute -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-gold-deep to-gold-bright flex items-center justify-center shadow-lg border-2 border-ink shadow-gold/20 active:scale-95 transition-transform">
            <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-[0.62rem] font-semibold tracking-wider uppercase mt-8">Arsa Sorgu</span>
        </Link>

        {/* Kiralık */}
        <Link
          href="/kiralik"
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-colors ${
            activeTab === "kiralik" ? "text-gold" : "text-fg-invert-muted"
          }`}
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2a2 2 0 012-2m7 11a3 3 0 11-6 0 3 3 0 016 0zm-6 2c0-2.206 1.794-4 4-4s4 1.794 4 4M9 14h.01M9 17h.01M9 20h.01M12 11h.01M12 14h.01M12 17h.01M12 20h.01" />
          </svg>
          <span className="text-[0.62rem] font-semibold tracking-wider uppercase">Kiralık</span>
        </Link>

        {/* WhatsApp */}
        <a
          href="https://wa.me/905323994291"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 h-full gap-1.5 text-[#25D366] hover:text-[#20ba56] transition-colors relative"
          onClick={() => setActiveTab("whatsapp")}
        >
          <WhatsApp className="w-6 h-6 animate-pulse" />
          <span className="text-[0.62rem] font-semibold tracking-wider uppercase">Destek</span>
          <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
        </a>
      </div>
    </div>
  );
}
