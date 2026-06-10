export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Yatırım Rehberi" | "Bölge Rehberi" | "Fiyat Analizleri";
  cover: string;
  date: string; // ISO
  readingMinutes: number;
  /** Basit paragraf/başlık dizisi */
  body: { type: "h2" | "p" | "ul"; text?: string; items?: string[] }[];
}

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const blogPosts: BlogPost[] = [
  {
    slug: "seferihisar-yatirim-rehberi-2026",
    title: "Seferihisar Yatırım Rehberi 2026: Nereden Başlamalı?",
    excerpt:
      "Cittaslow unvanlı Seferihisar'da arsa, villa ve yazlık yatırımının inceliklerini, hangi mahallenin öne çıktığını ve 2026 beklentilerini bu rehberde topladık.",
    category: "Yatırım Rehberi",
    cover: u("photo-1507525428034-b723cf961d3e"),
    date: "2026-05-12",
    readingMinutes: 7,
    body: [
      { type: "p", text: "Seferihisar, son on yılda İzmir'in en hızlı değer kazanan sahil ilçelerinden biri haline geldi. Sakin Şehir (Cittaslow) kimliği, sınırlı yapılaşma ve doğal koyları, bölgeyi hem yaşam hem yatırım açısından cazip kılıyor." },
      { type: "h2", text: "Hangi Mahalle Hangi Yatırımcıya Uygun?" },
      { type: "p", text: "Prestij ve likidite arayan yatırımcı için Sığacık ve Akarca öne çıkar. Uzun vadeli arsa değerlenmesi hedefleyenler Ulamış, Düzce ve Bengiler'deki tarla ve arsalara yönelebilir." },
      { type: "ul", items: ["Sığacık: Prestij, marina, yüksek kira getirisi", "Akarca: Sahil yaşamı, yazlık talebi", "Ulamış & Düzce: Uygun girişli yatırımlık arsa", "Tepecik: Bahçeli müstakil ev"] },
      { type: "h2", text: "2026'da Beklentiler" },
      { type: "p", text: "Sınırlı imar ve artan talep, özellikle deniz manzaralı arsalarda fiyatların reel olarak korunmasını sağlıyor. Kısa dönem kiralama getirisi yaz aylarında ciddi bir gelir kalemi oluşturabiliyor." },
    ],
  },
  {
    slug: "sigacik-arsa-alinir-mi",
    title: "Sığacık'ta Arsa Alınır mı? Avantajlar ve Dikkat Edilecekler",
    excerpt:
      "Sığacık'ta arsa yatırımı yaparken imar durumu, deniz mesafesi ve değerleme kriterlerini somut örneklerle açıklıyoruz.",
    category: "Yatırım Rehberi",
    cover: u("photo-1500382017468-9049fed747ef"),
    date: "2026-04-30",
    readingMinutes: 6,
    body: [
      { type: "p", text: "Sığacık, Seferihisar'ın en değerli mahallesi olarak arsa yatırımcısının radarında. Ancak her arsa aynı potansiyele sahip değil; imar durumu ve konum, getirinin belirleyicisi." },
      { type: "h2", text: "İmar Durumunu Mutlaka Kontrol Edin" },
      { type: "p", text: "Satın almadan önce belediyeden imar çapı ve plan notlarını inceleyin. Konut imarlı, yola cepheli ve altyapısı hazır parseller her zaman bir adım önde olur." },
      { type: "h2", text: "Deniz Mesafesi ve Manzara" },
      { type: "p", text: "Denize yürüme mesafesindeki ve manzaralı parseller, yeniden satışta ciddi prim yapar. Bu kriter, kira ve tatil talebini de doğrudan etkiler." },
    ],
  },
  {
    slug: "sigacik-yasam-rehberi",
    title: "Sığacık Yaşam Rehberi: Marinadan Cumartesi Pazarına",
    excerpt:
      "Sığacık'ta yaşamak nasıl bir his? Ulaşım, sosyal yaşam, pazar ve günlük hayatın tüm detayları bu rehberde.",
    category: "Bölge Rehberi",
    cover: u("photo-1568605114967-8130f3a36994"),
    date: "2026-04-18",
    readingMinutes: 5,
    body: [
      { type: "p", text: "Sığacık, tarihi kale içi dokusu, marinası ve meşhur cumartesi pazarıyla Ege'nin en karakteristik yerleşimlerinden biri. Yavaş ve sakin bir yaşam arayanların buluşma noktası." },
      { type: "h2", text: "Sosyal Yaşam" },
      { type: "p", text: "Marina çevresindeki restoran ve kafeler, yıl boyu canlı bir sosyal hayat sunar. Cumartesi pazarı ise yöresel ürünleriyle hem yerli halkın hem de ziyaretçilerin uğrak yeri." },
      { type: "h2", text: "Ulaşım" },
      { type: "p", text: "İzmir merkeze yaklaşık 50 dakikalık mesafede olan Sığacık, otoyol bağlantısı sayesinde şehir hayatından kopmadan sakin bir yaşam imkânı verir." },
    ],
  },
  {
    slug: "2026-seferihisar-arsa-fiyatlari",
    title: "2026 Seferihisar Arsa Fiyatları: Mahalle Mahalle Analiz",
    excerpt:
      "Seferihisar genelinde mahallelere göre ortalama m² arsa fiyatlarını ve değer trendini karşılaştırmalı olarak ele aldık.",
    category: "Fiyat Analizleri",
    cover: u("photo-1460317442991-0ec209397118"),
    date: "2026-05-02",
    readingMinutes: 8,
    body: [
      { type: "p", text: "Arsa fiyatları konum, imar ve deniz mesafesine göre Seferihisar içinde bile büyük farklılık gösteriyor. Bu analizde mahalle bazında genel bir çerçeve sunuyoruz." },
      { type: "h2", text: "Öne Çıkan Bulgular" },
      { type: "ul", items: ["Sığacık ve Akarca en yüksek m² değerlerine sahip", "Ulamış, Düzce ve Bengiler uygun girişli yatırım fırsatı sunuyor", "Deniz manzaralı parseller ortalamanın belirgin üzerinde fiyatlanıyor"] },
      { type: "p", text: "Güncel ve ilan bazlı fiyatlar için ilgili mahalle sayfalarımızdaki ortalama fiyat verilerini takip edebilirsiniz." },
    ],
  },
  {
    slug: "ulamis-mahallesi-hakkinda",
    title: "Ulamış Mahallesi Hakkında: Zeytinin ve Yatırımın Buluştuğu Yer",
    excerpt:
      "Ulamış'ın doğal yapısı, zeytinlikleri ve neden yatırımlık arsa için öne çıktığını anlatıyoruz.",
    category: "Bölge Rehberi",
    cover: u("photo-1445264718234-a623be589d37"),
    date: "2026-03-29",
    readingMinutes: 4,
    body: [
      { type: "p", text: "Ulamış, Seferihisar'ın iç kesiminde yer alan, zeytinlikleri ve sakin köy yaşamıyla bilinen bir mahalle. Uygun arsa fiyatları, onu uzun vadeli yatırımcının gözdesi yapıyor." },
      { type: "h2", text: "Neden Ulamış?" },
      { type: "p", text: "Düşük giriş maliyeti ve gelişen çevre yatırımları, bölgedeki arazilerin orta-uzun vadede değerlenme potansiyelini güçlendiriyor." },
    ],
  },
  {
    slug: "seferihisar-villa-fiyat-endeksi",
    title: "Seferihisar Villa Fiyat Endeksi: Neye Göre Fiyatlanıyor?",
    excerpt:
      "Villa fiyatlarını belirleyen konum, havuz, manzara ve yapı yaşı gibi kriterleri örneklerle inceledik.",
    category: "Fiyat Analizleri",
    cover: u("photo-1613490493576-7fde63acd811"),
    date: "2026-05-08",
    readingMinutes: 6,
    body: [
      { type: "p", text: "Villa fiyatları tek bir değişkene değil; konum, manzara, havuz, bahçe ve yapı kalitesinin bileşimine bağlıdır. Seferihisar'da bu kriterler fiyatı belirgin şekilde ayrıştırır." },
      { type: "h2", text: "Fiyatı Belirleyen 5 Kriter" },
      { type: "ul", items: ["Konum ve deniz mesafesi", "Manzara (deniz / marina)", "Özel havuz ve bahçe", "Yapı yaşı ve kalitesi", "Site içi olması ve güvenlik"] },
    ],
  },
  // ---- 5 Yeni Eklenen Orijinal SEO Makalesi ----
  {
    slug: "webtapu-rehberi-tkgm-islemleri",
    title: "Web Tapu Nedir, Nasıl Kullanılır? E-Devlet Girişi ve İşlemler",
    excerpt:
      "Mülk sahiplerinin ve alıcıların tapu işlemlerini internetten yapmasını sağlayan Web Tapu sistemini ve başvuru adımlarını inceliyoruz.",
    category: "Yatırım Rehberi",
    cover: u("photo-1560518883-ce09059eeffa"),
    date: "2026-06-02",
    readingMinutes: 6,
    body: [
      { type: "p", text: "Web Tapu, Tapu ve Kadastro Genel Müdürlüğü (TKGM) tarafından hayata geçirilen, mülk sahiplerinin tapu müdürlüklerine gitmeden birçok işlemi internet üzerinden yapmasına olanak tanıyan devrim niteliğinde bir sistemdir." },
      { type: "h2", text: "Web Tapu ile Neler Yapılabilir?" },
      { type: "p", text: "Sistem sayesinde taşınmazlarınızı listeleyebilir, üzerlerindeki ipotek veya şerh durumlarını görebilir, tapu senedi ve tapu kayıt örneği belgelerini resmi imzalı olarak indirebilirsiniz." },
      { type: "ul", items: ["Satış başvurusu yapma ve evrak yükleme", "Tapu harcı ve döner sermaye ödemeleri", "Tapu kayıt örneği ve tapu senedi alma", "Emlakçılara veya üçüncü şahıslara güvenli yetki tanımlama"] },
      { type: "h2", text: "E-Devlet ile Web Tapu Girişi" },
      { type: "p", text: "Sisteme giriş yapmak oldukça basittir. E-Devlet şifrenizle webtapu.tkgm.gov.tr adresinden giriş yaptıktan sonra adınıza kayıtlı tüm parseller listelenir. Satış veya ipotek işlemleri için 'Başvuru Yap' butonunu kullanarak süreci evden başlatabilirsiniz." }
    ],
  },
  {
    slug: "tkgm-parsel-sorgulama-rehberi",
    title: "TKGM Parsel Sorgulama Nasıl Yapılır? Ada/Parsel Sorgu Adımları",
    excerpt:
      "Tapu ve Kadastro Genel Müdürlüğü'nün resmi parsel sorgu uygulamasıyla arazi konumunu, alanını ve imar durumunu öğrenme rehberi.",
    category: "Yatırım Rehberi",
    cover: u("photo-1524661135-423995f22d0b"),
    date: "2026-06-05",
    readingMinutes: 5,
    body: [
      { type: "p", text: "Bir arsa veya arazi satın almadan önce en kritik adım, o mülkün resmi sınırlarını ve konumunu TKGM Parsel Sorgulama uygulaması üzerinden teyit etmektir." },
      { type: "h2", text: "Parsel Sorgulama Ekranı Kullanımı" },
      { type: "p", text: "TKGM Coğrafi Bilgi Sistemleri şube müdürlüğü tarafından yönetilen parselsorgu.tkgm.gov.tr adresine girdiğinizde karşınıza çıkan haritada İl, İlçe, Mahalle, Ada ve Parsel numaralarını yazarak mülk sınırlarını görebilirsiniz." },
      { type: "h2", text: "Dikkat Edilmesi Gereken Hususlar" },
      { type: "p", text: "Sorgulama sonucunda arsanın şekli, toplam yüzölçümü ve koordinat bilgileri yer alır. Ancak buradaki bilgilerin sadece bilgilendirme amaçlı olduğunu, imar izni ve inşaat şartları için mutlaka Seferihisar Belediyesi İmar ve Şehircilik Müdürlüğü'ne başvurulması gerektiğini unutmamalısınız." }
    ],
  },
  {
    slug: "e-devlet-tapu-sorgu-islemleri",
    title: "E-Devlet ile Tapu Sorgulama ve Gayrimenkul Takibi",
    excerpt:
      "T.C. Kimlik numaranızla E-Devlet üzerinden üzerinize kayıtlı taşınmazları nasıl sorgulayacağınızı ve tapu sms sistemini anlatıyoruz.",
    category: "Fiyat Analizleri",
    cover: u("photo-1454165804606-c3d57bc86b40"),
    date: "2026-06-08",
    readingMinutes: 4,
    body: [
      { type: "p", text: "E-Devlet Kapısı, tapu kayıtlarının şeffaflığı ve güvenliği için mülk sahiplerine geniş imkanlar sunuyor. Sistem üzerinden adınıza kayıtlı hisseli veya tam mülkleri anında görebilirsiniz." },
      { type: "h2", text: "Tapu Bilgileri Sorgulama Hizmeti" },
      { type: "p", text: "E-Devlet'e giriş yaptıktan sonra 'Tapu ve Kadastro Genel Müdürlüğü' hizmetleri altında yer alan 'Tapu Bilgileri Sorgulama' sekmesinden adınıza tescilli gayrimenkullerin tapu detaylarına erişebilirsiniz." },
      { type: "h2", text: "Tapu SMS Sistemi ile Güvenlik" },
      { type: "p", text: "Gayrimenkulleriniz üzerinde bilginiz dışında herhangi bir işlem yapılmasını (satış, ipotek vb.) engellemek için Tapu SMS hizmetine telefon numaranızı tanımlayabilirsiniz. Herhangi bir işlem başvurusu alındığında telefonunuza anında uyarı mesajı gelir." }
    ],
  },
  {
    slug: "izmir-sahil-imar-plani-kurallari",
    title: "İzmir Sahil Bölgelerinde İmar Kuralları ve Arsa Yatırımı",
    excerpt:
      "Seferihisar, Urla ve Çeşme gibi İzmir sahil şeridinde yer alan arsa yatırımlarında imar sınırlamaları ve sit alanlarının fiyatlara etkisi.",
    category: "Yatırım Rehberi",
    cover: u("photo-1590073844006-33379778ae09"),
    date: "2026-06-09",
    readingMinutes: 7,
    body: [
      { type: "p", text: "İzmir sahil hattı, Türkiye'nin gayrimenkul yatırımı açısından en cazip bölgelerinin başında geliyor. Ancak bu bölgelerde kıyı kanunu, doğal sit kararları ve tarım alanı koruma sınırları oldukça katıdır." },
      { type: "h2", text: "Sit Alanları ve Dereceleri" },
      { type: "p", text: "Satın almayı planladığınız arazinin Arkeolojik, Doğal veya Kentsel Sit alanında kalıp kalmadığını kontrol etmelisiniz. Özellikle 1. Derece Sit alanlarında kesinlikle yapılaşma izni verilmezken, 3. Derece Sit alanlarında sınırlı izinler çıkabilmektedir." },
      { type: "h2", text: "Kıyı Kanunu Sınırlamaları" },
      { type: "p", text: "Denize ilk 50 ve ikinci 50 metre mesafede yer alan parsellerde kıyı kanunu hükümleri geçerlidir. Sahil şeridinde inşaat emsali (TAKS/KAKS) genellikle düşüktür; bu da villaların değerini yüksek tutan temel sebeplerdendir." }
    ],
  },
  {
    slug: "seferihisar-cittaslow-koruma-plani",
    title: "Cittaslow Kapsamında Seferihisar İmar ve Emlak Değerleri",
    excerpt:
      "Seferihisar'ın Sakin Şehir unvanının bölgedeki imar sınırlarına, villa yapılaşmasına ve arsa fiyatlarına olan etkisi.",
    category: "Fiyat Analizleri",
    cover: u("photo-1542838132-92c53300491e"),
    date: "2026-06-10",
    readingMinutes: 6,
    body: [
      { type: "p", text: "Türkiye'nin ilk Sakin Şehri (Cittaslow) olan Seferihisar, yerel mimarisini, tarım alanlarını ve sakin yaşam tarzını korumak için sıkı denetimler uygulamaktadır." },
      { type: "h2", text: "Dikey Yapılaşmaya İzin Verilmiyor" },
      { type: "p", text: "Seferihisar genelinde yüksek katlı konut bloklarına izin verilmemektedir. Sığacık ve çevresinde imar planları genellikle 2 kat (Hmax: 6.50m) olarak belirlenmiştir. Bu durum bölgenin yatay mimari kimliğini korumaktadır." },
      { type: "h2", text: "Yatırım Potansiyeli Neden Güçlü?" },
      { type: "p", text: "İmar sınırları nedeniyle arsa arzı kısıtlıdır. Sınırlı villa ve arsa stoğu, artan metropol kaçışı talebiyle birleştiğinde, Seferihisar'daki gayrimenkullerin birim fiyatlarının İzmir ortalamasından daha hızlı prim yapmasını sağlamaktadır." }
    ],
  },
];

export const blogBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);
