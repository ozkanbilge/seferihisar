import { filterListings } from "@/lib/query";
import { ListingGrid } from "@/components/ListingGrid";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Kiralık Gayrimenkul İlanları",
  description:
    "Seferihisar ve çevresindeki kiralık daire, yazlık, müstakil ev ve villa ilanları. Güncel kira fiyatları ve detaylı portföy.",
  path: "/kiralik",
});

export default function KiralikPage() {
  const listings = filterListings({ transaction: "kiralik" });

  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb items={[{ label: "Kiralık" }]} />

      <div className="mb-10">
        <p className="eyebrow mb-3">Kiralık İlanlar</p>
        <h1 className="display text-3xl md:text-4xl text-ink mb-3">
          Kiralık Gayrimenkul
        </h1>
        <p className="text-fg-muted text-sm max-w-2xl leading-relaxed">
          Seferihisar ve İzmir çevresindeki kiralık daire, yazlık ve müstakil ev
          ilanlarını inceleyin. {listings.length} aktif portföy arasından size
          uygun konutu bulun.
        </p>
      </div>

      <ListingGrid listings={listings} />

      <JsonLd
        data={[
          itemListSchema(listings, "Kiralık Gayrimenkul İlanları"),
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Kiralık", path: "/kiralik" },
          ]),
        ]}
      />
    </div>
  );
}
