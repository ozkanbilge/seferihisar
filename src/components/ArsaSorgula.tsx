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

/** TKGM parsel poligonunu 200x200 SVG alanına oturtur */
function ringToSvgPoints(ring: [number, number][]): string {
  if (ring.length < 3) return "";
  const lngs = ring.map((p) => p[0]);
  const lats = ring.map((p) => p[1]);
  const minX = Math.min(...lngs);
  const maxY = Math.max(...lats);
  const w = Math.max(...lngs) - minX || 1e-9;
  const h = maxY - Math.min(...lats) || 1e-9;
  const scale = 160 / Math.max(w, h);
  const ox = (200 - w * scale) / 2;
  const oy = (200 - h * scale) / 2;
  return ring
    .map(
      ([x, y]) =>
        `${(ox + (x - minX) * scale).toFixed(1)},${(oy + (maxY - y) * scale).toFixed(1)}`
    )
    .join(" ");
}

export function ArsaSorgula() {
  const [lang, setLang] = useState<Lang>("tr");
  useEffect(() => setLang(getClientLang()), []);
  const t = getDict(lang).arsa;

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
    if (!formData.il || !formData.ilce || !formData.mahalle || formData.ada === "" || formData.parsel === "") {
      setError(t.fillAll);
      return;
    }

    setError("");
    setLoading(true);
    setDetails(null);

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
            ? `\n🛡️ *Seferihisar Emlak Satış Garantisi (%30 üzeri):* ${formatPrice(details.garantiDeger)}`
            : ""
        }`
      : "";
    const message = `Merhaba Özkan Bey, web siteniz üzerinden yeni bir Arsa Değeri Sorgulama talebi yaptım. Bilgiler aşağıdadır:\n\n👤 *Talep Eden:* ${kimden}\n📞 *Telefon:* ${formData.phone || "-"}\n📍 *Bölge:* ${details.il} / ${details.ilce} / ${details.mahalle} Mah.\n🏗️ *Ada/Parsel:* ${details.ada} / ${details.parsel}\n📐 *Alan (TKGM):* ${details.alanText} m²\n🏷️ *Nitelik:* ${details.nitelik}${degerSatiri}\n⚙️ *Sorgu No:* ${details.sorguNo}\n\nDetaylı değerleme için geri dönüşünüzü rica ederim.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/905323994291?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const parcelPoints = details ? ringToSvgPoints(details.ring) : "";

  return (
    <section className="bg-ink-soft border-y border-ink-line scroll-mt-20" id="arsa-sorgulama">
      <div className="container-x py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="eyebrow mb-3">{t.eyebrow}</p>
          <h2 className="display text-3xl md:text-5xl text-fg-invert mb-4">
            {t.title}
          </h2>
          <p className="text-fg-invert-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sorgu Formu */}
          <div className="lg:col-span-5 bg-ink-card border border-ink-line rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gold via-gold-bright to-gold-deep" />
            <h3 className="text-lg font-semibold text-fg-invert mb-6 font-[family-name:var(--font-display)]">
              {t.formTitle}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="lg:col-span-7 bg-ink-card border border-ink-line rounded-2xl p-6 md:p-8 shadow-2xl min-h-[440px] flex flex-col justify-center relative overflow-hidden">

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
                  <div>
                    <span className="text-[0.65rem] text-gold uppercase tracking-widest font-semibold block mb-0.5">{t.found}</span>
                    <h4 className="display text-xl md:text-2xl text-fg-invert">
                      {details.mahalle} Mah. {details.ada}/{details.parsel}
                    </h4>
                    <span className="text-[0.62rem] text-fg-invert-muted/70 block">
                      {details.il} / {details.ilce} · Sorgu No: {details.sorguNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-ink-line">
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

                  <div className="pt-3 border-t border-ink-line space-y-2">
                    {details.tahminiDeger && details.birimFiyat ? (
                      <>
                        <div>
                          <span className="text-[0.65rem] text-fg-invert-muted uppercase block">{t.unitPrice}</span>
                          <span className="text-sm font-semibold text-fg-invert">{formatPrice(details.birimFiyat)}</span>
                        </div>
                        <div>
                          <span className="text-[0.65rem] text-fg-invert-muted uppercase block">{t.estimated}</span>
                          <span className="text-xl font-bold text-gold">{formatPrice(details.tahminiDeger)}</span>
                        </div>
                        {details.garantiDeger && (
                          <div className="mt-2 p-3 rounded-xl border border-gold/30 bg-gold/5 animate-glow">
                            <span className="text-[0.65rem] text-gold-bright uppercase tracking-wider font-bold block mb-0.5">
                              {t.guarantee}
                            </span>
                            <span className="text-lg font-bold text-gold-bright block">
                              {formatPrice(details.garantiDeger)}
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
                    className="w-full btn btn-gold gap-2.5 py-3 text-xs uppercase font-bold tracking-wider"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {t.whatsapp}
                  </button>
                </div>

                {/* Sağ Taraf: Gerçek Kadastro Çizimi (TKGM) */}
                <div className="flex flex-col bg-ink/75 border border-ink-line rounded-xl overflow-hidden min-h-[260px] relative">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

                  <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                    {parcelPoints ? (
                      <svg className="w-full h-full max-h-[220px]" viewBox="0 0 200 200" fill="none">
                        {/* Gerçek parsel sınırı (TKGM geometrisi) */}
                        <polygon
                          points={parcelPoints}
                          stroke="#c0a062"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          fill="url(#goldGradBg)"
                          className="animate-pulse"
                        />

                        {/* Center Point */}
                        <circle cx="100" cy="100" r="3" fill="#d8b978" />
                        <line x1="100" y1="80" x2="100" y2="120" stroke="#d8b978" strokeWidth="0.5" strokeDasharray="2 2" />
                        <line x1="80" y1="100" x2="120" y2="100" stroke="#d8b978" strokeWidth="0.5" strokeDasharray="2 2" />

                        {/* Map gradient */}
                        <defs>
                          <linearGradient id="goldGradBg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c0a062" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#9c7f45" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
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
