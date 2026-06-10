import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/BlogCard";
import { Breadcrumb } from "@/components/Breadcrumb";
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

      <div className="mb-10">
        <p className="eyebrow mb-3">Blog & Rehber</p>
        <h1 className="display text-3xl md:text-4xl text-ink mb-3">
          Güncel Yazılar
        </h1>
        <p className="text-fg-muted text-sm max-w-2xl leading-relaxed">
          Yatırım rehberleri, bölge analizleri ve fiyat trendleriyle doğru
          gayrimenkul kararlarınız için bilgi merkezi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
