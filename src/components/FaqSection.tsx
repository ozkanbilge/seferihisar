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
      <div className="flex items-center gap-3 mb-8">
        <h2 className="display text-2xl md:text-3xl text-fg flex items-center gap-3 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
          {title}
        </h2>
        <span className="h-px flex-1 max-w-md bg-gradient-to-r from-gold/40 to-transparent" />
      </div>
      <div className="space-y-3 max-w-3xl">
        {faqs.map((faq, i) => (
          <FaqAccordion key={i} faq={faq} />
        ))}
      </div>
    </section>
  );
}

function FaqAccordion({ faq }: { faq: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-300 ${open ? "border-gold/40 bg-gold/[0.03] shadow-[0_8px_24px_rgba(0,0,0,0.12)]" : "border-cream-line hover:border-gold/30"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="group w-full flex items-center justify-between gap-3 p-5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className={`w-1.5 h-1.5 rotate-45 shrink-0 transition-colors ${open ? "bg-gold" : "bg-gold/30 group-hover:bg-gold/60"}`} />
          <span className="text-sm font-semibold text-fg pr-2">{faq.q}</span>
        </span>
        <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${open ? "bg-gold/15 border-gold/40 rotate-180" : "border-cream-line group-hover:border-gold/40"}`}>
          {open ? (
            <Close className="w-3.5 h-3.5 text-gold" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-gold-deep" />
          )}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 pl-[2.6rem] animate-fade-up">
          <p className="text-sm text-fg-muted leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}
