# Private Estate — Seferihisar Emlak Platformu

İzmir / Seferihisar odaklı, kraliyet temalı lüks emlak platformu. Next.js 16 (App Router, Turbopack) ile geliştirilmiştir.

## Öne Çıkanlar

- **TKGM Arsa Değeri Sorgulama** — İl/ilçe/mahalle + ada/parsel ile resmî Parsel Sorgu servisinden canlı veri; gerçek parsel sınırının animasyonlu kadastro çizimi, emsal tabanlı değerleme ve %30 satış güvencesi gösterimi
- **Programatik SEO** — 30 İzmir ilçesi ve TKGM kaynaklı 1.150+ mahalle için ~17.700 statik sayfa (ilçe/mahalle × satılık-kiralık × 7 tür)
- **Admin Paneli** (`/admin`) — Anasayfa içerik editörü (3 dil), emsal fiyat tablosu, parsel sorgu logları, randevu yönetimi
- **Çok dil** — TR / EN / AR (RTL), çerez tabanlı; anasayfa içerikleri dil başına CMS'ten
- **Canlı piyasa şeridi** — USD/EUR/gram altın (altin.doviz.com/harem kaynağından, 2 dk önbellek)
- **Gece/Gündüz modu**, kraliyet tasarım dili (Cinzel, altın varak efektleri, taçlı PE arması)

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npx prisma generate          # src/generated/prisma
npm run dev                  # http://localhost:3000
```

### Ortam Değişkenleri

| Değişken | Açıklama |
|---|---|
| `ADMIN_KEY` | Admin API'lerinin sunucu tarafı anahtarı (boşsa API'ler kapalı) |
| `NEXT_PUBLIC_ADMIN_KEY` | Panelin API'ye gönderdiği anahtar (ADMIN_KEY ile aynı olmalı) |
| `NEXT_PUBLIC_ADMIN_EMAIL` / `NEXT_PUBLIC_ADMIN_PASSWORD` | Panel giriş bilgileri |
| `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` | (Opsiyonel) NextAuth/Prisma için Postgres |

## Mimari Notlar

- **İçerik deposu**: `data/*.json` (gitignore'da) — anasayfa içeriği, emsal fiyatları, parsel logları. Sunucu dosya sistemi gerektirir (Vercel serverless'ta kalıcı değildir; VPS/Node barındırma önerilir veya depo katmanı `src/lib/cms.ts` içinden bir veritabanına taşınabilir).
- **TKGM entegrasyonu**: `src/lib/tkgm.ts` — idari birim listeleri 24 saat, parsel sonuçları bellek içinde 24 saat önbelleklenir (TKGM'nin IP başına günlük sorgu limiti vardır).
- **Değerleme**: `src/lib/valuation.ts` — önce admin'in girdiği gerçek emsal (TL/m²), yoksa ilçe konut ortalamasından türetilmiş tahmin (×0,4 arsa oranı, ×0,8 pazarlık payı, ×1,3 satış güvencesi).
- **Mahalle verisi**: `src/data/locations.ts` elle yazılmış zengin içerik + `locations-extra.ts` (TKGM resmî listesi) birleşimi.

## Komutlar

```bash
npm run dev      # geliştirme
npm run build    # üretim build (~17.7k statik sayfa)
npm start        # üretim sunucusu
npx eslint src   # lint
```

## Dizin Özeti

```
src/app/            sayfalar + API route'ları (tkgm, parsel-sorgu, kur, admin/*)
src/components/     UI bileşenleri (admin/* dahil)
src/lib/            tkgm, valuation, cms, i18n, admin-auth
src/data/           statik veri (ilçe/mahalle, ilanlar, blog)
data/               çalışma zamanı JSON deposu (gitignore)
```
