import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { featuredListings } from "@/data/listings";
import { primaryDistrict, districts } from "@/data/locations";
import { blogPosts } from "@/data/blog";
import { propertyTypes } from "@/data/property-types";
import { ListingCard } from "@/components/ListingCard";
import { BlogCard } from "@/components/BlogCard";
import { NeighborhoodCard } from "@/components/NeighborhoodCard";
import { StatsBar } from "@/components/StatsBar";
import { TypeIcon, ArrowRight, ArrowUpRight, Check, Phone } from "@/components/icons";
import { site } from "@/lib/site";
import { ArsaSorgula } from "@/components/ArsaSorgula";
import { HeroSearch } from "@/components/HeroSearch";
import { MiniBanner } from "@/components/MiniBanner";
import { getHomepage } from "@/lib/cms";
import { getDict, isLang, LANG_COOKIE, type Lang } from "@/lib/i18n";

// İçerik admin panelden anlık güncellenebildiği için her istekte taze okunur
export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  const lang: Lang = isLang(cookieLang) ? cookieLang : "tr";
  const c = await getHomepage(lang);
  const t = getDict(lang);

  return (
    <>
      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[85vh] flex items-center bg-ink overflow-hidden" id="hero">
        {/* Background Image */}
        <Image
          src="/images/hero-sunset.jpg"
          alt="Seferihisar Sığacık sahil manzarası"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        {/* Dolaşan altın ambiyans ışıkları */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gold/10 blur-3xl animate-ambient pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] rounded-full bg-gold/5 blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />

        <div className="container-x relative z-10 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {c.hero.eyebrow}
            </p>
            <h1
              className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-fg-invert mb-6 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              {c.hero.title}
              <br />
              <span className="gold-text animate-shimmer bg-[linear-gradient(120deg,var(--color-gold-deep),var(--color-gold-bright)_40%,var(--color-gold)_60%,var(--color-gold-bright))]">
                {c.hero.titleGold}
              </span>
            </h1>
            <p
              className="text-base md:text-lg text-fg-invert-muted max-w-lg leading-relaxed mb-8 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              {c.hero.subtitle}
            </p>
            <HeroSearch />
          </div>
        </div>

        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* ══════ STATS BAR ══════ */}
      {c.sections.stats && <StatsBar />}

      {/* ══════ FEATURED LISTINGS ══════ */}
      {c.sections.featured && (
        <section className="container-x pt-20 pb-16 md:pt-24 md:pb-20" id="featured-listings">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="eyebrow mb-3">{c.featured.eyebrow}</p>
              <h2 className="display text-3xl md:text-4xl text-fg">
                {c.featured.title}
              </h2>
            </div>
            <Link
              href="/satilik"
              className="btn btn-outline mt-6 md:mt-0 self-start md:self-auto"
            >
              {t.viewAllListings}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.slice(0, c.featured.count).map((listing) => (
              <ListingCard key={listing.slug} listing={listing} />
            ))}
          </div>

          <div className="mt-12">
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

          {/* Other districts list for complete İzmir coverage */}
          <div className="mt-12 pt-8 border-t border-cream-line">
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-5 text-center sm:text-left">
              {t.otherDistricts}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {districts.filter((d) => d.priority > 2).map((d) => (
                <Link
                  key={d.slug}
                  href={`/izmir/${d.slug}`}
                  className="px-4 py-3 rounded-xl border border-cream-line bg-surface text-xs font-semibold text-fg-muted hover:border-gold hover:text-gold-bright hover:shadow-[0_0_18px_rgba(192,160,98,0.12)] transition-all duration-300 flex items-center justify-between group"
                >
                  <span>{d.name}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-gold translate-x-[-4px] group-hover:translate-x-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ ARSA DEĞERİ SORGULAMA (ADA/PARSEL) ══════ */}
      {c.sections.arsaSorgula && <ArsaSorgula />}

      {/* ══════ NEIGHBORHOODS ══════ */}
      {c.sections.neighborhoods && (
        <section className="container-x py-16 md:py-20" id="neighborhoods">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="eyebrow mb-3">{c.neighborhoods.eyebrow}</p>
              <h2 className="display text-3xl md:text-4xl text-fg">
                {c.neighborhoods.title}
              </h2>
            </div>
            <Link
              href={`/izmir/${primaryDistrict.slug}`}
              className="btn btn-outline mt-6 md:mt-0 self-start md:self-auto"
            >
              {t.viewAllNeighborhoods}
              <ArrowRight className="w-4 h-4" />
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
        <section className="bg-cream-soft border-y border-cream-line animate-fade-up" id="why-us">
          <div className="container-x py-16 md:py-20">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">{c.whyUs.eyebrow}</p>
              <h2 className="display text-3xl md:text-4xl text-fg">
                {c.whyUs.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.whyUs.items.map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl card-luxe"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-4 animate-glow">
                    <Check className="w-5 h-5 text-gold-deep" />
                  </div>
                  <h3 className="text-base font-semibold text-fg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {item.desc}
                  </p>
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
