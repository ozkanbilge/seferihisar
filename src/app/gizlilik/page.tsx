import { Breadcrumb } from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Gizlilik Politikası",
  description:
    "Private Estate gizlilik politikası: kişisel verilerinizin hangi amaçlarla işlendiği, nasıl korunduğu ve KVKK kapsamındaki haklarınız.",
  path: "/gizlilik",
});

export default function GizlilikPage() {
  return (
    <div className="container-x py-8 md:py-12">
      <Breadcrumb items={[{ label: "Gizlilik Politikası" }]} />

      <div className="max-w-3xl">
        <p className="eyebrow mb-3">Yasal</p>
        <h1 className="display text-2xl sm:text-3xl md:text-4xl text-fg mb-8">
          Gizlilik Politikası
        </h1>

        <div className="prose-article text-[0.95rem]">
          <p>
            {site.name} olarak ziyaretçilerimizin gizliliğine önem veriyoruz. Bu politika,
            web sitemizi kullandığınızda hangi kişisel verilerin toplandığını, hangi
            amaçlarla işlendiğini ve 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (KVKK) kapsamındaki haklarınızı açıklar.
          </p>

          <h2>Toplanan Veriler</h2>
          <ul>
            <li>
              <strong>İletişim formları ve randevu talepleri:</strong> Ad-soyad, telefon
              numarası ve mesaj içeriği — yalnızca talebinize geri dönüş yapmak amacıyla.
            </li>
            <li>
              <strong>Arsa değeri sorgulama:</strong> Girdiğiniz il/ilçe/mahalle ile ada
              ve parsel numaraları, hizmet kalitesi ve istatistik amacıyla kayıt altına
              alınır; kimliğinizle eşleştirilmez.
            </li>
            <li>
              <strong>Tarayıcı verileri:</strong> Dil ve tema tercihiniz cihazınızda
              (çerez/yerel depolama) saklanır; sunucularımıza aktarılmaz.
            </li>
          </ul>

          <h2>Verilerin Kullanımı</h2>
          <p>
            Toplanan veriler yalnızca gayrimenkul danışmanlığı hizmetinin sunulması,
            taleplerinize yanıt verilmesi ve yasal yükümlülüklerin yerine getirilmesi
            amacıyla kullanılır. Verileriniz üçüncü kişilere satılmaz ve pazarlama
            amacıyla paylaşılmaz.
          </p>

          <h2>Üçüncü Taraf Hizmetler</h2>
          <p>
            Arsa sorgulama aracı, Tapu ve Kadastro Genel Müdürlüğü&apos;nün (TKGM) halka
            açık Parsel Sorgu servisini kullanır. Döviz/altın kurları halka açık finans
            kaynaklarından alınır. WhatsApp üzerinden iletişimi siz başlattığınızda
            Meta&apos;nın gizlilik koşulları geçerlidir.
          </p>

          <h2>Veri Güvenliği ve Saklama</h2>
          <p>
            Verileriniz yetkisiz erişime karşı teknik ve idari tedbirlerle korunur;
            işleme amacı ortadan kalktığında silinir veya anonim hale getirilir.
          </p>

          <h2>KVKK Kapsamındaki Haklarınız</h2>
          <p>
            KVKK&apos;nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme,
            düzeltilmesini veya silinmesini talep etme ve işlemeye itiraz etme hakkına
            sahipsiniz. Talepleriniz için{" "}
            <a href={`mailto:${site.email}`} className="text-gold-deep hover:text-gold-bright font-semibold">
              {site.email}
            </a>{" "}
            adresine yazabilirsiniz.
          </p>

          <p>
            Bu politika gerektiğinde güncellenebilir. Sorularınız için bize{" "}
            <a href={site.phoneHref} className="text-gold-deep hover:text-gold-bright font-semibold">
              {site.phone}
            </a>{" "}
            numarasından ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
