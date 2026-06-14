"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { Phone } from "@/components/icons";
import { getClientLang, getDict, type Lang } from "@/lib/i18n";

interface TkgmItem {
  id: number;
  text: string;
}

interface ParselDetails {
  il: string;
  ilce: string;
  mahalle: string;
  ada: string;
  parsel: string;
  alan: number;
  alanText: string;
  nitelik: string;
  pafta: string;
  mevkii: string;
  zeminDurum: string;
  birimFiyat: number | null;
  fiyatKaynak: "emsal" | "tahmin" | null;
  tahminiDeger: number | null;
  garantiDeger: number | null;
  coordinates: { lat: number; lng: number } | null;
  ring: [number, number][];
  sorguNo: string;
}

/** TKGM parsel poligonunu 200x200 SVG alanına oturtur (nokta dizisiyle) */
function ringToSvg(ring: [number, number][]): { points: string; vertices: [number, number][] } {
  if (ring.length < 3) return { points: "", vertices: [] };
  const lngs = ring.map((p) => p[0]);
  const lats = ring.map((p) => p[1]);
  const minX = Math.min(...lngs);
  const maxY = Math.max(...lats);
  const w = Math.max(...lngs) - minX || 1e-9;
  const h = maxY - Math.min(...lats) || 1e-9;
  const scale = 160 / Math.max(w, h);
  const ox = (200 - w * scale) / 2;
  const oy = (200 - h * scale) / 2;
  const vertices = ring.map(
    ([x, y]) =>
      [Number((ox + (x - minX) * scale).toFixed(1)), Number((oy + (maxY - y) * scale).toFixed(1))] as [number, number]
  );
  return { points: vertices.map(([x, y]) => `${x},${y}`).join(" "), vertices };
}

/** Değerin 0'dan hedefe yumuşak sayarak yükselmesi */
function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format(display)}</>;
}

type ArsaContent = { eyebrow: string; title: string; subtitle: string; badges: string[] };

