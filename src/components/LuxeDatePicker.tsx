"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Site temasıyla uyumlu tarih/saat seçiciler. Native kontroller
 * stillenemediği için koyu cam + altın dilde özel paneller kullanılır.
 * Masaüstünde alana bağlı açılır; mobilde kırpma/taşma yaşamamak için
 * portal ile tam ekran alt-sayfa (bottom sheet) olarak açılır.
 */

const WEEKDAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isMobileViewport = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

/** Panel sarmalayıcı: masaüstünde alana bağlı, mobilde portal alt-sayfa */
function PickerPanel({
  open,
  mobile,
  onClose,
  title,
  anchorClass,
  children,
}: {
  open: boolean;
  mobile: boolean;
  onClose: () => void;
  title: string;
  anchorClass: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  const panelInner = (
    <>
      <div className="h-[2px] bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep" />
      {children}
    </>
  );

  if (mobile) {
    return createPortal(
      <div className="fixed inset-0 z-[120]">
        <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
        <div
          role="dialog"
          aria-label={title}
          className="absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] rounded-2xl border border-gold/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_24px_rgba(192,160,98,0.15)] overflow-hidden animate-fade-up"
          style={{ backgroundColor: "var(--color-ink-card)", animationDuration: "0.25s" }}
        >
          <div className="flex items-center justify-between pl-4 pr-2 pt-2.5">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gold">{title}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="p-2 text-fg-invert-muted hover:text-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">{panelInner}</div>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div
      role="dialog"
      aria-label={title}
      className={`absolute top-[calc(100%+8px)] z-50 rounded-2xl border border-gold/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_24px_rgba(192,160,98,0.1)] overflow-hidden animate-fade-up ${anchorClass}`}
      style={{ backgroundColor: "var(--color-ink-card)", animationDuration: "0.25s" }}
    >
      {panelInner}
    </div>
  );
}

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
  const [mobile, setMobile] = useState(false);
  const today = startOfDay(new Date());
  const selected = value ? startOfDay(new Date(value + "T00:00:00")) : null;
  const [viewDate, setViewDate] = useState<Date>(selected ?? today);
  const rootRef = useRef<HTMLDivElement>(null);

  const openPanel = () => {
    setMobile(isMobileViewport());
    setViewDate(selected ?? today);
    setOpen(true);
  };

  // Masaüstünde dışarı tıklama / her durumda ESC ile kapan
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!mobile && rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
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
  }, [open, mobile]);

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
        onClick={() => (open ? setOpen(false) : openPanel())}
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

      <PickerPanel
        open={open}
        mobile={mobile}
        onClose={() => setOpen(false)}
        title="Randevu Tarihi"
        anchorClass="left-0 right-0 min-w-[248px]"
      >
        {/* Ay gezintisi */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
          <button
            type="button"
            onClick={() => canGoPrev && setViewDate(new Date(year, month - 1, 1))}
            disabled={!canGoPrev}
            aria-label="Önceki ay"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gold/80 hover:text-gold hover:bg-gold/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span className="text-xs font-bold text-fg-invert capitalize tracking-wide">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            aria-label="Sonraki ay"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gold/80 hover:text-gold hover:bg-gold/10 transition-colors"
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
                className={`relative mx-auto w-9 h-9 md:w-8 md:h-8 rounded-full text-[0.72rem] font-semibold flex items-center justify-center transition-all duration-200 ${
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
      </PickerPanel>
    </div>
  );
}

/** Takvimle aynı dilde saat seçici: ızgara halinde saat çipleri */
export function LuxeTimePicker({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const openPanel = () => {
    setMobile(isMobileViewport());
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!mobile && rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
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
  }, [open, mobile]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 bg-cream-soft border border-cream-line rounded-xl px-3 py-2.5 text-xs text-left focus:border-gold focus:outline-none transition-colors cursor-pointer hover:border-gold/50"
      >
        <span className="text-fg font-medium">{value}</span>
        <svg
          className={`w-3.5 h-3.5 text-gold shrink-0 transition-transform duration-300 ${open ? "scale-110" : ""}`}
          fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      </button>

      <PickerPanel
        open={open}
        mobile={mobile}
        onClose={() => setOpen(false)}
        title="Randevu Saati"
        anchorClass="left-0 right-0 min-[420px]:left-auto min-[420px]:min-w-[210px]"
      >
        <div className="grid grid-cols-3 gap-1.5 p-3" role="listbox">
          {options.map((t) => {
            const isSel = t === value;
            return (
              <button
                key={t}
                type="button"
                role="option"
                aria-selected={isSel}
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className={`py-2.5 md:py-1.5 rounded-lg text-[0.72rem] font-semibold transition-all duration-200 ${
                  isSel
                    ? "bg-gradient-to-br from-gold-deep via-gold to-gold-bright text-ink shadow-[0_2px_10px_rgba(192,160,98,0.4)]"
                    : "text-fg-invert-muted hover:text-gold-bright hover:bg-gold/10 border border-gold/10"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </PickerPanel>
    </div>
  );
}
