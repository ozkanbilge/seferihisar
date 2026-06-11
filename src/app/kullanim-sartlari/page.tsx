import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Kullanım Şartları",
  description:
    "Private Estate web sitesi kullanım şartları: ilan bilgileri, arsa değerleme aracı ve sorumluluk sınırlarına ilişkin koşullar.",
  path: "/kullanim-sartlari",
});

export default function KullanimSartlariPage() {
  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb items={[{ label: "Kullanım Şartları" }]} />

      <div className="max-w-3xl">
        <p className="eyebrow mb-3">Yasal</p>
        <h1 className="display text-2xl sm:text-3xl md:text-4xl text-fg mb-8">
          Kullanım Şartları
        </h1>

        <div className="prose-article text-[0.95rem]">
          <p>
            Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
            Lütfen siteyi kullanmadan önce bu koşulları dikkatlice okuyunuz.
          </p>

          <h2>Hizmetin Kapsamı</h2>
          <p>
            {site.name}, İzmir ve çevresindeki gayrimenkullere ilişkin ilan, bölge
            rehberi ve danışmanlık içerikleri sunan bir emlak platformudur. Sitedeki
            içerikler bilgilendirme amaçlıdır ve resmi belge niteliği taşımaz.
          </p>

          <h2>İlan Bilgileri</h2>
          <p>
            İlanlardaki fiyat, metrekare ve diğer özellikler ilan sahiplerinden ve
            saha çalışmalarımızdan derlenir; özen gösterilmekle birlikte güncelliği
            ve doğruluğu garanti edilmez. Satın alma kararı öncesinde tapu, imar ve
            fiili durumun yetkili kurumlar nezdinde teyit edilmesi alıcının
            sorumluluğundadır.
          </p>

          <h2>Arsa Değeri Sorgulama Aracı</h2>
          <p>
            Arsa sorgulama aracı, TKGM&apos;nin halka açık verilerini ve bölgesel emsal
            ortalamalarını kullanır. Gösterilen <strong>tahmini piyasa değeri</strong>{" "}
            bağlayıcı bir değerleme raporu değildir; yalnızca ön fikir vermek amacıyla
            sunulur. Resmî değerleme için SPK lisanslı değerleme kuruluşlarına
            başvurulmalıdır. &quot;Satış güvencesi&quot; ifadeleri, karşılıklı sözleşme ile
            yazılı hale getirilmedikçe taahhüt niteliği taşımaz.
          </p>

          <h2>Fikri Mülkiyet</h2>
          <p>
            Sitedeki logo, tasarım, metin ve görseller {site.name}&apos;e aittir; yazılı
            izin olmaksızın kopyalanamaz ve ticari amaçla kullanılamaz.
          </p>

          <h2>Sorumluluk Sınırı</h2>
          <p>
            {site.name}, sitenin kesintisiz çalışacağını garanti etmez; üçüncü taraf
            servislerden (TKGM, kur kaynakları vb.) kaynaklanan hata veya kesintilerden
            sorumlu tutulamaz. Site içeriğine dayanılarak alınan kararlardan doğan
            zararlardan, kasıt veya ağır kusur halleri dışında sorumluluk kabul edilmez.
          </p>

          <h2>Değişiklikler</h2>
          <p>
            Bu şartlar önceden bildirim yapılmaksızın güncellenebilir. Güncel sürüm her
            zaman bu sayfada yayınlanır. Sorularınız için{" "}
            <a href={`mailto:${site.email}`} className="text-gold-deep hover:text-gold-bright font-semibold">
              {site.email}
            </a>{" "}
            adresinden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
