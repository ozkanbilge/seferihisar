/** TR yerel biçimlendirme yardımcıları */

export function formatPrice(value: number, currency = "₺"): string {
  return `${new Intl.NumberFormat("tr-TR").format(value)} ${currency}`;
}

export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m % 1 === 0 ? m : m.toFixed(1)}M ₺`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}B ₺`;
  }
  return `${value} ₺`;
}

export function formatArea(m2: number): string {
  return `${new Intl.NumberFormat("tr-TR").format(m2)} m²`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u",
  };
  return input
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
