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
      <div className="text-center py-16">
        <p className="text-fg-muted text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.slug} listing={listing} />
      ))}
    </div>
  );
}
