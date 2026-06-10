"use client";

import { useState } from "react";
import { primaryDistrict } from "@/data/locations";
import { formatPrice } from "@/lib/format";
import { Phone } from "@/components/icons";

interface ParselDetails {
  ada: number;
  parsel: number;
  mahalle: string;
  alan: number;
  imarDurumu: string;
  birimFiyat: number;
  tahminiDeger: number;
  sorguNo: string;
  coordinates: { lat: number; lng: number };
}

export function ArsaSorgula() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    mahalle: primaryDistrict.neighborhoods[0].slug,
    ada: "",
    parsel: "",
  });

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<ParselDetails | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.phone || !formData.ada || !formData.parsel) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    setError("");
    setLoading(true);
    setDetails(null);

    try {
      // API çağrısı
      const res = await fetch(
        `/api/parsel-sorgu?ada=${formData.ada}&parsel=${formData.parsel}&mahalle=${formData.mahalle}`
      );
      if (!res.ok) {
        throw new Error("Sorgulama başarısız oldu.");
      }
      const data = await res.json();
      
      // Şık bir taranma animasyonu hissi için 1.5 saniye bekletme
      setTimeout(() => {
        setDetails(data);
        setLoading(false);
      }, 1500);
    } catch (err: any) {
      setError("Sorgulama esnasında bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  // WhatsApp yönlendirme fonksiyonu
  const handleWhatsAppRedirect = () => {
    if (!details) return;

    const message = `Merhaba Özkan Bey, web siteniz üzerinden yeni bir Arsa Değeri Sorgulama talebi yaptım. Bilgiler aşağıdadır:\n\n👤 *Talep Eden:* ${formData.name} ${formData.surname}\n📞 *Telefon:* ${formData.phone}\n📍 *Bölge:* Seferihisar / ${details.mahalle} Mah.\n🏗️ *Ada/Parsel:* ${details.ada} / ${details.parsel}\n📐 *Hesaplanan Alan:* ${details.alan} m²\n🚧 *İmar Durumu:* ${details.imarDurumu}\n💰 *Tahmini Değer:* ${formatPrice(details.tahminiDeger)}\n⚙️ *Sorgu No:* ${details.sorguNo}\n\nDetaylı değerleme için geri dönüşünüzü rica ederim.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/905323994291?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className="bg-ink-soft border-y border-ink-line scroll-mt-20" id="arsa-sorgulama">
      <div className="container-x py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="eyebrow mb-3">Ücretsiz Emlak Aracı</p>
          <h2 className="display text-3xl md:text-5xl text-fg-invert mb-4">
            Anlık Arsa Değeri Sorgula
          </h2>
          <p className="text-fg-invert-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Seferihisar mahallelerinde yer alan arsanızın ada ve parsel numarasını girin, tahmini piyasa değerini ve imar yapısını anında simüle edin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sorgu Formu */}
          <div className="lg:col-span-5 bg-ink-card border border-ink-line rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gold via-gold-bright to-gold-deep" />
            <h3 className="text-lg font-semibold text-fg-invert mb-6 font-[family-name:var(--font-display)]">
              Sorgulama Formu
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    Adınız
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
                    Soyadınız
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
                  Telefon Numaranız
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

              <div>
                <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                  Mahalle
                </label>
                <select
                  name="mahalle"
                  value={formData.mahalle}
                  onChange={handleChange}
                  className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {primaryDistrict.neighborhoods.map((n) => (
                    <option key={n.slug} value={n.slug} className="bg-ink-card text-fg-invert">
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    Ada
                  </label>
                  <input
                    type="number"
                    name="ada"
                    value={formData.ada}
                    onChange={handleChange}
                    placeholder="Örn: 104"
                    className="w-full bg-ink/50 border border-ink-line rounded-xl px-4 py-3 text-sm text-fg-invert placeholder-fg-invert-muted/40 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg-invert-muted mb-1.5 uppercase tracking-wide">
                    Parsel
                  </label>
                  <input
                    type="number"
                    name="parsel"
                    value={formData.parsel}
                    onChange={handleChange}
                    placeholder="Örn: 12"
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
                    TKGM Simülasyonu Taranıyor...
                  </span>
                ) : (
                  "Hızlı Değer Sorgula"
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
                  Değer Raporu Bekleniyor
                </h4>
                <p className="text-sm text-fg-invert-muted max-w-sm mx-auto leading-relaxed">
                  Lütfen sol taraftaki formu doldurarak parsel sorgusunu başlatın. Değerleme raporu ve kadastro harita simülasyonu burada belirecektir.
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
                  <h4 className="text-fg-invert font-semibold text-base">TKGM Kadastro Veritabanı Taranıyor</h4>
                  <p className="text-xs text-fg-invert-muted mt-1">Seferihisar koordinatlarında ada/parsel sınırları saptanıyor...</p>
                </div>
              </div>
            )}

            {/* Sonuç Raporu */}
            {!loading && details && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
                {/* Sol Taraf: Metrikler */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[0.65rem] text-gold uppercase tracking-widest font-semibold block mb-0.5">Sorgulama Başarılı</span>
                    <h4 className="display text-xl md:text-2xl text-fg-invert">
                      {details.mahalle} Mah. {details.ada}/{details.parsel}
                    </h4>
                    <span className="text-[0.62rem] text-fg-invert-muted/70 block">Sorgu No: {details.sorguNo}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-ink-line">
                    <div>
                      <span className="text-[0.65rem] text-fg-invert-muted uppercase block">Hesaplanan Alan</span>
                      <span className="text-base font-bold text-fg-invert">{details.alan} m²</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-fg-invert-muted uppercase block">İmar Durumu</span>
                      <span className="text-xs font-bold text-gold-bright line-clamp-2">{details.imarDurumu}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-ink-line space-y-2">
                    <div>
                      <span className="text-[0.65rem] text-fg-invert-muted uppercase block">Ort. Arsa m² Fiyatı</span>
                      <span className="text-sm font-semibold text-fg-invert">{formatPrice(details.birimFiyat)}</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-fg-invert-muted uppercase block">Tahmini Toplam Piyasa Değeri</span>
                      <span className="text-xl font-bold text-gold">{formatPrice(details.tahminiDeger)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full btn btn-gold gap-2.5 py-3 text-xs uppercase font-bold tracking-wider"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Bana Bildir & WhatsApp İletişim
                  </button>
                </div>

                {/* Sağ Taraf: Kadastro Haritası Simülasyonu */}
                <div className="flex flex-col bg-ink/75 border border-ink-line rounded-xl overflow-hidden min-h-[260px] relative">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                  
                  {/* Cadastral lines SVG drawing */}
                  <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                    <svg className="w-full h-full max-h-[220px]" viewBox="0 0 200 200" fill="none">
                      {/* Surrounding parcels (gray outlines) */}
                      <polygon points="10,20 60,10 80,45 25,60" stroke="#2a2e37" strokeWidth="1" fill="#14161b" fillOpacity="0.4" />
                      <polygon points="80,45 130,30 150,75 90,90" stroke="#2a2e37" strokeWidth="1" fill="#14161b" fillOpacity="0.4" />
                      <polygon points="25,60 90,90 70,160 15,120" stroke="#2a2e37" strokeWidth="1" fill="#14161b" fillOpacity="0.4" />
                      
                      {/* Target parcel (Glowing gold) */}
                      <polygon 
                        points="90,90 150,75 180,140 110,160" 
                        stroke="#c0a062" 
                        strokeWidth="2.5" 
                        fill="url(#goldGradBg)"
                        className="animate-pulse"
                      />
                      
                      {/* Center Point */}
                      <circle cx="132" cy="116" r="3" fill="#d8b978" />
                      <line x1="132" y1="96" x2="132" y2="136" stroke="#d8b978" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="112" y1="116" x2="152" y2="116" stroke="#d8b978" strokeWidth="0.5" strokeDasharray="2 2" />

                      {/* Map gradient */}
                      <defs>
                        <linearGradient id="goldGradBg" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#c0a062" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#9c7f45" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Coordinates Overlay */}
                    <div className="absolute bottom-2 left-2 text-[0.55rem] text-fg-invert-muted/70 font-mono">
                      LAT: {details.coordinates.lat.toFixed(5)}° N<br />
                      LNG: {details.coordinates.lng.toFixed(5)}° E
                    </div>

                    <div className="absolute top-2 right-2 text-[0.55rem] text-gold font-mono tracking-wide flex items-center gap-1 border border-gold/20 bg-ink-card px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                      ADA: {details.ada} / PARSEL: {details.parsel}
                    </div>
                  </div>

                  {/* Footer of card */}
                  <div className="bg-ink-line/40 border-t border-ink-line py-2 px-3 flex justify-between items-center text-[0.62rem] text-fg-invert-muted">
                    <span>Ölçek: 1/1500</span>
                    <span className="text-gold font-semibold uppercase">Tapu Kadastro Kadastral Çizim</span>
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
