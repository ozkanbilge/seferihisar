import { filterListings } from "@/lib/query";
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

export default function SatilikPage() {
  const listings = filterListings({ transaction: "satilik" });

  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb items={[{ label: "Satılık" }]} />

      <div className="mb-10">
        <p className="eyebrow mb-3">Satılık İlanlar</p>
        <h1 className="display text-3xl md:text-4xl text-fg mb-3">
          Satılık Gayrimenkul
        </h1>
        <p className="text-fg-muted text-sm max-w-2xl leading-relaxed">
          Seferihisar ve İzmir çevresindeki satılık villa, arsa, daire ve yazlık
          ilanlarını keşfedin. {listings.length} aktif portföy arasından
          hayalinizdeki mülkü bulun.
        </p>
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
