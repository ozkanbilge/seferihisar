"use client";

import { useState } from "react";

/** Footer bülten aboneliği — yeni ilanlardan haberdar olma */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "invalid" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    // İstemci doğrulaması: gerçekten geçersizse net mesaj
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setState("invalid");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/bulten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-center gap-2.5 text-sm text-gold-bright">
        <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
        </span>
        Aboneliğiniz alındı, teşekkürler.
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      {/* İnce şerit: e-posta + buton yan yana, kompakt */}
      <div className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="E-posta adresiniz"
          className="flex-1 min-w-0 bg-ink/60 border border-ink-line rounded-full px-4 py-2.5 text-sm text-fg-invert placeholder-fg-invert-muted/40 focus:border-gold/50 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="shrink-0 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.62rem] font-bold uppercase tracking-[0.12em] hover:shadow-[0_0_14px_rgba(192,160,98,0.4)] transition-shadow whitespace-nowrap disabled:opacity-60"
        >
          {state === "sending" ? "..." : "Abone Ol"}
        </button>
      </div>
      {state === "invalid" && (
        <span className="block mt-1.5 text-[0.62rem] text-red-400">Lütfen geçerli bir e-posta adresi girin.</span>
      )}
      {state === "error" && (
        <span className="block mt-1.5 text-[0.62rem] text-red-400">Gönderilemedi, lütfen tekrar deneyin.</span>
      )}
    </form>
  );
}
