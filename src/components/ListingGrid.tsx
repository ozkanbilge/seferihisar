import type { Listing } from "@/data/listings";
import { ListingCard } from "./ListingCard";

interface ListingGridProps {
  listings: Listing[];
  emptyMessage?: string;
}

export function ListingGrid({
  listings,
  emptyMessage = "Bu kriterlere uygun ilan bulunamadı.",
}: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16 bg-surface border border-gold/15 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 11 12 4l9 7M5 10v10h14V10" /><circle cx="12" cy="14" r="2.5" /><path d="M14 16l2.5 2.5" />
          </svg>
        </div>
        <p className="text-fg-muted text-sm max-w-xs mx-auto">{emptyMessage}</p>
        <div className="flex items-center justify-center gap-2.5 mt-5">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.slug} listing={listing} />
      ))}
    </div>
  );
}
