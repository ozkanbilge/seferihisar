export interface PropertyType {
  slug: string;
  name: string; // tekil
  plural: string; // çoğul / liste başlığı
  blurb: string;
  icon: PropertyIcon;
}

export type PropertyIcon =
  | "villa"
  | "daire"
  | "arsa"
  | "tarla"
  | "yazlik"
  | "mustakil"
  | "ticari";

export const propertyTypes: PropertyType[] = [
  {
    slug: "villa",
    name: "Villa",
    plural: "Villa",
    blurb: "Müstakil bahçeli, denize yakın lüks yaşam alanları.",
    icon: "villa",
  },
  {
    slug: "daire",
    name: "Daire",
    plural: "Daire",
    blurb: "Site içi ve merkezi konumda modern daireler.",
    icon: "daire",
  },
  {
    slug: "arsa",
    name: "Arsa",
    plural: "Arsa",
    blurb: "İmarlı ve yatırımlık arsalar, deniz manzaralı parseller.",
    icon: "arsa",
  },
  {
    slug: "tarla",
    name: "Tarla",
    plural: "Tarla",
    blurb: "Zeytinlik ve tarım arazileri, geniş hektarlı tarlalar.",
    icon: "tarla",
  },
  {
    slug: "yazlik",
    name: "Yazlık",
    plural: "Yazlık",
    blurb: "Sezonluk ve daimi kullanıma uygun yazlık evler.",
    icon: "yazlik",
  },
  {
    slug: "mustakil-ev",
    name: "Müstakil Ev",
    plural: "Müstakil Ev",
    blurb: "Bahçeli, taş ya da betonarme müstakil evler.",
    icon: "mustakil",
  },
  {
    slug: "ticari",
    name: "Ticari Gayrimenkul",
    plural: "Ticari Gayrimenkul",
    blurb: "Dükkân, ofis ve turizm işletmesine uygun mülkler.",
    icon: "ticari",
  },
];

export const propertyTypeBySlug = (slug: string) =>
  propertyTypes.find((t) => t.slug === slug);

export interface Transaction {
  slug: "satilik" | "kiralik";
  name: string; // Satılık / Kiralık
  noun: string; // satışta / kirada
}

export const transactions: Transaction[] = [
  { slug: "satilik", name: "Satılık", noun: "satışta" },
  { slug: "kiralik", name: "Kiralık", noun: "kirada" },
];

export const transactionBySlug = (slug: string) =>
  transactions.find((t) => t.slug === slug);

/**
 * "satilik-villa" gibi birleşik slug'ı işlem + tür olarak ayrıştırır.
 * Geçersizse null döner.
 */
export function parseTypeCombo(
  combo: string
): { transaction: Transaction; type: PropertyType } | null {
  const dash = combo.indexOf("-");
  if (dash === -1) return null;
  const txSlug = combo.slice(0, dash);
  const typeSlug = combo.slice(dash + 1);
  const transaction = transactionBySlug(txSlug);
  const type = propertyTypeBySlug(typeSlug);
  if (!transaction || !type) return null;
  return { transaction, type };
}

export const comboSlug = (tx: string, type: string) => `${tx}-${type}`;
