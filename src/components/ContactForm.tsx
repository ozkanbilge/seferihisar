"use client";

import { useState } from "react";
import { ArrowRight, Check } from "@/components/icons";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-emerald-accent/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-emerald-accent" />
        </div>
        <h3 className="text-lg font-semibold text-ink mb-2">
          Mesajınız Alındı!
        </h3>
        <p className="text-sm text-fg-muted">
          En kısa sürede size dönüş yapacağız. Teşekkür ederiz.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-5"
      id="contact-form"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-medium text-fg-muted uppercase tracking-wider mb-2"
          >
            Ad Soyad
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="Adınız Soyadınız"
            className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-ink placeholder:text-fg-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="contact-phone"
            className="block text-xs font-medium text-fg-muted uppercase tracking-wider mb-2"
          >
            Telefon
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            placeholder="05XX XXX XX XX"
            className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-ink placeholder:text-fg-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-xs font-medium text-fg-muted uppercase tracking-wider mb-2"
        >
          E-posta
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="email@adresiniz.com"
          className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-ink placeholder:text-fg-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-xs font-medium text-fg-muted uppercase tracking-wider mb-2"
        >
          Konu
        </label>
        <select
          id="contact-subject"
          className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors bg-white"
        >
          <option>Satılık Gayrimenkul Bilgisi</option>
          <option>Kiralık Gayrimenkul Bilgisi</option>
          <option>Ücretsiz Değerleme</option>
          <option>İlan Vermek İstiyorum</option>
          <option>Diğer</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-medium text-fg-muted uppercase tracking-wider mb-2"
        >
          Mesajınız
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          placeholder="Mesajınızı buraya yazın..."
          className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-ink placeholder:text-fg-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors resize-none"
        />
      </div>

      <button type="submit" className="btn btn-gold w-full sm:w-auto justify-center">
        Mesaj Gönderin
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
