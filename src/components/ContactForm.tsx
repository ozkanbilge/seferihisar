"use client";

import { useState } from "react";
import { ArrowRight, Check } from "@/components/icons";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          subject: fd.get("subject"),
          message: fd.get("message"),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Mesaj gönderilemedi.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-emerald-accent/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-emerald-accent" />
        </div>
        <h3 className="text-lg font-semibold text-fg mb-2">
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
      onSubmit={handleSubmit}
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
            name="name"
            type="text"
            required
            placeholder="Adınız Soyadınız"
            className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-fg placeholder:text-fg-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors"
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
            name="phone"
            type="tel"
            required
            placeholder="05XX XXX XX XX"
            className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-fg placeholder:text-fg-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors"
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
            name="email"
          type="email"
          placeholder="email@adresiniz.com"
          className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-fg placeholder:text-fg-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors"
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
            name="subject"
          className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-fg focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors bg-surface"
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
            name="message"
          rows={5}
          required
          placeholder="Mesajınızı buraya yazın..."
          className="w-full rounded-xl border border-cream-line px-4 py-3 text-sm text-fg placeholder:text-fg-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-colors resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

      <button type="submit" disabled={sending} className="btn btn-gold w-full sm:w-auto justify-center disabled:opacity-60">
        {sending ? "Gönderiliyor..." : "Mesaj Gönderin"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
