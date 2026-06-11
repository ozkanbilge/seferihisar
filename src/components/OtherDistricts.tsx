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
    <div className="mt-12 pt-8 border-t border-cream-line">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider text-center sm:text-left">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-5 animate-fade-up">
          {districts.map((d) => (
            <Link
              key={d.slug}
              href={`/izmir/${d.slug}`}
              className="px-4 py-3 rounded-xl border border-cream-line bg-surface text-xs font-semibold text-fg-muted hover:border-gold hover:text-gold-bright hover:shadow-[0_0_18px_rgba(192,160,98,0.12)] transition-all duration-300 flex items-center justify-between group"
            >
              <span>{d.name}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-gold translate-x-[-4px] group-hover:translate-x-0">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
