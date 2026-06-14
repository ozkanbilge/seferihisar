"use client";

import { useState } from "react";
import { Plus, Close } from "@/components/icons";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqSection({
  faqs,
  title = "Sık Sorulan Sorular",
}: {
  faqs: FaqItem[];
  title?: string;
}) {
  return (
    <section className="py-12 md:py-16" id="faq">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
          <p className="eyebrow">Merak Edilenler</p>
          <span className="h-px flex-1 max-w-[7rem] bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
        <h2 className="display text-2xl md:text-3xl">
          <span className="royal-text">{title}</span>
        </h2>
      </div>
      <div className="space-y-3.5 max-w-3xl">
        {faqs.map((faq, i) => (
          <FaqAccordion key={i} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
}

function FaqAccordion({ faq, index }: { faq: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
        open
          ? "card-luxe shadow-[0_14px_34px_rgba(0,0,0,0.16)]"
          : "border border-cream-line hover:border-gold/35"
      }`}
    >
      {/* Sol altın aksan rayı */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gold-bright to-gold-deep transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-baseline gap-3.5 min-w-0">
          <span
            className={`font-[family-name:var(--font-cinzel)] font-bold text-sm tabular-nums shrink-0 transition-colors ${
              open ? "text-gold" : "text-gold/50"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm md:text-[0.95rem] font-bold text-fg pr-2">
            {faq.q}
          </span>
        </span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            open
              ? "bg-gradient-to-br from-gold-deep via-gold to-gold-bright shadow-[0_4px_14px_rgba(192,160,98,0.4)]"
              : "border border-cream-line group-hover:border-gold/45"
          }`}
        >
          {open ? (
            <Close className="w-3.5 h-3.5 text-ink" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-gold-deep" />
          )}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pl-[3.1rem] animate-fade-up">
          <span className="block h-px w-full bg-gradient-to-r from-gold/20 to-transparent mb-3.5" aria-hidden />
          <p className="text-sm text-fg-muted leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}
