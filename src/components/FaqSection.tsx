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
      <h2 className="display text-2xl md:text-3xl text-fg mb-8">{title}</h2>
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
    <div className="border border-cream-line rounded-xl overflow-hidden transition-colors hover:border-gold/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-fg pr-4">{faq.q}</span>
        {open ? (
          <Close className="w-5 h-5 text-gold shrink-0" />
        ) : (
          <Plus className="w-5 h-5 text-fg-muted shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 animate-fade-up">
          <p className="text-sm text-fg-muted leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}
