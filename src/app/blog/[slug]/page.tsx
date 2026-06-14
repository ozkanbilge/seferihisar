import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts, blogBySlug } from "@/data/blog";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MiniBanner } from "@/components/MiniBanner";
import { Phone } from "@/components/icons";
import { BlogCard } from "@/components/BlogCard";
import Link from "next/link";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { ViewCounter } from "@/components/ViewCounter";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = blogBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover,
    type: "article",
  });
}

export default async function BlogPostPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const post = blogBySlug(slug);
  if (!post) notFound();

  // Diğer yazılar: aynı kategori öncelikli
  const others = [
    ...blogPosts.filter((b) => b.slug !== post.slug && b.category === post.category),
    ...blogPosts.filter((b) => b.slug !== post.slug && b.category !== post.category),
  ].slice(0, 3);

  return (
    <article className="container-x py-8 md:py-12">
      <ReadingProgress />
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      {/* Header */}
      <header className="max-w-3xl mx-auto mb-8 md:mb-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-fg-muted mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink font-bold uppercase tracking-[0.14em] text-[0.6rem] shadow-[0_2px_10px_rgba(192,160,98,0.3)]">
            <span className="w-1 h-1 rotate-45 bg-ink/60" />
            {post.category}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          <span className="w-1 h-1 rotate-45 bg-gold/40" />
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
<ViewCounter slug={post.slug} count />
          </span>
        </div>

        <h1 className="display text-2xl sm:text-3xl md:text-[2.6rem] text-fg mb-5 leading-snug">
          {post.title}
        </h1>

        <div className="flex items-center justify-center gap-2.5 mb-5">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/55" />
          <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/55" />
        </div>

        <p className="text-sm md:text-base text-fg-muted leading-relaxed max-w-2xl mx-auto">
          {post.excerpt}
        </p>
      </header>

      {/* Öncelikli araç: arsa değeri sorgulama */}
      <div className="max-w-4xl mx-auto mb-8 md:mb-10">
        <MiniBanner type="land" />
      </div>

      {/* Cover Image — köşebentli altın çerçeve */}
      <div className="relative max-w-4xl mx-auto mb-8 md:mb-12 rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/50 via-gold/10 to-gold/40 shadow-[0_16px_44px_rgba(0,0,0,0.3)]">
        <span className="absolute top-2 left-2 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-10 pointer-events-none" aria-hidden />
        <span className="absolute top-2 right-2 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-10 pointer-events-none" aria-hidden />
        <span className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-10 pointer-events-none" aria-hidden />
        <span className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-gold/70 rounded-br z-10 pointer-events-none" aria-hidden />
        <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-ink-soft">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Body */}
      <div className="prose-article max-w-3xl mx-auto text-[0.95rem] md:text-base">
        {post.body.map((block, i) => {
          switch (block.type) {
            case "h2":
              return <h2 key={i}>{block.text}</h2>;
            case "p":
              return <p key={i}>{block.text}</p>;
            case "ul":
              return (
                <ul key={i}>
                  {block.items?.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Yazı sonu flörürü */}
      <div className="flex items-center justify-center gap-3 max-w-3xl mx-auto mt-12">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
        <span className="w-2 h-2 rotate-45 bg-gold" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
      </div>

      {/* Paylaşım */}
      <div className="max-w-3xl mx-auto mt-7">
        <ShareButtons title={post.title} />
      </div>

      {/* Yazar kartı — köşebentli kraliyet paneli */}
      <div className="max-w-3xl mx-auto mt-8">
        <div className="group relative rounded-[18px] p-[1.5px] bg-gradient-to-br from-gold/50 via-gold/10 to-gold/40 shadow-[0_16px_44px_rgba(0,0,0,0.22)]">
          <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-20 pointer-events-none" aria-hidden />
          <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-20 pointer-events-none" aria-hidden />
          <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-20 pointer-events-none" aria-hidden />
          <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-gold/70 rounded-br z-20 pointer-events-none" aria-hidden />
          <div className="relative rounded-2xl bg-surface overflow-hidden p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-5 text-center sm:text-left">
            {/* Hover'da süzülen altın hale */}
            <span className="absolute -top-12 right-1/4 w-56 h-32 rounded-full bg-gold/[0.06] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative shrink-0 self-center">
              <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-gold-deep via-gold to-gold-bright p-[2px] transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-ink flex items-center justify-center">
                  <span className="font-[family-name:var(--font-cinzel-deco)] font-bold text-2xl royal-text">
                    {site.agent.initials}
                  </span>
                </div>
              </div>
              {/* Taç rozeti */}
              <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-gold-deep via-gold to-gold-bright flex items-center justify-center border-2 border-surface shadow-[0_2px_8px_rgba(192,160,98,0.4)]">
                <svg className="w-3.5 h-3.5 text-ink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 17h16M5 15l1.5-8L11 12l1-7 1 7 4.5-5L19 15z" /></svg>
              </span>
            </div>

            <div className="relative flex-1 flex flex-col justify-center min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[0.58rem] text-gold uppercase tracking-[0.18em] font-bold mb-0.5 justify-center sm:justify-start">
                <span className="w-1 h-1 rotate-45 bg-gold" />
                Yazan
              </span>
              <h3 className="text-base md:text-lg font-bold text-fg font-[family-name:var(--font-cinzel)]">{site.agent.name}</h3>
              <p className="text-[0.7rem] text-gold-deep font-semibold mb-2">{site.agent.title}</p>
              {/* Flörür ayraç */}
              <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                <span className="h-px w-10 bg-gradient-to-r from-gold/50 to-transparent" />
                <span className="w-1 h-1 rotate-45 bg-gold/60" />
              </div>
              <p className="text-xs text-fg-muted leading-relaxed">
                {site.agent.memberSince}&apos;dan beri Seferihisar ve İzmir gayrimenkul piyasasında; yatırım danışmanlığı ve değerleme konularında uzman.
              </p>
            </div>

            <div className="relative flex sm:flex-col gap-2 justify-center self-center shrink-0">
              <a href={site.phoneHref} className="btn btn-gold text-[0.65rem] px-4 py-2 whitespace-nowrap">
                <Phone className="w-3.5 h-3.5" />
                Ara
              </a>
              <a href="https://wa.me/905323994291" target="_blank" rel="noopener noreferrer" className="btn btn-outline text-[0.65rem] px-4 py-2 whitespace-nowrap gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.88L2 22l5.3-1.29c1.4.78 3.01 1.22 4.7 1.22 5.52 0 10-4.48 10-10S17.524 2 12.004 2zm5.72 14.1c-.24.67-1.19 1.29-1.92 1.39-.49.07-1.12.11-3.23-.77-2.7-1.13-4.42-3.89-4.56-4.08-.13-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.32.24-.26.54-.32.71-.32h.51c.16 0 .38-.06.59.44.22.54.76 1.86.83 2 .07.14.12.31.02.51-.1.2-.21.32-.36.5-.15.18-.31.39-.45.52-.15.15-.31.31-.13.62.18.31.8 1.31 1.72 2.13.92.82 1.7 1.08 2.02 1.23.32.15.63.09.83-.05.21-.14 1.34-.63 1.57-.75.23-.12.38-.18.44-.29.06.11.06.64-.18 1.31z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Diğer Yazılar */}
      {others.length > 0 && (
        <section className="mt-12 md:mt-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-gold/40" />
            <h2 className="text-base md:text-lg font-bold text-fg font-[family-name:var(--font-cinzel)] uppercase tracking-[0.14em] flex items-center gap-2.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
              Diğer Yazılar
              <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
            </h2>
            <span className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {others.map((b) => (
              <BlogCard key={b.slug} post={b} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/blog" className="btn btn-outline group text-xs px-6">
              Tüm Yazılar
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </section>
      )}

      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
    </article>
  );
}
