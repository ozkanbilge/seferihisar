import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6" id="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
        <li>
          <Link href="/" className="hover:text-gold-bright transition-colors">
            Ana Sayfa
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ArrowRight className="w-3 h-3 text-cream-line" />
            {item.href ? (
              <Link href={item.href} className="hover:text-gold-bright transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-fg font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
