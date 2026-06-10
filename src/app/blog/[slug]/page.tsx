import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts, blogBySlug } from "@/data/blog";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
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

  return (
    <article className="container-x py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      {/* Header */}
      <header className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center gap-3 text-xs text-fg-muted mb-4">
          <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold-deep font-semibold uppercase tracking-wider">
            {post.category}
          </span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="w-1 h-1 rounded-full bg-cream-line" />
          <span>{post.readingMinutes} dk okuma</span>
        </div>

        <h1 className="display text-3xl md:text-4xl text-ink mb-6 leading-snug">
          {post.title}
        </h1>

        <p className="text-base text-fg-muted leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* Cover Image */}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12 max-w-4xl mx-auto">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover"
          priority
        />
      </div>

      {/* Body */}
      <div className="prose-article max-w-3xl mx-auto">
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
