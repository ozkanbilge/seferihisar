"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { districts } from "@/data/locations";
import { propertyTypes } from "@/data/property-types";
import { MapPin, Search, Check } from "@/components/icons";

interface Option {
  value: string;
  label: string;
}

/**
 * Temaya uygun özel açılır liste: yazarak filtreleme, klavyeyle gezinme
 * (ok tuşları + Enter), dışarı tıklama/ESC ile kapanma.
 */
function LuxeSelect({
  label,
  icon,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Açılınca seçiliyi vurgula
  useEffect(() => {
    if (!open) return;
    const selIdx = options.findIndex((o) => o.value === value);
    setHighlight(selIdx >= 0 ? selIdx : 0);

    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open, options, value]);

  // Vurgulanan öğeyi görünür tut
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${highlight}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[highlight]) select(options[highlight].value);
    }
  };

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="group w-full flex items-center gap-3 pl-5 pr-4 py-4 cursor-pointer text-left transition-colors duration-300 hover:bg-gold/[0.04]"
      >
        <span className="w-9 h-9 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-gold/15 group-hover:border-gold/30">
          {icon}
        </span>
        <span className="flex flex-col gap-0.5 w-full min-w-0">
          <span className="text-[0.6rem] font-bold text-gold/80 uppercase tracking-[0.18em]">{label}</span>
          <span className="text-[0.9rem] text-fg-invert font-semibold truncate">
            {selected?.label ?? "Seçiniz"}
          </span>
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gold/70 shrink-0 transition-transform duration-300 group-hover:text-gold ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-2 right-2 top-[calc(100%+10px)] z-40 rounded-2xl border border-gold/25 bg-ink-card shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_24px_rgba(192,160,98,0.1)] overflow-hidden animate-fade-up"
          style={{ animationDuration: "0.25s" }}
        >
          <div className="h-[2px] bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep" />

          <ul ref={listRef} className="max-h-60 overflow-y-auto py-1.5">
            {options.map((o, idx) => {
              const isSel = o.value === value;
              const isHl = idx === highlight;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    data-idx={idx}
                    onMouseEnter={() => setHighlight(idx)}
                    onClick={() => select(o.value)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
                      isSel
                        ? "text-gold bg-gold/10 font-semibold"
                        : isHl
                        ? "text-gold-bright bg-gold/[0.06]"
                        : "text-fg-invert-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rotate-45 shrink-0 ${isSel ? "bg-gold" : "bg-gold/20"}`} />
                      {o.label}
                    </span>
                    {isSel && <Check className="w-3.5 h-3.5 text-gold shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [transaction, setTransaction] = useState<"satilik" | "kiralik">("satilik");
  const [districtSlug, setDistrictSlug] = useState("seferihisar");
  const [typeSlug, setTypeSlug] = useState("all");

  const buildHref = () => {
    if (!districtSlug) return `/${transaction}`;
    if (typeSlug !== "all") return `/izmir/${districtSlug}/${transaction}-${typeSlug}`;
    return `/izmir/${districtSlug}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildHref());
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Satılık / Kiralık — kayan altın göstergeli sekme grubu */}
      <div className="flex justify-center mb-6">
        <div className="relative grid grid-cols-2 p-1 rounded-full border border-gold/25 bg-ink/70 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_14px_rgba(0,0,0,0.35)]">
          <span
            className={`absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright shadow-[0_2px_14px_rgba(192,160,98,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              transaction === "kiralik" ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-1"
            }`}
            style={{ left: 0 }}
          />
          {[
            { id: "satilik", label: "Satılık" },
            { id: "kiralik", label: "Kiralık" },
          ].map((tab) => {
            const active = transaction === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTransaction(tab.id as "satilik" | "kiralik")}
                className={`relative z-10 flex items-center justify-center gap-2 px-8 py-2 rounded-full text-[0.68rem] font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  active ? "text-ink" : "text-fg-invert-muted hover:text-gold-bright"
                }`}
              >
                {active && <span className="w-1.5 h-1.5 rotate-45 bg-ink/70" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tek parça lüks arama barı — dönen altın ışık çerçevesi */}
      <form
        onSubmit={handleSearch}
        className="gold-ring relative rounded-[28px] md:rounded-full p-[1.5px] shadow-[0_18px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(192,160,98,0.08)] transition-shadow duration-500 hover:shadow-[0_18px_50px_rgba(0,0,0,0.55),0_0_44px_rgba(192,160,98,0.16)] focus-within:shadow-[0_18px_50px_rgba(0,0,0,0.55),0_0_44px_rgba(192,160,98,0.2)]"
      >
        <div className="flex flex-col md:flex-row items-stretch rounded-[27px] md:rounded-full bg-ink-card/95 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* Bölge — yazarak aranabilir */}
          <LuxeSelect
            label="Bölge"
            className="flex-[1.2]"
            value={districtSlug}
            onChange={setDistrictSlug}
            icon={<MapPin className="w-4 h-4 text-gold" />}
            options={districts.map((d) => ({ value: d.slug, label: d.name }))}
          />

          {/* İnce altın ayraç */}
          <span className="hidden md:block w-px self-stretch my-3 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
          <span className="md:hidden h-px mx-6 bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

          {/* Tür */}
          <LuxeSelect
            label="Gayrimenkul Türü"
            className="flex-1"
            value={typeSlug}
            onChange={setTypeSlug}
            icon={
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
              </svg>
            }
            options={[
              { value: "all", label: "Tüm Türler" },
              ...propertyTypes.map((t) => ({ value: t.slug, label: t.name })),
            ]}
          />

          {/* Buton — canlı ilan sayısı rozetli */}
          <div className="p-2 md:p-1.5 flex items-stretch">
            <button
              type="submit"
              className="btn btn-gold group/btn w-full md:w-auto justify-center pl-6 pr-5 text-[0.68rem] font-bold uppercase tracking-[0.18em] rounded-[20px] md:rounded-full whitespace-nowrap"
            >
              <Search className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
              İlanları Bul
            </button>
          </div>
        </div>
      </form>

      {/* Hızlı arama çipleri — son arama + popüler aramalar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        <span className="text-[0.6rem] text-fg-invert-muted/60 uppercase tracking-[0.16em] mr-1">Popüler Aramalar:</span>
        {[
          { label: "Villa · Seferihisar", href: "/izmir/seferihisar/satilik-villa" },
          { label: "Arsa · Seferihisar", href: "/izmir/seferihisar/satilik-arsa" },
          { label: "Yazlık · Urla", href: "/izmir/urla/satilik-yazlik" },
          { label: "Daire · Çeşme", href: "/izmir/cesme/satilik-daire" },
        ].map((chip) => (
          <button
            key={chip.href}
            type="button"
            onClick={() => router.push(chip.href)}
            className="px-3.5 py-1.5 rounded-full border border-gold/20 bg-ink/40 text-[0.65rem] font-semibold text-fg-invert-muted hover:text-gold-bright hover:border-gold/50 hover:shadow-[0_0_14px_rgba(192,160,98,0.15)] transition-all duration-300"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Güven satırı */}
      <p className="text-center text-[0.6rem] text-fg-invert-muted/50 tracking-[0.14em] uppercase mt-4">
        30 İlçe · Doğrulanmış İlanlar · Ücretsiz Danışmanlık
      </p>
    </div>
  );
}
