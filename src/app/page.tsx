import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { getFeaturedListings } from "@/lib/listings-store";
import { primaryDistrict, districts } from "@/data/locations";
import { blogPosts } from "@/data/blog";
import { propertyTypes } from "@/data/property-types";
import { ListingCard } from "@/components/ListingCard";
import { BlogCard } from "@/components/BlogCard";
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
        <section className="bg-ink" id="property-types">
          <div className="container-x py-16 md:py-20">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">{c.propertyTypes.eyebrow}</p>
              <h2 className="display text-3xl md:text-4xl text-fg-invert">
                {c.propertyTypes.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {propertyTypes.map((type) => (
                <Link
                  key={type.slug}
                  href={`/izmir/seferihisar/satilik-${type.slug}`}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-ink-line hover:border-gold/40 hover:bg-ink-card transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <TypeIcon name={type.icon} className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-sm font-medium text-fg-invert-muted group-hover:text-gold-bright transition-colors text-center">
                    {type.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ DISTRICTS (EGE BÖLGELERİ) ══════ */}
      {c.sections.districts && (
        <section className="container-x py-16 md:py-24" id="districts-showcase">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">{c.districts.eyebrow}</p>
            <h2 className="display text-3xl md:text-4xl text-fg">
              {c.districts.title}
            </h2>
            <p className="text-fg-muted text-sm max-w-lg mx-auto mt-2 leading-relaxed">
              {c.districts.subtitle}
            </p>
          </div>

          {/* Premium districts with images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {districts.filter((d) => d.priority <= 2).map((d) => (
              <Link
                key={d.slug}
                href={`/izmir/${d.slug}`}
                className="group block relative rounded-2xl overflow-hidden aspect-[4/5] bg-ink border border-cream-line shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={`/images/${d.slug}.jpg`}
                  alt={`${d.name} bölge manzarası`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <h3 className="display text-xl text-fg-invert mb-1 group-hover:text-gold-bright transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-[0.7rem] text-fg-invert-muted/90 line-clamp-2 leading-relaxed">
                    {d.summary}
                  </p>
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
              <h2 className="display text-3xl md:text-4xl text-fg">
                {c.neighborhoods.title}
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

      {/* ══════ WHY US ══════ */}
      {c.sections.whyUs && (
        <section className="relative bg-cream-soft border-y border-cream-line overflow-hidden" id="why-us">
          {/* Sakin altın ambiyans */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[560px] h-[300px] rounded-full bg-gold/[0.06] blur-3xl animate-ambient pointer-events-none" />
          <div className="container-x py-16 md:py-20 relative">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/60" />
                <p className="eyebrow">{c.whyUs.eyebrow}</p>
                <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/60" />
              </div>
              <h2 className="display text-3xl md:text-4xl text-fg mb-4">
                {c.whyUs.title}
              </h2>
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/50" />
                <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.whyUs.items.map((item, i) => (
                <div
                  key={item.title}
                  className="group relative p-6 rounded-2xl card-luxe overflow-hidden"
                >
                  {/* Hover'da köşeden süzülen altın ışıltı */}
                  <span className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gold/[0.08] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  {/* Filigran numara */}
                  <span className="absolute top-3 right-4 text-3xl font-[family-name:var(--font-cinzel)] font-bold text-gold/10 select-none pointer-events-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Altın madalyon ikon */}
                  <div className="relative w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-gold/40 group-hover:bg-gold/15 animate-glow">
                    <WhyIcon index={i} />
                  </div>
                  <h3 className="relative text-base font-bold text-fg mb-2">
                    {item.title}
                  </h3>
                  <p className="relative text-sm text-fg-muted leading-relaxed">
                    {item.desc}
                  </p>
                  {/* Alt altın aksan çizgisi — hover'da uzar */}
                  <span className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ BLOG / INSIGHTS ══════ */}
      {c.sections.blog && (
        <section className="container-x py-16 md:py-20" id="insights">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="eyebrow mb-3">{c.blog.eyebrow}</p>
              <h2 className="display text-3xl md:text-4xl text-fg">
                {c.blog.title}
              </h2>
            </div>
            <Link
              href="/blog"
              className="btn btn-outline mt-6 md:mt-0 self-start md:self-auto"
            >
              {t.viewAllPosts}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* ══════ SEO METNİ — Seferihisar Emlak ══════ */}
      {lang === "tr" && (
        <section className="bg-cream-soft border-t border-cream-line" id="seferihisar-emlak-rehberi">
          <div className="container-x py-14 md:py-16">
            <h2 className="display text-2xl md:text-3xl text-fg mb-6">
              Seferihisar Emlak Piyasası ve Yatırım Rehberi
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 text-sm leading-relaxed text-fg-muted">
              <div className="space-y-4">
                <p>
                  <strong className="text-fg">Seferihisar emlak</strong> piyasası, Türkiye&apos;nin
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
              </div>
              <div className="space-y-4">
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
        </section>
      )}

      {/* ══════ BOTTOM CTA ══════ */}
      {c.sections.cta && (
        <section className="bg-ink relative overflow-hidden" id="bottom-cta">
          <div className="divider-gold" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[320px] rounded-full bg-gold/5 blur-3xl animate-ambient pointer-events-none" />
          <div className="container-x py-16 md:py-24 text-center relative z-10">
            <p className="eyebrow mb-4">{c.cta.eyebrow}</p>
            <h2 className="display text-3xl md:text-4xl lg:text-5xl text-fg-invert mb-6 max-w-2xl mx-auto">
              {c.cta.title}
              <br />
              <span className="text-gold">{c.cta.titleGold}</span>
            </h2>
            <p className="text-fg-invert-muted text-base max-w-lg mx-auto mb-8 leading-relaxed">
              {c.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href={site.phoneHref} className="btn btn-gold">
                <Phone className="w-4 h-4" />
                {site.phone}
              </a>
              <Link href="/iletisim" className="btn btn-ghost">
                {t.contactForm}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
