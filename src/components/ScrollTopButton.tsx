"use client";

import type { ReactNode } from "react";

/** Sayfayı yumuşak şekilde en üste kaydıran buton */
export function ScrollTopButton({
  className,
  children,
  ariaLabel = "Başa dön",
}: {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={className}
    >
      {children}
    </button>
  );
}
