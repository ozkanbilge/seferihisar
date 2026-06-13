"use client";

import { useEffect, useState } from "react";

/** Sayfanın üstünde kaydırmayla dolan altın okuma ilerleme çubuğu */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(Math.max(el.scrollTop / max, 0), 1) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-gold-deep via-gold-bright to-gold shadow-[0_0_10px_rgba(192,160,98,0.55)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
