import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "@/components/icons";
import { ViewCounter } from "@/components/ViewCounter";

export function BlogCard({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl overflow-hidden bg-surface border border-cream-line hover:border-gold/30 hover-lift"
      id={`blog-${post.slug}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={eager ? "eager" : undefined}
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gold/90 text-ink text-[0.6rem] font-bold uppercase tracking-wider">
          {post.category}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-fg-muted mb-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="w-1 h-1 rounded-full bg-cream-line" />
          <span><ViewCounter slug={post.slug} /></span>
        </div>

        <h3 className="text-base font-semibold text-fg leading-snug line-clamp-2 mb-3 group-hover:text-gold-bright transition-colors">
          {post.title}
        </h3>

        <p className="text-xs text-fg-muted leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-deep group-hover:text-gold transition-colors">
          Devamını Oku
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
