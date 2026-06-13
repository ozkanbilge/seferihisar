"use client";

import { useState } from "react";
import Link from "next/link";

interface DistrictLink {
  slug: string;
  name: string;
}

/**
 * "İzmir'in Diğer Yatırım Bölgeleri" — varsayılan gizli;
 * "Tümünü Gör" ile açılır, tekrar tıklayınca gizlenir.
 */
export function OtherDistricts({
  districts,
  title,
  showAllLabel,
  hideLabel,
}: {
  districts: DistrictLink[];
  title: string;
  showAllLabel: string;
  hideLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-12 pt-8 border-t border-gold/15">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
        <p className="flex items-center justify-center sm:justify-start gap-2.5 text-xs font-bold text-fg uppercase tracking-[0.14em] font-[family-name:var(--font-cinzel)]">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
          {title}
        </p>
        <button
          onClick={() => setOpen((o) => !o)}
          className="btn btn-outline text-[0.65rem] px-4 py-2 self-center sm:self-auto gap-1.5"
          aria-expanded={open}
        >
          {open ? hideLabel : showAllLabel}
          <svg
            className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 animate-fade-up">
          {districts.map((d) => (
            <Link
              key={d.slug}
              href={`/izmir/${d.slug}`}
              className="group relative flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-gold/15 bg-surface text-xs font-semibold text-fg-muted hover:border-gold/45 hover:text-gold-bright hover:shadow-[0_6px_20px_rgba(192,160,98,0.14)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              {/* Hover'da köşeden süzülen altın ışıltı */}
              <span className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gold/[0.08] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <span className="relative flex items-center gap-2 min-w-0">
                <span className="w-1 h-1 rotate-45 bg-gold/30 group-hover:bg-gold transition-colors shrink-0" />
                <span className="truncate">{d.name}</span>
              </span>
              <span className="relative text-gold/0 group-hover:text-gold transition-all duration-300 -translate-x-1 group-hover:translate-x-0 shrink-0">
                ›
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