export function ArsaSorgula({ content }: { content?: ArsaContent } = {}) {
  const [lang, setLang] = useState<Lang>("tr");
  useEffect(() => setLang(getClientLang()), []);
  const t = getDict(lang).arsa;
  const head = {
    eyebrow: content?.eyebrow ?? t.eyebrow,
    title: content?.title ?? t.title,
    subtitle: content?.subtitle ?? t.subtitle,
    badges: content?.badges ?? ["TKGM Resmî Verisi", "Anında Sonuç", "%100 Ücretsiz"],
  };

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    il: "",
    ilce: "",
    mahalle: "",
    ada: "",
    parsel: "",
  });

  const [iller, setIller] = useState<TkgmItem[]>([]);
  const [ilceler, setIlceler] = useState<TkgmItem[]>([]);
  const [mahalleler, setMahalleler] = useState<TkgmItem[]>([]);
  const defaultsApplied = useRef(false);
  const resultPanelRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<ParselDetails | null>(null);
  const [error, setError] = useState("");

  // İl listesi (TKGM) — varsayılan İzmir
  useEffect(() => {
    fetch("/api/tkgm/iller")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list: TkgmItem[]) => {
        setIller(list);
        const izmir = list.find((i) => i.text === "İzmir");
        if (izmir) setFormData((f) => ({ ...f, il: String(izmir.id) }));
      })
      .catch(() => setError("TKGM il listesi yüklenemedi. Sayfayı yenileyin."));
  }, []);

  // İl değişince ilçeleri çek — ilk yüklemede Seferihisar seçili gelsin
  useEffect(() => {
    if (!formData.il) return;
    setIlceler([]);
    setMahalleler([]);
    setFormData((f) => ({ ...f, ilce: "", mahalle: "" }));
    fetch(`/api/tkgm/ilceler?il=${formData.il}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list: TkgmItem[]) => {
        setIlceler(list);
        if (!defaultsApplied.current) {
          const seferihisar = list.find((i) => i.text === "Seferihisar");
          if (seferihisar) {
            defaultsApplied.current = true;
            setFormData((f) => ({ ...f, ilce: String(seferihisar.id) }));
          }
        }
      })
      .catch(() => setError("TKGM ilçe listesi yüklenemedi."));
  }, [formData.il]);

  // İlçe değişince mahalleleri çek
  useEffect(() => {
    if (!formData.ilce) return;
    setMahalleler([]);
    setFormData((f) => ({ ...f, mahalle: "" }));
    fetch(`/api/tkgm/mahalleler?ilce=${formData.ilce}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list: TkgmItem[]) => {
        setMahalleler(list);
        if (list.length > 0) setFormData((f) => ({ ...f, mahalle: String(list[0].id) }));
      })
      .catch(() => setError("TKGM mahalle listesi yüklenemedi."));
  }, [formData.ilce]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.surname.trim() ||
      formData.phone.replace(/\D/g, "").length < 10 ||
      !formData.il || !formData.ilce || !formData.mahalle ||
      formData.ada === "" || formData.parsel === ""
    ) {
      setError(t.fillAll);
      return;
    }

    setError("");
    setLoading(true);
    setDetails(null);

    // Mobilde sonuç paneli formun altında kaldığı için sorguyla birlikte oraya kaydır
    if (window.innerWidth < 1024) {
      resultPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Seçilen idari birim adları (sunucu logu için)
    const ilAd = iller.find((i) => String(i.id) === formData.il)?.text || "";
    const ilceAd = ilceler.find((i) => String(i.id) === formData.ilce)?.text || "";
    const mahalleAd = mahalleler.find((m) => String(m.id) === formData.mahalle)?.text || "";

    try {
      const params = new URLSearchParams({
        mahalleId: formData.mahalle,
        ada: formData.ada,
        parsel: formData.parsel,
        il: ilAd,
        ilce: ilceAd,
        mah: mahalleAd,
        ad: `${formData.name.trim()} ${formData.surname.trim()}`,
        tel: formData.phone.trim(),
      });
      const res = await fetch(`/api/parsel-sorgu?${params}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || t.queryError);
      }
      setDetails(data);
      // Mobil alt bar üzerindeki "son sorguladığınız parsel" şeridi için
      try {
        localStorage.setItem(
          "lastParsel",
          JSON.stringify({
            il: data.il,
            ilce: data.ilce,
            mahalle: data.mahalle,
            ada: data.ada,
            parsel: data.parsel,
            tahminiDeger: data.tahminiDeger,
            ts: Date.now(),
          })
        );
        window.dispatchEvent(new CustomEvent("lastparsel-updated"));
      } catch {}
    } catch (err) {
      setError(err instanceof Error ? err.message : t.queryError);
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp yönlendirme fonksiyonu
  const handleWhatsAppRedirect = () => {
    if (!details) return;

    const kimden = [formData.name, formData.surname].filter(Boolean).join(" ") || "Web ziyaretçisi";
    const degerSatiri = details.tahminiDeger
      ? `\n💰 *Tahmini Değer:* ${formatPrice(details.tahminiDeger)}${
          details.garantiDeger
            ? `\n🛡️ *Private Estate Satış Garantisi (%30 üzeri):* ${formatPrice(details.garantiDeger)}`
            : ""
        }`
      : "";
    const message = `Merhaba Özkan Bey, web siteniz üzerinden yeni bir Arsa Değeri Sorgulama talebi yaptım. Bilgiler aşağıdadır:\n\n👤 *Talep Eden:* ${kimden}\n📞 *Telefon:* ${formData.phone || "-"}\n📍 *Bölge:* ${details.il} / ${details.ilce} / ${details.mahalle} Mah.\n🏗️ *Ada/Parsel:* ${details.ada} / ${details.parsel}\n📐 *Alan (TKGM):* ${details.alanText} m²\n🏷️ *Nitelik:* ${details.nitelik}${degerSatiri}\n⚙️ *Sorgu No:* ${details.sorguNo}\n\nDetaylı değerleme için geri dönüşünüzü rica ederim.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/905323994291?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const { points: parcelPoints, vertices: parcelVertices } = details
    ? ringToSvg(details.ring)
    : { points: "", vertices: [] };

  return (
    <section className="relative bg-ink-soft border-y border-ink-line scroll-mt-20 overflow-hidden" id="arsa-sorgulama">
      <div className="divider-gold" />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[320px] rounded-full bg-gold/[0.06] blur-3xl animate-ambient pointer-events-none" />
      <div className="absolute -bottom-16 right-0 w-[360px] h-[240px] rounded-full bg-emerald-accent/[0.04] blur-3xl animate-ambient pointer-events-none" style={{ animationDelay: "-6s" }} />
      <div className="container-x py-11 md:py-14 relative">
        <div className="max-w-3xl mx-auto text-center mb-8">
          {/* Ücretsiz rozeti */}
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-gold/30 bg-gold/[0.06] text-[0.58rem] font-bold text-gold uppercase tracking-[0.16em] mb-3">
            <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
            {head.eyebrow}
          </span>
          <h2 className="display text-2xl md:text-3xl mb-3">
            <span className="royal-text">{head.title}</span>
          </h2>
          <p className="text-fg-invert-muted text-sm leading-relaxed max-w-xl mx-auto mb-4">
            {head.subtitle}
          </p>
          {/* Güven mikro-rozetleri */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[0.6rem] text-fg-invert-muted/70">
            {head.badges.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  {[
                    <path key="0" d="M9 12l2 2 4-4M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z" />,
                    <g key="1"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></g>,
                    <path key="2" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
                  ][i % 3]}
                </svg>
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sorgu Formu */}
          <div className="lg:col-span-5 bg-ink-card border border-ink-line rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] rounded-t-2xl bg-gradient-to-r from-gold-deep via-gold-bright to-gold" />
            <h3 className="flex items-center gap-2.5 text-base font-bold text-fg-invert mb-6 font-[family-name:var(--font-cinzel)] uppercase tracking-[0.1em]">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
              {t.formTitle}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 arsa-form">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    {t.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ahmet"
                    className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert placeholder-fg-invert-muted/40 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    {t.surname}
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Yılmaz"
                    className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert placeholder-fg-invert-muted/40 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+90 5XX XXX XX XX"
                  className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert placeholder-fg-invert-muted/40 focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    {t.il}
                  </label>
                  <select
                    name="il"
                    value={formData.il}
                    onChange={handleChange}
                    disabled={iller.length === 0}
                    className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
                  >
                    {iller.length === 0 && <option value="">{t.loadingList}</option>}
                    {iller.map((i) => (
                      <option key={i.id} value={i.id} className="bg-ink-card text-fg-invert">
                        {i.text}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    {t.ilce}
                  </label>
                  <select
                    name="ilce"
                    value={formData.ilce}
                    onChange={handleChange}
                    disabled={ilceler.length === 0}
                    className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" className="bg-ink-card text-fg-invert">
                      {ilceler.length === 0 ? t.loadingList : t.select}
                    </option>
                    {ilceler.map((i) => (
                      <option key={i.id} value={i.id} className="bg-ink-card text-fg-invert">
                        {i.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                  {t.mahalle}
                </label>
                <select
                  name="mahalle"
                  value={formData.mahalle}
                  onChange={handleChange}
                  disabled={mahalleler.length === 0}
                  className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" className="bg-ink-card text-fg-invert">
                    {mahalleler.length === 0 ? t.selectFirst : t.select}
                  </option>
                  {mahalleler.map((m) => (
                    <option key={m.id} value={m.id} className="bg-ink-card text-fg-invert">
                      {m.text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    {t.ada}
                  </label>
                  <input
                    type="number"
                    name="ada"
                    min={0}
                    value={formData.ada}
                    onChange={handleChange}
                    placeholder="Örn: 4080"
                    className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert placeholder-fg-invert-muted/40 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    {t.parsel}
                  </label>
                  <input
                    type="number"
                    name="parsel"
                    min={1}
                    value={formData.parsel}
                    onChange={handleChange}
                    placeholder="Örn: 9"
                    className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert placeholder-fg-invert-muted/40 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-gold justify-center mt-6 text-sm font-bold uppercase tracking-wider h-12"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-ink" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t.submitting}
                  </span>
                ) : (
                  t.submit
                )}
              </button>
            </form>
          </div>

          {/* Sonuç Ekranı / Kadastro Haritası */}
          <div ref={resultPanelRef} className="lg:col-span-7 bg-ink-card border border-ink-line rounded-2xl p-6 md:p-8 shadow-2xl min-h-[440px] flex flex-col justify-center relative overflow-hidden scroll-mt-24">

            {/* Boş Durum */}
            {!loading && !details && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mx-auto mb-5 border border-gold/15">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-fg-invert mb-2 font-[family-name:var(--font-display)]">
                  {t.waitingTitle}
                </h4>
                <p className="text-sm text-fg-invert-muted max-w-sm mx-auto leading-relaxed">
                  {t.waitingText}
                </p>
              </div>
            )}

            {/* Yükleniyor Durumu */}
            {loading && (
              <div className="text-center py-12 space-y-6">
                <div className="relative w-40 h-40 mx-auto">
                  {/* Glowing Radar lines */}
                  <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full border border-gold/30 animate-pulse" />
                  <div className="absolute inset-0 border-t-2 border-gold rounded-full animate-spin" />
                  {/* Scanning Grid SVG inside */}
                  <div className="absolute inset-4 bg-gold/5 rounded-full flex items-center justify-center border border-gold/10">
                    <svg className="w-10 h-10 text-gold/70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25gA7.5 7.5 0 1119.5 10.5z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-fg-invert font-semibold text-base">{t.scanningTitle}</h4>
                  <p className="text-xs text-fg-invert-muted mt-1">{t.scanningText}</p>
                </div>
              </div>
            )}

            {/* Sonuç Raporu */}
            {!loading && details && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
                {/* Sol Taraf: Metrikler */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 animate-fade-up">
                    <span className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 stamp-in animate-glow">
                      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <div>
                      <span className="text-[0.65rem] text-gold uppercase tracking-widest font-semibold block mb-0.5">{t.found}</span>
                      <h4 className="display text-xl md:text-2xl text-fg-invert">
                        {details.mahalle} Mah. {details.ada}/{details.parsel}
                      </h4>
                      <span className="text-[0.62rem] text-fg-invert-muted/70 block">
                        {details.il} / {details.ilce} · Sorgu No: {details.sorguNo}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-ink-line animate-fade-up" style={{ animationDelay: "0.15s" }}>
                    <div>
                      <span className="text-[0.65rem] text-fg-invert-muted uppercase block">{t.area}</span>
                      <span className="text-base font-bold text-fg-invert">{details.alanText} m²</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-fg-invert-muted uppercase block">{t.quality}</span>
                      <span className="text-xs font-bold text-gold-bright line-clamp-2">{details.nitelik || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-fg-invert-muted uppercase block">{t.sheet}</span>
                      <span className="text-xs font-semibold text-fg-invert">{details.pafta || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-fg-invert-muted uppercase block">{t.ground}</span>
                      <span className="text-xs font-semibold text-fg-invert line-clamp-2">{details.zeminDurum || "—"}</span>
                    </div>
                    {details.mevkii && (
                      <div className="col-span-2">
                        <span className="text-[0.65rem] text-fg-invert-muted uppercase block">{t.location}</span>
                        <span className="text-xs font-semibold text-fg-invert">{details.mevkii}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-ink-line space-y-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                    {details.tahminiDeger && details.birimFiyat ? (
                      <>
                        {/* Tahmini değer — dönen ışık çerçeveli sayan panel */}
                        <div className="gold-ring relative rounded-2xl p-[1.5px] shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_24px_rgba(192,160,98,0.12)]">
                          {/* Sayım bitince saçılan altın kıvılcımlar */}
                          {[
                            { dx: "-26px", dy: "-30px", t: "8%", l: "12%" },
                            { dx: "30px", dy: "-24px", t: "4%", l: "82%" },
                            { dx: "-34px", dy: "16px", t: "70%", l: "6%" },
                            { dx: "28px", dy: "26px", t: "74%", l: "88%" },
                            { dx: "0px", dy: "-36px", t: "0%", l: "48%" },
                            { dx: "36px", dy: "0px", t: "42%", l: "96%" },
                          ].map((sp, i) => (
                            <span
                              key={i}
                              className="sparkle"
                              style={{
                                top: sp.t,
                                left: sp.l,
                                "--dx": sp.dx,
                                "--dy": sp.dy,
                                "--delay": `${1.5 + i * 0.08}s`,
                              } as React.CSSProperties}
                            />
                          ))}
                          <div className="rounded-[15px] bg-ink/85 px-4 py-3.5">
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="text-[0.62rem] text-fg-invert-muted uppercase tracking-wider">{t.estimated}</span>
                              <span className="text-[0.6rem] text-fg-invert-muted/60">{formatPrice(details.birimFiyat)} / m²</span>
                            </div>
                            <span className="block text-2xl md:text-[1.7rem] font-bold royal-text font-[family-name:var(--font-cinzel)] tracking-wide mt-1">
                              <CountUp value={details.tahminiDeger} format={formatPrice} />
                            </span>
                          </div>
                        </div>
                        {details.garantiDeger && (
                          <div className="p-3 rounded-xl border border-gold/30 bg-gold/5 animate-glow">
                            <span className="text-[0.65rem] text-gold-bright uppercase tracking-wider font-bold block mb-0.5">
                              {t.guarantee}
                            </span>
                            <span className="text-lg font-bold text-gold-bright block">
                              <CountUp value={details.garantiDeger} format={formatPrice} />
                            </span>
                            <span className="text-[0.62rem] text-fg-invert-muted leading-snug block mt-0.5">
                              {t.guaranteeText}
                            </span>
                          </div>
                        )}
                        <p className="text-[0.62rem] text-fg-invert-muted/70 leading-snug">
                          {t.contactDetail}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-fg-invert-muted leading-relaxed">
                        {t.noData}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full btn btn-gold gap-2.5 py-3 text-xs uppercase font-bold tracking-wider animate-fade-up"
                    style={{ animationDelay: "0.45s" }}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {t.whatsapp}
                  </button>
                </div>

                {/* Sağ Taraf: Gerçek Kadastro Çizimi (TKGM) — fareyle hafif 3B eğilir */}
                <div
                  className="flex flex-col bg-ink/75 border border-ink-line rounded-xl overflow-hidden min-h-[260px] relative transition-transform duration-300 ease-out will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                  onPointerMove={(e) => {
                    const el = e.currentTarget;
                    const r = el.getBoundingClientRect();
                    const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
                    const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
                    el.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
                  }}
                  onPointerLeave={(e) => {
                    e.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
                  }}
                >
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

                  <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                    {parcelPoints ? (
                      <svg className="w-full h-full max-h-[220px]" viewBox="0 0 200 200" fill="none">
                        <defs>
                          <linearGradient id="goldGradBg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c0a062" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#9c7f45" stopOpacity="0.06" />
                          </linearGradient>
                          <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#d8b978" stopOpacity="0" />
                            <stop offset="50%" stopColor="#d8b978" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#d8b978" stopOpacity="0" />
                          </linearGradient>
                          <clipPath id="parcelClip">
                            <polygon points={parcelPoints} />
                          </clipPath>
                        </defs>

                        {/* Dolgu: çizim bitince yumuşakça belirir */}
                        <polygon points={parcelPoints} fill="url(#goldGradBg)" className="parcel-fill" />

                        {/* Parsel içinde gezinen tarama ışını */}
                        <g clipPath="url(#parcelClip)">
                          <rect x="0" y="0" width="200" height="36" fill="url(#scanGrad)" className="scan-beam" />
                        </g>

                        {/* Sınır: kalemle çizilir gibi */}
                        <polygon
                          points={parcelPoints}
                          stroke="#c0a062"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          fill="none"
                          pathLength={100}
                          className="parcel-draw"
                        />

                        {/* Köşe noktaları sırayla belirir */}
                        {parcelVertices.map(([vx, vy], i) => (
                          <circle
                            key={i}
                            cx={vx}
                            cy={vy}
                            r="2.2"
                            fill="#d8b978"
                            stroke="#0e0f12"
                            strokeWidth="0.8"
                            className="vertex-pop"
                            style={{ animationDelay: `${0.2 + (i / Math.max(parcelVertices.length, 1)) * 1.4}s` }}
                          />
                        ))}

                        {/* Nefes alan merkez + artı işareti */}
                        <circle cx="100" cy="100" r="3" fill="#d8b978">
                          <animate attributeName="r" values="2.4;3.4;2.4" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                        <line x1="100" y1="82" x2="100" y2="118" stroke="#d8b978" strokeWidth="0.5" strokeDasharray="2 2" />
                        <line x1="82" y1="100" x2="118" y2="100" stroke="#d8b978" strokeWidth="0.5" strokeDasharray="2 2" />

                        {/* Teknik çizim köşe tikleri */}
                        {[
                          "M 6 16 V 6 H 16", "M 184 6 H 194 V 16",
                          "M 194 184 V 194 H 184", "M 16 194 H 6 V 184",
                        ].map((d, i) => (
                          <path key={i} d={d} stroke="#c0a062" strokeOpacity="0.5" strokeWidth="1" fill="none" />
                        ))}

                        {/* Kuzey oku */}
                        <g className="animate-fade-up" style={{ animationDelay: "1.2s" }}>
                          <circle cx="178" cy="26" r="11" fill="#0e0f12" fillOpacity="0.8" stroke="#c0a062" strokeOpacity="0.4" strokeWidth="0.6" />
                          <path d="M 178 19 L 181 29 L 178 27 L 175 29 Z" fill="#d8b978" />
                          <text x="178" y="34.5" textAnchor="middle" fill="#d8b978" fontSize="5.5" fontWeight="700" fontFamily="var(--font-sans)">N</text>
                        </g>

                        {/* Ölçek çubuğu */}
                        <g className="animate-fade-up" style={{ animationDelay: "1.4s" }}>
                          <line x1="14" y1="188" x2="54" y2="188" stroke="#d8b978" strokeWidth="1.2" />
                          <line x1="14" y1="185" x2="14" y2="191" stroke="#d8b978" strokeWidth="1.2" />
                          <line x1="34" y1="186" x2="34" y2="190" stroke="#d8b978" strokeWidth="0.8" />
                          <line x1="54" y1="185" x2="54" y2="191" stroke="#d8b978" strokeWidth="1.2" />
                        </g>

                        {/* Alan etiketi */}
                        <g className="animate-fade-up" style={{ animationDelay: "1.7s" }}>
                          <rect x="62" y="124" width="76" height="17" rx="8.5" fill="#0e0f12" fillOpacity="0.85" stroke="#c0a062" strokeOpacity="0.4" strokeWidth="0.6" />
                          <text x="100" y="135.5" textAnchor="middle" fill="#d8b978" fontSize="9" fontWeight="700" fontFamily="var(--font-sans)">
                            {details.alanText} m²
                          </text>
                        </g>
                      </svg>
                    ) : (
                      <p className="text-xs text-fg-invert-muted">{t.geomMissing}</p>
                    )}

                    {/* Coordinates Overlay */}
                    {details.coordinates && (
                      <div className="absolute bottom-2 left-2 text-[0.55rem] text-fg-invert-muted/70 font-mono">
                        LAT: {details.coordinates.lat.toFixed(5)}° N<br />
                        LNG: {details.coordinates.lng.toFixed(5)}° E
                      </div>
                    )}

                    <div className="absolute top-2 right-2 text-[0.55rem] text-gold font-mono tracking-wide flex items-center gap-1 border border-gold/20 bg-ink-card px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                      ADA: {details.ada} / PARSEL: {details.parsel}
                    </div>
                  </div>

                  {/* Footer of card */}
                  <div className="bg-ink-line/40 border-t border-ink-line py-2 px-3 flex justify-between items-center text-[0.62rem] text-fg-invert-muted">
                    <span>{t.source}</span>
                    <span className="text-gold font-semibold uppercase">{t.drawing}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
