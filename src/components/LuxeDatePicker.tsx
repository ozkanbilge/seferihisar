"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Site temasıyla uyumlu takvim: native date picker stillenemediği için
 * koyu cam + altın dilde özel takvim paneli. Değer "yyyy-mm-dd" formatındadır.
 */

const WEEKDAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function LuxeDatePicker({
  value,
  onChange,
  label = "Tarih seçin",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const today = startOfDay(new Date());
  const selected = value ? startOfDay(new Date(value + "T00:00:00")) : null;
  const [viewDate, setViewDate] = useState<Date>(selected ?? today);
  const rootRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklama / ESC ile kapan
  useEffect(() => {
    if (!open) return;
    setViewDate(selected ?? today);
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  // Pazartesi başlangıçlı takvim ızgarası
  const firstOfMonth = new Date(year, month, 1);
  const lead = (firstOfMonth.getDay() + 6) % 7; // Pzt=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const canGoPrev = new Date(year, month, 0) >= new Date(today.getFullYear(), today.getMonth(), 1);

  const fmt = selected
    ? selected.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : label;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* Alan */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 bg-cream-soft border border-cream-line rounded-xl px-3 py-2.5 text-xs text-left focus:border-gold focus:outline-none transition-colors cursor-pointer hover:border-gold/50"
      >
        <span className={selected ? "text-fg font-medium" : "text-fg-muted/60"}>{fmt}</span>
        <svg
          className={`w-3.5 h-3.5 text-gold shrink-0 transition-transform duration-300 ${open ? "scale-110" : ""}`}
          fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      {/* Takvim paneli */}
      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute left-0 right-0 min-w-[248px] top-[calc(100%+8px)] z-50 rounded-2xl border border-gold/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_24px_rgba(192,160,98,0.1)] overflow-hidden animate-fade-up"
          style={{ backgroundColor: "var(--color-ink-card)", animationDuration: "0.25s" }}
        >
          <div className="h-[2px] bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep" />

          {/* Ay gezintisi */}
          <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
            <button
              type="button"
              onClick={() => canGoPrev && setViewDate(new Date(year, month - 1, 1))}
              disabled={!canGoPrev}
              aria-label="Önceki ay"
              className="w-7 h-7 rounded-full flex items-center justify-center text-gold/80 hover:text-gold hover:bg-gold/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="text-xs font-bold text-fg-invert capitalize tracking-wide">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              aria-label="Sonraki ay"
              className="w-7 h-7 rounded-full flex items-center justify-center text-gold/80 hover:text-gold hover:bg-gold/10 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>

          {/* Gün başlıkları */}
          <div className="grid grid-cols-7 px-2.5 pb-1">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-center text-[0.58rem] font-bold text-gold/60 uppercase tracking-wider py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Günler */}
          <div className="grid grid-cols-7 gap-y-0.5 px-2.5 pb-3">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const k = toKey(d);
              const isPast = d < today;
              const isSel = selected ? k === toKey(selected) : false;
              const isToday = k === toKey(today);
              return (
                <button
                  key={k}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onChange(k);
                    setOpen(false);
                  }}
                  className={`relative mx-auto w-8 h-8 rounded-full text-[0.7rem] font-semibold flex items-center justify-center transition-all duration-200 ${
                    isSel
                      ? "bg-gradient-to-br from-gold-deep via-gold to-gold-bright text-ink shadow-[0_2px_10px_rgba(192,160,98,0.4)]"
                      : isPast
                      ? "text-fg-invert-muted/25 cursor-not-allowed"
                      : "text-fg-invert-muted hover:text-gold-bright hover:bg-gold/10"
                  } ${isToday && !isSel ? "border border-gold/50 text-gold-bright" : ""}`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
