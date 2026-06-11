import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Altın elmas ayraçlı, taç ikonlu lüks gezinti şeridi */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6" id="breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
        <li>
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-fg-muted hover:text-gold-bright transition-colors"
          >
            {/* Mini taç */}
            <svg
              className="w-3.5 h-3.5 text-gold/70 group-hover:text-gold transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M4 17h16M5 15l1.5-8L11 12l1-7 1 7 4.5-5L19 15z" />
            </svg>
            Ana Sayfa
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-x-2.5 min-w-0">
              {/* Altın elmas ayraç */}
              <span
                className={`w-1 h-1 rotate-45 shrink-0 ${isLast ? "bg-gold" : "bg-gold/35"}`}
                aria-hidden
              />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-fg-muted hover:text-gold-bright transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-gold-deep truncate max-w-[180px] min-[420px]:max-w-[280px] sm:max-w-md">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {/* Altında sönümlenen altın çizgi */}
      <span className="block h-px mt-3 bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
    </nav>
  );
}
