import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, Cormorant_Garamond, Inter } from "next/font/google";
import { cookies } from "next/headers";
import { isLang, langDir, LANG_COOKIE, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { AppProvider } from "@/context/AppContext";
import { TickerBanner } from "@/components/TickerBanner";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Marka yazısı (Private Estate) için kraliyet/lüks serif
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
});

// Logo monogramı (PE) için süslü kraliyet serifi
const cinzelDeco = Cinzel_Decorative({
  variable: "--font-cinzel-deco",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  const lang: Lang = isLang(cookieLang) ? cookieLang : "tr";
  const settings = await getSiteSettings();

  return (
    <html
      lang={lang}
      dir={langDir(lang)}
      className={`${cormorant.variable} ${inter.variable} ${cinzel.variable} ${cinzelDeco.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Tema ilk boyamadan önce uygulanır (parlama önleyici):
            kayıtlı tercih varsa o, yoksa cihazın sistem tercihi */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `try{var t=localStorage.getItem("theme");if(t==="light"||(!t&&window.matchMedia("(prefers-color-scheme: light)").matches))document.documentElement.classList.add("light")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col pb-16 md:pb-0" suppressHydrationWarning>
        <AppProvider>
          <TickerBanner />
          <Header lang={lang} phoneHref={settings.phoneHref} whatsappHref={settings.whatsappHref} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang} />
          <MobileBottomBar whatsappHref={settings.whatsappHref} />
          <JsonLd data={[organizationSchema(), websiteSchema()]} />
        </AppProvider>
      </body>
    </html>
  );
}
