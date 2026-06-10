"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { districts } from "@/data/locations";
import { propertyTypes } from "@/data/property-types";

export function HeroSearch() {
  const router = useRouter();
  const [transaction, setTransaction] = useState<"satilik" | "kiralik">("satilik");
  const [districtSlug, setDistrictSlug] = useState("seferihisar");
  const [typeSlug, setTypeSlug] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (districtSlug) {
      if (typeSlug && typeSlug !== "all") {
        // Directs to programmatic SEO page, e.g. /izmir/seferihisar/satilik-villa
        router.push(`/izmir/${districtSlug}/${transaction}-${typeSlug}`);
      } else {
        // Directs to district page, e.g. /izmir/seferihisar
        router.push(`/izmir/${districtSlug}`);
      }
    } else {
      // Fallback to general satilik/kiralik page
      router.push(`/${transaction}`);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-5 shadow-2xl relative animate-fade-up" style={{ animationDelay: "0.4s" }}>
      {/* Transaction Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "satilik", label: "Satılık" },
          { id: "kiralik", label: "Kiralık" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTransaction(tab.id as any)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              transaction === tab.id
                ? "bg-gold text-ink shadow-[0_0_15px_rgba(192,160,98,0.3)]"
                : "bg-white/5 text-fg-invert-muted hover:bg-white/10 hover:text-fg-invert"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* District Select */}
        <div className="md:col-span-5 flex flex-col gap-1.5 px-3 py-2 bg-white/5 rounded-2xl border border-white/10 focus-within:border-gold/50 transition-colors">
          <label className="text-[0.62rem] font-bold text-gold uppercase tracking-wider">Bölge Seçin</label>
          <select
            value={districtSlug}
            onChange={(e) => setDistrictSlug(e.target.value)}
            className="bg-transparent text-sm text-fg-invert font-semibold focus:outline-none cursor-pointer w-full"
          >
            {districts.map((d) => (
              <option key={d.slug} value={d.slug} className="bg-ink-card text-fg-invert">
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Select */}
        <div className="md:col-span-4 flex flex-col gap-1.5 px-3 py-2 bg-white/5 rounded-2xl border border-white/10 focus-within:border-gold/50 transition-colors">
          <label className="text-[0.62rem] font-bold text-gold uppercase tracking-wider">Gayrimenkul Türü</label>
          <select
            value={typeSlug}
            onChange={(e) => setTypeSlug(e.target.value)}
            className="bg-transparent text-sm text-fg-invert font-semibold focus:outline-none cursor-pointer w-full"
          >
            <option value="all" className="bg-ink-card text-fg-invert">Tüm Türler</option>
            {propertyTypes.map((t) => (
              <option key={t.slug} value={t.slug} className="bg-ink-card text-fg-invert">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full btn btn-gold justify-center h-[52px] text-xs font-bold uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(192,160,98,0.25)] hover:shadow-[0_0_30px_rgba(192,160,98,0.4)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            İlanları Bul
          </button>
        </div>
      </form>
    </div>
  );
}
