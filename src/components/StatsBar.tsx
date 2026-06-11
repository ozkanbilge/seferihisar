import { districts, allNeighborhoods } from "@/data/locations";
import { propertyTypes } from "@/data/property-types";

/** Veri dosyalarından canlı türetilen gerçek rakamlar */
const stats = [
  { value: String(districts.length), label: "İlçe" },
  { value: `${allNeighborhoods.length}+`, label: "Mahalle" },
  { value: String(propertyTypes.length), label: "Gayrimenkul Türü" },
  { value: "15+", label: "Yıllık Deneyim" },
];

export function StatsBar() {
  return (
    <section className="relative z-10 mt-8 md:mt-10" id="stats-bar">
      <div className="container-x">
        <div className="rounded-2xl bg-ink border border-ink-line shadow-2xl px-6 py-7 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gold mb-1 font-[family-name:var(--font-display)]">
                  {stat.value}
                </div>
                <div className="text-xs text-fg-invert-muted tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
