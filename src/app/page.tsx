import Image from "next/image";
import Link from "next/link";
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

export default function Home() {
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

        <div className="container-x relative z-10 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Ege&apos;nin Sakin Şehri
            </p>
            <h1
              className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-fg-invert mb-6 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Doğru Gayrimenkul,
              <br />
              <span className="text-gold">Doğru Yatırım.</span>
            </h1>
            <p
              className="text-base md:text-lg text-fg-invert-muted max-w-lg leading-relaxed mb-8 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              Seferihisar ve çevresindeki satılık villa, arsa, daire ve yazlık
              ilanları. Güncel fiyatlar, bölge rehberleri ve yatırım fırsatları
              tek platformda.
            </p>
            <HeroSearch />
          </div>
        </div>

        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* ══════ STATS BAR ══════ */}
      <StatsBar />

      {/* ══════ FEATURED LISTINGS ══════ */}
      <section className="container-x pt-20 pb-16 md:pt-24 md:pb-20" id="featured-listings">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Öne Çıkan İlanlar</p>
            <h2 className="display text-3xl md:text-4xl text-ink">
              Seçkin<br className="hidden sm:block" /> Portföyümüz
            </h2>
          </div>
          <Link
            href="/satilik"
            className="btn btn-outline mt-6 md:mt-0 self-start md:self-auto"
          >
            Tüm İlanları Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>

        <div className="mt-12">
          <MiniBanner type="sell" />
        </div>
      </section>

      {/* ══════ PROPERTY TYPES ══════ */}
      <section className="bg-ink" id="property-types">
        <div className="container-x py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Gayrimenkul Türleri</p>
            <h2 className="display text-3xl md:text-4xl text-fg-invert">
              Ne Arıyorsunuz?
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

      {/* ══════ DISTRICTS (EGE BÖLGELERİ) ══════ */}
      <section className="container-x py-16 md:py-24" id="districts-showcase">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Prestijli Yatırım</p>
          <h2 className="display text-3xl md:text-4xl text-ink">
            Ege&apos;nin İncisi Bölgelerimiz
          </h2>
          <p className="text-fg-muted text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            Uzmanlık alanımız olan sahil şeridinde yatırım değeri yüksek, premium projelerin yükseldiği en popüler bölgeler.
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
            İzmir&apos;in Diğer Yatırım Bölgeleri
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {districts.filter((d) => d.priority > 2).map((d) => (
              <Link
                key={d.slug}
                href={`/izmir/${d.slug}`}
                className="px-4 py-3 rounded-xl border border-cream-line bg-white text-xs font-semibold text-fg-muted hover:border-gold hover:text-gold-deep hover:bg-white hover:shadow-sm transition-all duration-300 flex items-center justify-between group"
              >
                <span>{d.name}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-gold translate-x-[-4px] group-hover:translate-x-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ ARSA DEĞERİ SORGULAMA (ADA/PARSEL) ══════ */}
      <ArsaSorgula />

      {/* ══════ NEIGHBORHOODS ══════ */}
      <section className="container-x py-16 md:py-20" id="neighborhoods">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Mahalleler</p>
            <h2 className="display text-3xl md:text-4xl text-ink">
              Seferihisar<br className="hidden sm:block" /> Mahalleleri
            </h2>
          </div>
          <Link
            href={`/izmir/${primaryDistrict.slug}`}
            className="btn btn-outline mt-6 md:mt-0 self-start md:self-auto"
          >
            Tüm Mahalleleri Gör
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

        <div className="mt-12 hidden md:block">
           {/* Masaüstünde gizle istersen ama kalsın */}
           <MiniBanner type="land" />
        </div>
        <div className="mt-8 md:hidden">
           <MiniBanner type="land" />
        </div>
      </section>

      {/* ══════ WHY US ══════ */}
      <section className="bg-cream-soft border-y border-cream-line animate-fade-up" id="why-us">
        <div className="container-x py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Neden Biz?</p>
            <h2 className="display text-3xl md:text-4xl text-ink">
              Güvenle Yatırım Yapın
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Yerel Uzmanlık",
                desc: "Seferihisar ve çevresinde 15+ yıllık deneyimle bölgeyi en iyi biz tanırız.",
              },
              {
                title: "Doğrulanmış İlanlar",
                desc: "Her ilan ekibimiz tarafından kontrol edilir; tapu, imar ve değerleme bilgileri doğrulanır.",
              },
              {
                title: "Ücretsiz Danışmanlık",
                desc: "Yatırım kararınızda profesyonel destek alın — ilk görüşme her zaman ücretsizdir.",
              },
              {
                title: "Şeffaf Fiyatlandırma",
                desc: "Gizli komisyon yok. Tüm maliyetler net olarak paylaşılır.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white border border-cream-line hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-gold-deep" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">
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

      {/* ══════ BLOG / INSIGHTS ══════ */}
      <section className="container-x py-16 md:py-20" id="insights">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Blog & Rehber</p>
            <h2 className="display text-3xl md:text-4xl text-ink">
              Güncel Yazılar
            </h2>
          </div>
          <Link
            href="/blog"
            className="btn btn-outline mt-6 md:mt-0 self-start md:self-auto"
          >
            Tüm Yazıları Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* ══════ BOTTOM CTA ══════ */}
      <section className="bg-ink" id="bottom-cta">
        <div className="container-x py-16 md:py-24 text-center">
          <p className="eyebrow mb-4">Hemen İletişime Geçin</p>
          <h2 className="display text-3xl md:text-4xl lg:text-5xl text-fg-invert mb-6 max-w-2xl mx-auto">
            Hayalinizdeki Ege Yaşamına
            <br />
            <span className="text-gold">Bir Adım Kaldı</span>
          </h2>
          <p className="text-fg-invert-muted text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Villa, arsa veya yazlık yatırımınızda doğru kararı vermek için
            uzman ekibimizle tanışın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href={site.phoneHref} className="btn btn-gold">
              <Phone className="w-4 h-4" />
              {site.phone}
            </a>
            <Link href="/iletisim" className="btn btn-ghost">
              İletişim Formu
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
