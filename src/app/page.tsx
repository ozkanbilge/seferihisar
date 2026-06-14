import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { getFeaturedListings } from "@/lib/listings-store";
import { primaryDistrict, districts } from "@/data/locations";
import { blogPosts } from "@/data/blog";
import { propertyTypes } from "@/data/property-types";
import { ListingCard } from "@/components/ListingCard";
import { formatDate } from "@/lib/format";
import { NeighborhoodCard } from "@/components/NeighborhoodCard";
import { StatsBar } from "@/components/StatsBar";
import { TypeIcon, ArrowRight, ArrowUpRight, Phone } from "@/components/icons";
import { site } from "@/lib/site";
import { ArsaSorgula } from "@/components/ArsaSorgula";
import { HeroSearch } from "@/components/HeroSearch";
import { MiniBanner } from "@/components/MiniBanner";
import { OtherDistricts } from "@/components/OtherDistricts";
import { getHomepage } from "@/lib/cms";
import { getDict, isLang, LANG_COOKIE, type Lang } from "@/lib/i18n";

// İçerik admin panelden anlık güncellenebildiği için her istekte taze okunur
export const dynamic = "force-dynamic";

/** "Neden Biz" kartları için sıraya göre altın ikon */
function WhyIcon({ index }: { index: number }) {
  const cls = "w-5 h-5 text-gold";
  const props = { fill: "none" as const, stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };
  const icons = [
    <svg key="0" className={cls} {...props}><path d="M9 20l-5.5-2.7V5.6L9 8m0 12l6-3m-6 3V8m6 9l5.5 2.7V8.3L15 5m0 12V5M9 8l6-3" /></svg>, // yerel uzmanlık — harita
    <svg key="1" className={cls} {...props}><path d="M9 12l2 2 4-4M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z" /></svg>, // doğrulanmış — kalkan tik
    <svg key="2" className={cls} {...props}><path d="M8 10h8M8 14h5M21 11.5a8.38 8.38 0 0 1-9 8.4 9.4 9.4 0 0 1-4-1L3 20l1.1-3.3A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 21 11.5z" /></svg>, // danışmanlık — sohbet
    <svg key="3" className={cls} {...props}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, // şeffaf fiyat — para
  ];
  return icons[index % icons.length];
}

