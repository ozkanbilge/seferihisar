/**
 * Site genel yapılandırması — tek kaynak.
 */
export const site = {
  name: "Seferihisar Emlak",
  shortName: "Seferihisar Emlak",
  tagline: "Ege'nin Sakin Kıyısında Doğru Gayrimenkul",
  // Üretimde gerçek alan adıyla değiştirin; canonical/sitemap bunu kullanır.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.seferihisaremlak.com",
  locale: "tr_TR",
  description:
    "İzmir Seferihisar ve çevresindeki satılık & kiralık villa, arsa, daire ve yazlık ilanları. Güncel fiyatlar, bölge rehberleri ve yatırım fırsatları tek platformda.",
  phone: "+90 532 399 42 91",
  phoneHref: "tel:+905323994291",
  email: "info@seferihisaremlak.com",
  address: {
    street: "Atatürk Mahallesi, Sahil Caddesi No:12",
    locality: "Seferihisar",
    region: "İzmir",
    postalCode: "35460",
    country: "TR",
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    linkedin: "https://linkedin.com/",
  },
  geo: { lat: 38.196, lng: 26.838 },
} as const;

export const nav = [
  { label: "Satılık", href: "/satilik" },
  { label: "Kiralık", href: "/kiralik" },
  { label: "Bölgeler", href: "/izmir/seferihisar" },
  { label: "Blog", href: "/blog" },
  { label: "Hesabım", href: "/hesabim" },
  { label: "İletişim", href: "/iletisim" },
] as const;
