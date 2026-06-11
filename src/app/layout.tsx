import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
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

  return (
    <html
      lang={lang}
      dir={langDir(lang)}
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Tema tercihi ilk boyamadan önce uygulanır (parlama önleyici) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.add("light")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col pb-16 md:pb-0">
        <AppProvider>
          <TickerBanner />
          <Header lang={lang} />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomBar />
          <JsonLd data={[organizationSchema(), websiteSchema()]} />
        </AppProvider>
      </body>
    </html>
  );
}