export default async function Home() {
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  const lang: Lang = isLang(cookieLang) ? cookieLang : "tr";
  const c = await getHomepage(lang);
  const featuredListings = await getFeaturedListings();
  const t = getDict(lang);

  // "Neden Biz" tanıtım metni — CMS'te ayrı alan yok, dile göre türetilir
  const whyLead =
    lang === "en"
      ? "For more than 15 years we have guided buyers and investors along the Seferihisar coast — every listing checked against its title deed, every value shared transparently, every step advised by people who actually live the region."
      : "Seferihisar kıyısında 15 yılı aşkın süredir alıcı ve yatırımcılara rehberlik ediyoruz — her ilan tapudan kontrollü, her değer şeffaf, her adım bölgeyi bizzat yaşayan uzmanların danışmanlığıyla.";

  return (
    <>
      {/* ══════ HERO — minimal & royal ══════ */}
      {/* z-30: açılır listeler alttaki bölümlerin üzerine taşabilsin */}
      <section className="relative z-30 bg-ink border-b border-ink-line" id="hero">
        {/* Sakin altın ambiyans — ayrı katmanda kırpılır, listeyi kesmez */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[420px] rounded-full bg-gold/[0.07] blur-3xl animate-ambient" />
          <div className="absolute bottom-0 right-0 w-[360px] h-[280px] rounded-full bg-gold/5 blur-3xl animate-ambient" style={{ animationDelay: "-6s" }} />
        </div>

        <div className="container-x relative z-10 py-16 md:py-24 flex flex-col items-center text-center">
          {/* Flörür + etiket */}
          <div className="flex items-center gap-4 mb-6 animate-fade-up">
            <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/60" />
            <p className="eyebrow">{c.hero.eyebrow}</p>
            <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* Başlık — Cinzel, kraliyet varak efekti */}
          <h1
            className="font-[family-name:var(--font-cinzel)] uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-fg-invert tracking-[0.06em] leading-tight mb-2 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            {c.hero.title}
          </h1>
          <span
            className="font-[family-name:var(--font-cinzel)] uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[0.1em] royal-text animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {c.hero.titleGold}
          </span>

          {/* Elmaslı ayraç */}
          <div className="flex items-center gap-3 my-7 animate-fade-up" style={{ animationDelay: "0.45s" }}>
            <span className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-gold/50" />
            <span className="w-2 h-2 rotate-45 bg-gold" />
            <span className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          {/* z-20: açılır listeler alttaki açıklama metninin üzerine boyanır */}
          <div className="w-full flex justify-center relative z-20 animate-fade-up" style={{ animationDelay: "0.55s" }}>
            <HeroSearch chips={c.popularSearches} />
          </div>

          <p
            className="text-sm md:text-base text-fg-invert-muted max-w-xl leading-relaxed mt-10 animate-fade-up"
            style={{ animationDelay: "0.7s" }}
          >
            {c.hero.subtitle}
          </p>
        </div>
      </section>

      {/* ══════ STATS BAR ══════ */}
      {c.sections.stats && <StatsBar />}

      {/* ══════ FEATURED LISTINGS — kraliyet vitrini ══════ */}
      {c.sections.featured && (
        <section className="container-x pt-16 pb-12 md:pt-20 md:pb-16" id="featured-listings">
          {/* Köşebentli tema-duyarlı vitrin paneli */}
          <div className="relative rounded-3xl border border-gold/20 bg-gradient-to-b from-ink-soft to-ink [.light_&]:from-[#fbf8f2] [.light_&]:to-[#f3eee3] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] [.light_&]:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            {/* Köşebent süslemeleri */}
            <span className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/60 rounded-tl z-10 pointer-events-none" aria-hidden />
            <span className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/60 rounded-tr z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/60 rounded-bl z-10 pointer-events-none" aria-hidden />
            <span className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/60 rounded-br z-10 pointer-events-none" aria-hidden />

            {/* Sakin altın ambiyans */}
            <div className="absolute -top-24 left-1/4 w-[460px] h-[300px] rounded-full bg-gold/[0.06] blur-3xl animate-ambient pointer-events-none" />
            <div className="absolute -bottom-16 right-0 w-[320px] h-[220px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />

            <div className="relative px-5 py-10 md:px-10 md:py-12">
              {/* Ortalanmış kraliyet başlığı */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/60" />
                  <p className="eyebrow">{c.featured.eyebrow}</p>
                  <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/60" />
                </div>
                <h2 className="display text-3xl md:text-4xl text-fg mb-4">
                  {c.featured.title}
                </h2>
                <div className="flex items-center justify-center gap-2.5">
                  <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/50" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                  <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/50" />
                </div>
              </div>

              {/* İlk ilan spotlight + rozet, kalanlar ızgarada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {featuredListings.slice(0, c.featured.count).map((listing, i) => (
                  <div key={listing.slug} className={`relative ${i === 0 ? "sm:col-span-2" : ""}`}>
                    {i === 0 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.6rem] font-bold uppercase tracking-[0.16em] shadow-[0_4px_14px_rgba(192,160,98,0.45)] whitespace-nowrap">
                        <span className="w-1 h-1 rotate-45 bg-ink/60" />
                        Haftanın Seçimi
                        <span className="w-1 h-1 rotate-45 bg-ink/60" />
                      </span>
                    )}
                    <ListingCard listing={listing} eager />
                  </div>
                ))}
              </div>

              {/* Vitrin çıkışı: ortalanmış eylem */}
              <div className="flex justify-center mt-10">
                <Link href="/satilik" className="btn btn-gold group px-8 text-xs font-bold uppercase tracking-[0.16em]">
                  {t.viewAllListings}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <MiniBanner type="sell" />
          </div>
        </section>
      )}

      {/* ══════ PROPERTY TYPES ══════ */}
      {c.sections.propertyTypes && (
        <section className="relative bg-ink overflow-hidden" id="property-types">
          <div className="divider-gold" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[560px] h-[300px] rounded-full bg-gold/[0.06] blur-3xl animate-ambient pointer-events-none" />
          <div className="container-x py-16 md:py-20 relative">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/60" />
                <p className="eyebrow">{c.propertyTypes.eyebrow}</p>
                <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
              <h2 className="display text-3xl md:text-4xl text-fg-invert mb-4">
                {c.propertyTypes.title}
              </h2>
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/50" />
                <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {propertyTypes.map((type) => (
                <Link
                  key={type.slug}
                  href={`/izmir/seferihisar/satilik-${type.slug}`}
                  className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-ink-line bg-ink-card/40 hover:border-gold/40 hover:bg-ink-card hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(192,160,98,0.1)] transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gold/[0.1] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/45 group-hover:scale-110">
                    <TypeIcon name={type.icon} className="w-6 h-6 text-gold" />
                  </div>
                  <span className="relative text-sm font-semibold text-fg-invert-muted group-hover:text-gold-bright transition-colors text-center">
                    {type.name}
                  </span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent group-hover:w-3/4 transition-all duration-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ DISTRICTS (EGE BÖLGELERİ) ══════ */}
      {c.sections.districts && (
        <section className="relative container-x py-16 md:py-24 overflow-hidden" id="districts-showcase">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-[320px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
          <div className="relative text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <p className="eyebrow">{c.districts.eyebrow}</p>
              <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h2 className="display text-3xl md:text-4xl mb-4">
              <span className="royal-text">{c.districts.title}</span>
            </h2>
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/50" />
              <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/50" />
            </div>
            <p className="text-fg-muted text-sm max-w-lg mx-auto leading-relaxed">
              {c.districts.subtitle}
            </p>
          </div>

          {/* Premium districts with images */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6">
            {districts.filter((d) => d.priority <= 2).map((d) => (
              <Link
                key={d.slug}
                href={`/izmir/${d.slug}`}
                className="group block relative rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/40 via-gold/10 to-gold/30 hover:from-gold/70 hover:via-gold/20 hover:to-gold/50 shadow-md hover:shadow-[0_18px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-ink">
                  {/* Köşebentler */}
                  <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/60 rounded-tl z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />
                  <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold/60 rounded-tr z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />
                  <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold/60 rounded-bl z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />
                  <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold/60 rounded-br z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />
                  <Image
                    src={`/images/${d.slug}.jpg`}
                    alt={`${d.name} bölge manzarası`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                  {/* Yatırım önceliği rozeti */}
                  {d.priority === 1 && (
                    <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.5rem] font-bold uppercase tracking-[0.12em] shadow-[0_2px_8px_rgba(192,160,98,0.4)]">
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M4 17h16M5 15l1.5-8L11 12l1-7 1 7 4.5-5L19 15z" /></svg>
                      Vitrin
                    </span>
                  )}
                  <div className="absolute bottom-5 left-5 right-5 z-10">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                        <h3 className="display text-xl text-fg-invert group-hover:text-gold-bright transition-colors truncate">
                          {d.name}
                        </h3>
                      </span>
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink/60 backdrop-blur border border-gold/25 text-[0.55rem] font-bold text-gold-bright">
                        {d.neighborhoods.length} Mahalle
                      </span>
                    </div>
                    <p className="text-[0.7rem] text-fg-invert-muted/90 line-clamp-2 leading-relaxed">
                      {d.summary}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 text-[0.6rem] font-bold text-gold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
                      Keşfet
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Other districts list — "Tümünü Gör" ile açılır */}
          <OtherDistricts
            districts={districts
              .filter((d) => d.priority > 2)
              .map((d) => ({ slug: d.slug, name: d.name }))}
            title={t.otherDistricts}
            showAllLabel={t.showAll}
            hideLabel={t.hide}
          />
        </section>
      )}

      {/* ══════ ARSA DEĞERİ SORGULAMA (ADA/PARSEL) ══════ */}
      {c.sections.arsaSorgula && <ArsaSorgula />}

      {/* ══════ NEIGHBORHOODS ══════ */}
      {c.sections.neighborhoods && (
        <section className="relative container-x py-16 md:py-20 overflow-hidden" id="neighborhoods">
          <div className="absolute -top-10 left-0 w-[400px] h-[260px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                <p className="eyebrow">{c.neighborhoods.eyebrow}</p>
                <span className="h-px w-12 bg-gradient-to-r from-gold/50 to-transparent" />
              </div>
              <h2 className="display text-3xl md:text-4xl">
                <span className="royal-text">{c.neighborhoods.title}</span>
              </h2>
              <span className="block h-px w-24 mt-4 bg-gradient-to-r from-gold/50 to-transparent" />
            </div>
            <Link
              href={`/izmir/${primaryDistrict.slug}`}
              className="btn btn-outline group mt-6 md:mt-0 self-start md:self-auto"
            >
              {t.viewAllNeighborhoods}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {primaryDistrict.neighborhoods.slice(0, 8).map((n) => (
              <NeighborhoodCard
                key={n.slug}
                neighborhood={n}
                districtSlug={primaryDistrict.slug}
              />
            ))}
          </div>

          <div className="mt-12">
            <MiniBanner type="land" />
          </div>
        </section>
      )}

      {/* ══════ WHY US — editoryal asimetrik kraliyet düzeni ══════ */}
      {c.sections.whyUs && (
        <section className="relative bg-cream-soft border-y border-cream-line overflow-hidden" id="why-us">
          {/* Sakin altın ambiyans — iki ayrı katmanda süzülür */}
          <div className="absolute -top-16 left-1/3 -translate-x-1/2 w-[560px] h-[300px] rounded-full bg-gold/[0.06] blur-3xl animate-ambient pointer-events-none" />
          <div className="absolute -bottom-20 right-0 w-[420px] h-[260px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />

          <div className="container-x py-16 md:py-24 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* ── Sol: kraliyet tanıtım paneli (sticky) ── */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                  <p className="eyebrow">{c.whyUs.eyebrow}</p>
                  <span className="h-px flex-1 max-w-[6rem] bg-gradient-to-r from-gold/50 to-transparent" />
                </div>

                <h2 className="display text-3xl md:text-4xl lg:text-[2.75rem] text-fg leading-[1.1] mb-5">
                  <span className="royal-text">{c.whyUs.title}</span>
                </h2>

                <div className="flex items-center gap-2.5 mb-6">
                  <span className="h-px w-16 bg-gradient-to-r from-gold/55 to-transparent" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
                </div>

                <p className="text-sm md:text-[0.95rem] text-fg-muted leading-relaxed max-w-md mb-8">
                  {whyLead}
                </p>

                {/* Güven imzası: danışman madalyonu */}
                <div className="flex items-center gap-4 p-4 rounded-2xl card-luxe mb-8 max-w-md">
                  <div className="relative w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-gold-deep via-gold to-gold-bright flex items-center justify-center text-ink font-[family-name:var(--font-cinzel)] font-bold text-sm shadow-[0_4px_14px_rgba(192,160,98,0.35)]">
                    {site.agent.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-fg truncate">{site.agent.name}</p>
                    <p className="text-[0.7rem] text-fg-muted truncate">
                      {site.agent.title} · {site.agent.memberSince}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <a href={site.phoneHref} className="btn btn-gold group/btn px-6">
                    <Phone className="w-4 h-4 animate-pulse" />
                    {site.phone}
                  </a>
                  <Link href="/iletisim" className="btn btn-outline group/btn px-6">
                    {t.contactForm}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* ── Sağ: zarif numaralı maddeler ── */}
              <ol className="lg:col-span-7 relative">
                {c.whyUs.items.map((item, i) => (
                  <li
                    key={item.title}
                    className="group relative animate-fade-up"
                    style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                  >
                    <div className="relative flex items-start gap-5 md:gap-6 rounded-2xl px-4 md:px-6 py-6 transition-colors duration-300 hover:bg-gold/[0.04]">
                      {/* Hover'da soldan beliren altın aksan rayı */}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-gold-bright to-gold-deep rounded-full group-hover:h-3/5 transition-all duration-400" />

                      {/* Altın madalyon ikon */}
                      <div className="relative shrink-0 w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center transition-all duration-300 group-hover:border-gold/45 group-hover:bg-gold/15 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_22px_rgba(192,160,98,0.18)]">
                        <WhyIcon index={i} />
                        {/* Hover'da köşeden süzülen ışıltı */}
                        <span className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gold/[0.12] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <div className="flex items-baseline gap-2.5 mb-1.5">
                          <span className="font-[family-name:var(--font-cinzel)] font-bold text-sm text-gold/70 tabular-nums tracking-wider">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="h-px w-5 bg-gold/30" />
                          <h3 className="text-base md:text-lg font-bold text-fg group-hover:text-gold-deep transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-sm text-fg-muted leading-relaxed max-w-prose">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Maddeler arası ince altın ayraç (sonuncuda gizli) */}
                    {i < c.whyUs.items.length - 1 && (
                      <span className="block h-px ml-4 md:ml-6 bg-gradient-to-r from-cream-line via-gold/15 to-transparent" />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* ══════ BLOG / INSIGHTS — dergi düzeni (öne çıkan + liste) ══════ */}
      {c.sections.blog && (
        <section className="relative container-x py-16 md:py-20 overflow-hidden" id="insights">
          <div className="absolute -top-10 right-0 w-[400px] h-[260px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
          <div className="absolute -bottom-12 left-0 w-[360px] h-[240px] rounded-full bg-gold/[0.04] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                <p className="eyebrow">{c.blog.eyebrow}</p>
                <span className="h-px w-12 bg-gradient-to-r from-gold/50 to-transparent" />
              </div>
              <h2 className="display text-3xl md:text-4xl">
                <span className="royal-text">{c.blog.title}</span>
              </h2>
              <span className="block h-px w-24 mt-4 bg-gradient-to-r from-gold/50 to-transparent" />
            </div>
            <Link
              href="/blog"
              className="btn btn-outline group mt-6 md:mt-0 self-start md:self-auto"
            >
              {t.viewAllPosts}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {(() => {
            const [lead, ...rest] = blogPosts.slice(0, 3);
            return (
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {/* ── Öne çıkan yazı (büyük editoryal kart) ── */}
                <Link
                  href={`/blog/${lead.slug}`}
                  id={`blog-${lead.slug}`}
                  className="group lg:col-span-7 relative block rounded-3xl overflow-hidden card-luxe animate-fade-up"
                >
                  <div className="relative aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[420px]">
                    {/* Köşebentler (hover) */}
                    <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />
                    <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />
                    <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />
                    <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold/70 rounded-br z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden />

                    <Image
                      src={lead.cover}
                      alt={lead.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />

                    {/* Öne Çıkan rozeti */}
                    <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.58rem] font-bold uppercase tracking-[0.16em] shadow-[0_4px_14px_rgba(192,160,98,0.45)]">
                      <span className="w-1 h-1 rotate-45 bg-ink/60" />
                      Öne Çıkan
                    </span>

                    {/* İçerik */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
                      <div className="flex items-center gap-3 text-[0.7rem] text-fg-invert-muted mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold-bright font-semibold uppercase tracking-wider">
                          {lead.category}
                        </span>
                        <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                        <span className="w-1 h-1 rounded-full bg-fg-invert-muted/50" />
                        <span>{lead.readingMinutes} dk okuma</span>
                      </div>
                      <h3 className="display text-2xl md:text-3xl text-fg-invert leading-tight mb-3 group-hover:text-gold-bright transition-colors">
                        {lead.title}
                      </h3>
                      <p className="text-sm text-fg-invert-muted leading-relaxed line-clamp-2 max-w-xl mb-4">
                        {lead.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-[0.12em]">
                        Devamını Oku
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* ── Yan liste (kompakt satırlar) ── */}
                <div className="lg:col-span-5 flex flex-col">
                  {rest.map((post, i) => (
                    <div key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        id={`blog-${post.slug}`}
                        className="group flex gap-4 py-5 first:pt-0 animate-fade-up"
                        style={{ animationDelay: `${0.15 + i * 0.1}s` }}
                      >
                        <div className="relative w-28 h-24 md:w-32 md:h-24 shrink-0 rounded-xl overflow-hidden border border-cream-line">
                          <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            sizes="140px"
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <div className="flex items-center gap-2 text-[0.65rem] text-fg-muted mb-1.5">
                            <span className="text-gold-deep font-semibold uppercase tracking-wider">{post.category}</span>
                            <span className="w-1 h-1 rounded-full bg-cream-line" />
                            <span>{post.readingMinutes} dk</span>
                          </div>
                          <h3 className="text-base font-bold text-fg leading-snug line-clamp-2 mb-2 group-hover:text-gold-deep transition-colors">
                            {post.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-gold-deep opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 mt-auto">
                            Devamını Oku
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                      {i < rest.length - 1 && (
                        <span className="block h-px bg-gradient-to-r from-cream-line via-gold/15 to-transparent" />
                      )}
                    </div>
                  ))}

                  {/* Tüm yazılar — zarif alt bağlantı */}
                  <Link
                    href="/blog"
                    className="group mt-auto pt-6 inline-flex items-center justify-between gap-2 border-t border-gold/15 text-sm font-semibold text-fg hover:text-gold-deep transition-colors"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                      {t.viewAllPosts}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* ══════ SEO METNİ — Seferihisar Emlak (çerçeveli editoryal rehber) ══════ */}
      {lang === "tr" && (
        <section className="relative bg-cream-soft border-t border-cream-line overflow-hidden" id="seferihisar-emlak-rehberi">
          <div className="absolute -top-16 right-1/4 w-[480px] h-[280px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
          <div className="absolute -bottom-16 left-1/4 w-[480px] h-[280px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />

          <div className="container-x py-16 md:py-20 relative">
            {/* Köşebentli kraliyet rehber paneli */}
            <div className="relative rounded-3xl border border-gold/20 bg-gradient-to-b from-[#fdfbf5] to-[#f3eee3] [html:not(.light)_&]:from-ink-soft [html:not(.light)_&]:to-ink overflow-hidden shadow-[0_20px_50px_rgba(120,92,36,0.10)] [html:not(.light)_&]:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              {/* Köşebent süslemeleri */}
              <span className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/55 rounded-tl z-10 pointer-events-none" aria-hidden />
              <span className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/55 rounded-tr z-10 pointer-events-none" aria-hidden />
              <span className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/55 rounded-bl z-10 pointer-events-none" aria-hidden />
              <span className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/55 rounded-br z-10 pointer-events-none" aria-hidden />
              {/* Üst altın ışık çizgisi */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent pointer-events-none" aria-hidden />
              {/* İç ambiyans */}
              <div className="absolute -top-20 left-1/3 w-[420px] h-[260px] rounded-full bg-gold/[0.05] blur-3xl pointer-events-none" />

              <div className="relative px-5 py-10 md:px-12 md:py-14">
                {/* Başlık */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                  <p className="eyebrow">Yatırım Rehberi</p>
                  <span className="h-px flex-1 max-w-[7rem] bg-gradient-to-r from-gold/50 to-transparent" />
                </div>
                <h2 className="display text-2xl md:text-[2.1rem] text-fg leading-tight mb-3">
                  Seferihisar Emlak Piyasası ve{" "}
                  <span className="royal-text">Yatırım Rehberi</span>
                </h2>
                <div className="flex items-center gap-2.5 mb-9">
                  <span className="h-px w-16 bg-gradient-to-r from-gold/55 to-transparent" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
                </div>

                {/* Editoryal gövde: sol görsel + öne çıkanlar, sağ metin */}
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                  {/* ── Sol: görsel çıpa + yatırım avantajları ── */}
                  <div className="lg:col-span-5 flex flex-col">
                    <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-gold/20 shadow-[0_14px_36px_rgba(0,0,0,0.25)]">
                      {/* Köşebentler */}
                      <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-20 pointer-events-none" aria-hidden />
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-20 pointer-events-none" aria-hidden />
                      <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-20 pointer-events-none" aria-hidden />
                      <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-gold/70 rounded-br z-20 pointer-events-none" aria-hidden />

                      <Image
                        src="/images/seferihisar.jpg"
                        alt="Seferihisar sahili ve Sığacık koyu"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

                      {/* Cittaslow rozeti */}
                      <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/55 backdrop-blur border border-gold/30 text-gold-bright text-[0.58rem] font-bold uppercase tracking-[0.14em]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>
                        Cittaslow · Sakin Şehir
                      </span>

                      {/* Alt başlık */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                          <p className="display text-xl text-fg-invert">Seferihisar</p>
                        </div>
                        <p className="text-[0.7rem] text-fg-invert-muted/90 tracking-wide">
                          İzmir&apos;in sakin kıyısı · Ege
                        </p>
                      </div>
                    </div>

                    {/* Yatırım avantajları */}
                    <ul className="mt-6 space-y-3.5">
                      {[
                        {
                          title: "Sınırlı Yapılaşma",
                          desc: "Sakin şehir imar planları arzı kısıtlar, stoğu kıymetlendirir.",
                          icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
                        },
                        {
                          title: "Sahil Şeridi",
                          desc: "Sığacık, Akarca ve Akkum koyları çevresinde değer odağı.",
                          icon: <><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1" /><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1" /><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1" /></>,
                        },
                        {
                          title: "Doğrulanmış Portföy",
                          desc: "Tapu ve imar kontrolünden geçmiş ilanlar.",
                          icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
                        },
                        {
                          title: "Uzun Vadeli Değer",
                          desc: "Reel fiyat koruması ve yaz aylarında kira getirisi.",
                          icon: <><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></>,
                        },
                      ].map((h) => (
                        <li key={h.title} className="group/h flex items-start gap-3.5">
                          <span className="relative shrink-0 w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center transition-all duration-300 group-hover/h:border-gold/45 group-hover/h:bg-gold/15">
                            <svg className="w-[18px] h-[18px] text-gold" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{h.icon}</svg>
                          </span>
                          <div className="min-w-0 pt-0.5">
                            <p className="text-sm font-bold text-fg leading-snug">{h.title}</p>
                            <p className="text-[0.78rem] text-fg-muted leading-relaxed">{h.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Sütun alt notu — boşluğu kasıtlı kapatır */}
                    <div className="mt-auto pt-6">
                      <div className="flex items-start gap-2.5 pt-5 border-t border-gold/15">
                        <span className="w-1.5 h-1.5 rotate-45 bg-gold/70 shrink-0 mt-1" />
                        <p className="text-[0.72rem] text-fg-muted leading-relaxed">
                          Tüm değer aralıkları TKGM kayıtları ve güncel bölge piyasası ile
                          düzenli olarak güncellenir.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Sağ: editoryal metin (drop-cap) ── */}
                  <div className="lg:col-span-7 space-y-4 text-[0.92rem] leading-[1.75] text-fg-muted">
                    <p>
                      <strong className="text-fg">Seferihisar emlak</strong>{" "}piyasası, Türkiye&apos;nin
                      ilk Cittaslow (Sakin Şehir) ilçesi olmasının da etkisiyle son yıllarda İzmir&apos;in
                      en çok değer kazanan bölgelerinden biri haline geldi.{" "}
                      <Link href="/izmir/seferihisar/satilik-villa" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">Seferihisar satılık villa</Link>,{" "}
                      <Link href="/izmir/seferihisar/satilik-arsa" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">satılık arsa</Link> ve{" "}
                      <Link href="/izmir/seferihisar/satilik-daire" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">satılık daire</Link>{" "}
                      arayışında olan yatırımcılar; Sığacık Marina, Teos Antik Kenti ve Akkum
                      plajlarının çevresinde hem yaşam hem getiri odaklı seçenekler bulabiliyor.
                    </p>
                    <p>
                      <Link href="/izmir/seferihisar/sigacik" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">Sığacık</Link>,{" "}
                      <Link href="/izmir/seferihisar/akarca" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">Akarca</Link> ve{" "}
                      <Link href="/izmir/seferihisar/ulamis" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">Ulamış</Link>{" "}
                      gibi mahalleler denize yakınlık ve imar durumuna göre farklı fiyat
                      segmentleri sunar. Sakin şehir imar planları yapılaşmayı sınırlı tuttuğu
                      için arsa ve villa stoğu kıymetlidir; bu da Seferihisar gayrimenkul
                      yatırımlarının uzun vadeli değerini destekler.
                    </p>
                    {/* Vurgulu alıntı */}
                    <blockquote className="relative my-6 pl-5 py-1 border-l-2 border-gold/50">
                      <span className="absolute -left-px top-0 h-6 w-0.5 bg-gradient-to-b from-gold-bright to-transparent" />
                      <p className="display text-lg md:text-xl text-fg leading-snug italic">
                        “Sınırlı imar ve artan talep, deniz manzaralı arsalarda değeri reel olarak korur.”
                      </p>
                    </blockquote>
                    <p>
                      Private Estate olarak Seferihisar merkez ve köylerindeki{" "}
                      <Link href="/satilik" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">satılık</Link> ve{" "}
                      <Link href="/kiralik" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">kiralık</Link>{" "}
                      portföyümüzü tapu ve imar kontrolünden geçirerek yayınlıyoruz. Ücretsiz{" "}
                      <Link href="/#arsa-sorgulama" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">arsa değeri sorgulama</Link>{" "}
                      aracımızla ada/parsel bilginizi girerek taşınmazınızın TKGM kayıtlı
                      alanını ve güncel piyasa değer aralığını anında görebilirsiniz.
                    </p>
                    <p>
                      Urla, Çeşme, Güzelbahçe ve Menderes dahil{" "}
                      <Link href="/izmir/seferihisar" className="text-gold-deep hover:text-gold-bright font-semibold transition-colors">İzmir&apos;in 30 ilçesinde</Link>{" "}
                      mahalle bazlı emlak rehberlerimiz; bölge fiyat ortalamaları, yatırım
                      notları ve güncel ilanlarla düzenli olarak yenilenir. Seferihisar&apos;da
                      emlak alım-satım sürecinizin her adımında uzman desteği için bize
                      ulaşın — ilk danışma görüşmesi her zaman ücretsizdir.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ BOTTOM CTA ══════ */}
      {c.sections.cta && (
        <section className="bg-gradient-to-b from-ink-soft to-ink relative overflow-hidden" id="bottom-cta">
          <div className="divider-gold" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[320px] rounded-full bg-gold/[0.07] blur-3xl animate-ambient pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[360px] h-[220px] rounded-full bg-gold/[0.04] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />
          <div className="container-x py-16 md:py-24 text-center relative z-10">
            {/* Taçlı flörür */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <svg className="w-5 h-5 text-gold animate-glow rounded-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 17h16M5 15l1.5-8L11 12l1-7 1 7 4.5-5L19 15z" /></svg>
              <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <p className="eyebrow mb-4">{c.cta.eyebrow}</p>
            <h2 className="display text-3xl md:text-4xl lg:text-5xl text-fg-invert mb-6 max-w-2xl mx-auto">
              {c.cta.title}
              <br />
              <span className="royal-text font-semibold">{c.cta.titleGold}</span>
            </h2>
            <p className="text-fg-invert-muted text-base max-w-lg mx-auto mb-8 leading-relaxed">
              {c.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href={site.phoneHref} className="btn btn-gold group/btn px-7">
                <Phone className="w-4 h-4 animate-pulse" />
                {site.phone}
              </a>
              <Link href="/iletisim" className="btn btn-ghost group/btn px-7">
                {t.contactForm}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </div>
            {/* Alt güven satırı */}
            <p className="text-[0.62rem] text-fg-invert-muted/50 tracking-[0.14em] uppercase mt-8">
              15+ Yıllık Deneyim · Ücretsiz Danışmanlık · Gizli Komisyon Yok
            </p>
          </div>
        </section>
      )}
    </>
  );
}
