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
      className="group relative block rounded-2xl overflow-hidden card-luxe hover-lift"
      id={`blog-${post.slug}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Köşebentler — hover'da belirir */}
        <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-gold/70 rounded-tl z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden />
        <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-gold/70 rounded-tr z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden />
        <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-gold/70 rounded-bl z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden />
        <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-gold/70 rounded-br z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden />

        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={eager ? "eager" : undefined}
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
        {/* Hover ışık süpürmesi */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" aria-hidden />

        {/* Kategori — cam rozet */}
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/55 backdrop-blur-md border border-gold/30 text-gold-bright text-[0.58rem] font-bold uppercase tracking-wider">
          <span className="w-1 h-1 rotate-45 bg-gold" />
          {post.category}
        </span>
        {/* Okuma süresi */}
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink/55 backdrop-blur-md border border-white/10 text-fg-invert text-[0.58rem] font-semibold">
          {post.readingMinutes} dk
        </span>
      </div>

      <div className="relative p-5">
        <div className="flex items-center gap-2.5 text-xs text-fg-muted mb-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="w-1 h-1 rotate-45 bg-gold/50" />
          <span><ViewCounter slug={post.slug} /></span>
        </div>

        <h3 className="text-base font-bold text-fg leading-snug line-clamp-2 mb-3 group-hover:text-gold-deep transition-colors">
          {post.title}
        </h3>

        <p className="text-xs text-fg-muted leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-deep uppercase tracking-[0.1em] group-hover:text-gold transition-colors">
          Devamını Oku
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>

        {/* Alt altın aksan — hover'da uzar */}
        <span className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-gold/55 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" aria-hidden />
      </div>
    </Link>
  );
}
