"use client";

import { useState } from "react";

/** Footer bülten aboneliği — yeni ilanlardan haberdar olma */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/bulten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
    <form onSubmit={submit} className="w-full max-w-xs">
      {/* Dar ekranda alt alta, geniş ekranda gömülü buton */}
      <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-stretch gap-2 min-[400px]:gap-0 min-[400px]:relative">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="E-posta adresiniz"
          className="w-full bg-ink/60 border border-ink-line rounded-full pl-4 pr-4 min-[400px]:pr-28 py-2.5 text-xs text-fg-invert placeholder-fg-invert-muted/40 focus:border-gold/50 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="shrink-0 px-5 py-2.5 min-[400px]:py-0 min-[400px]:absolute min-[400px]:right-1 min-[400px]:top-1 min-[400px]:bottom-1 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.62rem] font-bold uppercase tracking-wider hover:shadow-[0_0_14px_rgba(192,160,98,0.4)] transition-shadow whitespace-nowrap"
        >
          {state === "sending" ? "Gönderiliyor..." : "Abone Ol"}
        </button>
      </div>
      {state === "error" && (
        <span className="block mt-1.5 text-[0.62rem] text-red-400">Geçerli bir e-posta girin.</span>
      )}
    </form>
  );
}
