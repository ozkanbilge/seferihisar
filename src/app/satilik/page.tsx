import { filterListings } from "@/lib/query";
import { getAllListings } from "@/lib/listings-store";
import { ListingGrid } from "@/components/ListingGrid";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Satılık Gayrimenkul İlanları",
  description:
    "Seferihisar ve çevresindeki satılık villa, arsa, daire, yazlık ve müstakil ev ilanları. Güncel fiyatlar ve detaylı portföy.",
  path: "/satilik",
});

export const dynamic = "force-dynamic";

export default async function SatilikPage() {
  const listings = filterListings({ transaction: "satilik" }, await getAllListings());

  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb items={[{ label: "Satılık" }]} />

      <div className="relative mb-10">
        <div className="absolute -top-10 right-0 w-[380px] h-[240px] rounded-full bg-gold/[0.05] blur-3xl animate-ambient pointer-events-none" />
        <div className="relative flex items-center gap-3 mb-3">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
          <p className="eyebrow">Satılık İlanlar</p>
          <span className="h-px w-14 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
        <h1 className="relative display text-3xl md:text-4xl text-fg mb-3">
          Satılık Gayrimenkul
        </h1>
        <p className="text-fg-muted text-sm max-w-2xl leading-relaxed">
          Seferihisar ve İzmir çevresindeki satılık villa, arsa, daire ve yazlık
          ilanlarını keşfedin. {listings.length} aktif portföy arasından
          hayalinizdeki mülkü bulun.
        </p>
        <div className="relative flex items-center gap-3 mt-4">
          <span className="h-px w-24 bg-gradient-to-r from-gold/50 to-transparent" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 text-[0.62rem] font-bold text-gold-deep uppercase tracking-[0.14em]">
            <span className="w-1 h-1 rotate-45 bg-gold" />
            {listings.length} Seçkin Portföy
          </span>
        </div>
      </div>

      <ListingGrid listings={listings} />

      <JsonLd
        data={[
          itemListSchema(listings, "Satılık Gayrimenkul İlanları"),
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Satılık", path: "/satilik" },
          ]),
        ]}
      />
    </div>
  );
}
