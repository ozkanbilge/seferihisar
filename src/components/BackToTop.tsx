"use client";

import { useEffect, useState } from "react";

/** Sayfa kaydırılınca beliren altın "yukarı çık" butonu */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Sayfa başına dön"
      className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-br from-gold-deep via-gold to-gold-bright text-ink flex items-center justify-center shadow-[0_6px_20px_rgba(192,160,98,0.4)] border border-ink/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_22px_rgba(192,160,98,0.6)] ${
        show ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
