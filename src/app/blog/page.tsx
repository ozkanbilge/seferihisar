import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/BlogCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MiniBanner } from "@/components/MiniBanner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog & Rehberler",
  description:
    "Seferihisar gayrimenkul yatırım rehberleri, bölge analizleri, fiyat trendleri ve uzman görüşleri. Doğru yatırım kararları için bilgi merkezi.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb items={[{ label: "Blog" }]} />

      <div className="relative mb-8 md:mb-10">
        <div className="absolute -top-12 right-0 w-[420px] h-[260px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
        <div className="relative flex items-center gap-3 mb-3">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
          <p className="eyebrow">Blog &amp; Rehber</p>
          <span className="h-px w-14 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
        <h1 className="relative display text-2xl sm:text-3xl md:text-4xl text-fg mb-3">
          Güncel Yazılar
        </h1>
        <p className="text-fg-muted text-sm max-w-2xl leading-relaxed">
          Yatırım rehberleri, bölge analizleri ve fiyat trendleriyle doğru
          gayrimenkul kararlarınız için bilgi merkezi.
        </p>
        <div className="relative flex items-center gap-3 mt-4">
          <span className="h-px w-24 bg-gradient-to-r from-gold/50 to-transparent" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 text-[0.62rem] font-bold text-gold-deep uppercase tracking-[0.14em]">
            <span className="w-1 h-1 rotate-45 bg-gold" />
            {blogPosts.length} Yazı
          </span>
        </div>
      </div>

      {/* Öncelikli araç: arsa değeri sorgulama */}
      <div className="mb-8 md:mb-10">
        <MiniBanner type="land" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {blogPosts.map((post, i) => (
          <div key={post.slug} className={`relative ${i === 0 ? "sm:col-span-2" : ""}`}>
            {i === 0 && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink text-[0.6rem] font-bold uppercase tracking-[0.16em] shadow-[0_4px_14px_rgba(192,160,98,0.45)] whitespace-nowrap">
                <span className="w-1 h-1 rotate-45 bg-ink/60" />
                Editörün Seçimi
                <span className="w-1 h-1 rotate-45 bg-ink/60" />
              </span>
            )}
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
