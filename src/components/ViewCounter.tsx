"use client";

import { useEffect, useState } from "react";

/**
 * Blog okunma sayacı. `count` true ise (yazı detayı) oturum başına bir kez
 * okunmayı artırır; aksi halde (liste kartı) yalnızca mevcut sayıyı gösterir.
 */
export function ViewCounter({ slug, count = false }: { slug: string; count?: boolean }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let method: "GET" | "POST" = "GET";
    if (count) {
      const key = `bv_${slug}`;
      if (!sessionStorage.getItem(key)) {
        method = "POST";
        sessionStorage.setItem(key, "1");
      }
    }
    fetch(`/api/blog-view?slug=${encodeURIComponent(slug)}`, { method })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setViews(d.views))
      .catch(() => {});
  }, [slug, count]);

  return <>{views != null ? `${views.toLocaleString("tr-TR")} kez okundu` : "…"}</>;
}
