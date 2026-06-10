export interface Neighborhood {
  slug: string;
  name: string;
  districtSlug: string;
  /** Denize yaklaşık mesafe açıklaması */
  sea: string;
  /** Bölge öne çıkanları (içerik ve liste için) */
  highlights: string[];
  /** Ortalama m² fiyatı (TL) — satılık/kiralık referans */
  avgM2: { sale: number; rent: number };
  /** Programmatic içerik için kısa karakter cümlesi */
  character: string;
}

export interface District {
  slug: string;
  name: string;
  citySlug: string;
  cityName: string;
  priority: 1 | 2 | 3;
  summary: string;
  /** İlçe tanıtım paragrafları */
  about: string[];
  neighborhoods: Neighborhood[];
}

const izmir = { citySlug: "izmir", cityName: "İzmir" };

export const districts: District[] = [
  {
    slug: "seferihisar",
    name: "Seferihisar",
    ...izmir,
    priority: 1,
    summary:
      "İzmir'in Sakin Şehir (Cittaslow) unvanlı sahil ilçesi; mandalina bahçeleri, tarihi Sığacık ve berrak koylarıyla yatırımın merkezi.",
    about: [
      "Seferihisar, İzmir'in güneybatısında, Ege Denizi'ne kıyısı olan ve Türkiye'nin ilk Cittaslow (Sakin Şehir) ilçesi olarak tanınan özel bir yerleşimdir. Mandalina bahçeleri, zeytinlikleri ve doğal koylarıyla hem daimi yaşam hem de yazlık yatırım için son yılların en çok tercih edilen bölgelerinden biri haline gelmiştir.",
      "İzmir şehir merkezine yaklaşık 45 km mesafede bulunan ilçe, İzmir–Çeşme otoyolu bağlantısı sayesinde kolay ulaşıma sahiptir. Sığacık Marina, Teos Antik Kenti ve Akkum plajları bölgenin turizm ve gayrimenkul değerini sürekli yukarı taşımaktadır.",
      "Bölgede villa, müstakil ev, deniz manzaralı arsa ve zeytinlik tarla talebi yüksektir. Sakin şehir kimliği imar planlarında yapılaşmayı sınırlı tuttuğu için arsa ve villa değerleri uzun vadede güçlü bir yatırım potansiyeli sunar.",
    ],
    neighborhoods: [
      {
        slug: "sigacik",
        name: "Sığacık",
        districtSlug: "seferihisar",
        sea: "Denize sıfır — marina ve koylar yürüme mesafesinde",
        character:
          "tarihi kale içi dokusu, marinası ve cumartesi pazarıyla bölgenin en prestijli mahallesi",
        highlights: [
          "Sığacık Marina ve yat limanı",
          "Tarihi kale içi sokakları",
          "Teos Antik Kenti'ne yakınlık",
          "Ünlü Sığacık cumartesi pazarı",
        ],
        avgM2: { sale: 62000, rent: 220 },
      },
      {
        slug: "akarca",
        name: "Akarca",
        districtSlug: "seferihisar",
        sea: "Denize 300–800 m, sahil bandı yerleşimi",
        character: "sahil şeridi siteleri ve yazlık villalarıyla öne çıkan canlı mahalle",
        highlights: [
          "Akarca sahil yürüyüş yolu",
          "Site içi yazlık konsepti",
          "Restoran ve kafe hattı",
          "Yaz nüfusu yüksek bölge",
        ],
        avgM2: { sale: 48000, rent: 180 },
      },
      {
        slug: "tepecik",
        name: "Tepecik",
        districtSlug: "seferihisar",
        sea: "Denize 2–4 km, hafif yamaç konumu",
        character: "müstakil ev ve bahçeli arsa talebinin yoğun olduğu sakin yerleşim",
        highlights: [
          "Geniş bahçeli müstakil evler",
          "Mandalina ve zeytin bahçeleri",
          "Uygun arsa fiyatları",
          "Sakin ve aileye uygun yaşam",
        ],
        avgM2: { sale: 28000, rent: 130 },
      },
      {
        slug: "ulamis",
        name: "Ulamış",
        districtSlug: "seferihisar",
        sea: "Denize 3–5 km, iç kesim köy dokusu",
        character: "zeytinlik tarlaları ve yatırımlık arsalarıyla bilinen doğal mahalle",
        highlights: [
          "Verimli zeytinlik tarlalar",
          "Yatırımlık büyük parseller",
          "Doğal köy yaşamı",
          "Uygun giriş fiyatları",
        ],
        avgM2: { sale: 18000, rent: 95 },
      },
      {
        slug: "camikebir",
        name: "Camikebir",
        districtSlug: "seferihisar",
        sea: "Denize 2–3 km, ilçe merkezi",
        character: "Seferihisar merkezinin günlük yaşam ve alışveriş kalbi",
        highlights: [
          "İlçe merkezi konumu",
          "Pazar, banka ve resmi kurumlar",
          "Daire ve dükkân talebi yüksek",
          "Merkezi ulaşım",
        ],
        avgM2: { sale: 34000, rent: 160 },
      },
      {
        slug: "hidirlik",
        name: "Hıdırlık",
        districtSlug: "seferihisar",
        sea: "Denize 1–2 km, merkeze yakın",
        character: "merkeze yürüme mesafesinde, daire ve müstakil ev dengesi olan mahalle",
        highlights: [
          "Merkeze yürüme mesafesi",
          "Okul ve sağlık ocağı yakını",
          "Daire ağırlıklı yapı",
          "Kiralık talebi yüksek",
        ],
        avgM2: { sale: 31000, rent: 150 },
      },
      {
        slug: "turabiye",
        name: "Turabiye",
        districtSlug: "seferihisar",
        sea: "Denize 1.5–3 km, merkez bağlantılı",
        character: "yeni konut projeleri ve daire arzının arttığı gelişen mahalle",
        highlights: [
          "Yeni konut projeleri",
          "Modern site daireleri",
          "Merkeze kolay erişim",
          "Yükselen değer trendi",
        ],
        avgM2: { sale: 33000, rent: 155 },
      },
      {
        slug: "cumhuriyet",
        name: "Cumhuriyet",
        districtSlug: "seferihisar",
        sea: "Denize 2–3 km",
        character: "yerleşik aile nüfusu olan, sosyal donatısı güçlü merkez mahalle",
        highlights: [
          "Yerleşik aile yaşamı",
          "Okul ve market yoğunluğu",
          "Daire ve müstakil ev karması",
          "İstikrarlı kira getirisi",
        ],
        avgM2: { sale: 30000, rent: 145 },
      },
      {
        slug: "duzce",
        name: "Düzce",
        districtSlug: "seferihisar",
        sea: "Denize 4–6 km, iç kesim",
        character: "tarım arazileri ve geniş arsalarıyla yatırımcının radarındaki köy",
        highlights: [
          "Geniş tarım arazileri",
          "Düşük giriş fiyatı",
          "Uzun vadeli yatırım fırsatı",
          "Doğa ile iç içe yaşam",
        ],
        avgM2: { sale: 15000, rent: 85 },
      },
      {
        slug: "bengiler",
        name: "Bengiler",
        districtSlug: "seferihisar",
        sea: "Denize 5–7 km, yayla karakteri",
        character: "serin iklimi ve zeytinlikleriyle hobi bahçesi yatırımına uygun mahalle",
        highlights: [
          "Serin yayla iklimi",
          "Hobi bahçesi ve zeytinlik",
          "Sakin doğal ortam",
          "Yatırımlık tarla arzı",
        ],
        avgM2: { sale: 13000, rent: 75 },
      },
      {
        slug: "ataturk",
        name: "Atatürk",
        districtSlug: "seferihisar",
        sea: "Denize 2–3 km, ilçe merkezine yakın",
        character: "geniş yerleşim alanı, yeni yapılanmalar ve modern konutların bulunduğu bölge",
        highlights: [
          "Yeni konut projeleri",
          "Merkezi ulaşım imkanı",
          "Geniş park ve sosyal alanlar",
        ],
        avgM2: { sale: 32000, rent: 150 },
      },
      {
        slug: "beyler",
        name: "Beyler",
        districtSlug: "seferihisar",
        sea: "Denize 15–20 km, ormanlık iç kesim",
        character: "zeytinyağı üretimi, doğası ve temiz havasıyla bilinen dağ köyü",
        highlights: [
          "Tarihi zeytin ağaçları",
          "Doğal kaynak suları",
          "Eko-tarım ve zeytinyağı tesisleri",
        ],
        avgM2: { sale: 12000, rent: 60 },
      },
      {
        slug: "camtepe",
        name: "Çamtepe",
        districtSlug: "seferihisar",
        sea: "Denize 12–15 km, iç kesim orman bölgesi",
        character: "çam ormanları ve doğayla iç içe, sakin hobi bahçesi bölgesi",
        highlights: [
          "Çam ormanları",
          "Temiz hava ve yüksek oksijen",
          "Hobi bahçesi ve müstakil parsel imkanları",
        ],
        avgM2: { sale: 11000, rent: 55 },
      },
      {
        slug: "colak-ibrahim-bey",
        name: "Çolak İbrahim Bey",
        districtSlug: "seferihisar",
        sea: "Denize 3–4 km, merkez yerleşim",
        character: "Seferihisar'ın tarihi dokusunu barındıran yerleşik merkez mahallesi",
        highlights: [
          "Tarihi Seferihisar evleri",
          "İlçe merkezine yürüme mesafesinde",
          "Yerleşik esnaf kültürü",
        ],
        avgM2: { sale: 29000, rent: 135 },
      },
      {
        slug: "godence",
        name: "Gödence",
        districtSlug: "seferihisar",
        sea: "Denize 18–22 km, yüksek rakımlı yayla",
        character: "uluslararası ödüllü zeytinyağı ve üzüm bağlarıyla ünlü kooperatif köyü",
        highlights: [
          "Gödence Tarımsal Kalkınma Kooperatifi",
          "Nitelikli zeytinyağı üretimi",
          "Üzüm bağları ve şarapçılık",
        ],
        avgM2: { sale: 14000, rent: 65 },
      },
      {
        slug: "golcuk",
        name: "Gölcük",
        districtSlug: "seferihisar",
        sea: "Denize 10–12 km, iç kesim",
        character: "tarım arazileri, zeytinlikleri ve sakin köy hayatıyla yatırımcı çeken bölge",
        highlights: [
          "Geniş zeytinlik arazileri",
          "Verimli tarım alanları",
          "Köy yaşamı ve doğa",
        ],
        avgM2: { sale: 11500, rent: 50 },
      },
      {
        slug: "ihsaniye",
        name: "İhsaniye",
        districtSlug: "seferihisar",
        sea: "Denize 14–16 km, yeşil vadi",
        character: "organik tarım, temiz hava ve sakin yaşam sunan şirin mahalle",
        highlights: [
          "Organik tarım pazarı",
          "Doğal orman sınırları",
          "Müstakil yaşam potansiyeli",
        ],
        avgM2: { sale: 12500, rent: 60 },
      },
      {
        slug: "kavakdere",
        name: "Kavakdere",
        districtSlug: "seferihisar",
        sea: "Denize 8–10 km, dere kenarı vadi",
        character: "üzüm bağları, zeytinlikler ve verimli ovalarıyla bilinen kırsal mahalle",
        highlights: [
          "Üzüm bağları",
          "Verimli sulak tarım arazileri",
          "Sessiz ve sakin köy atmosferi",
        ],
        avgM2: { sale: 13000, rent: 65 },
      },
      {
        slug: "mersinalan",
        name: "Mersinalan",
        districtSlug: "seferihisar",
        sea: "Denize 20–25 km, orman sınırında",
        character: "çam ormanları ile çevrili, doğa sporlarına ve ekolojik yaşama uygun dağ mahallesi",
        highlights: [
          "Dağcılık ve trekking rotaları",
          "Büyük ormanlık alanlar",
          "Ekolojik tarım imkanları",
        ],
        avgM2: { sale: 10000, rent: 45 },
      },
      {
        slug: "necat-hepkon",
        name: "Necat Hepkon",
        districtSlug: "seferihisar",
        sea: "Denize 2–3 km, hastane ve okul bölgesi",
        character: "üniversite yerleşkesi ve devlet hastanesine ev sahipliği yapan hareketli mahalle",
        highlights: [
          "Seferihisar Devlet Hastanesi",
          "İzmir Demokrasi Üniversitesi MYO yerleşkesi",
          "Kiralık ve satılık daire talebi yüksek",
        ],
        avgM2: { sale: 35000, rent: 170 },
      },
      {
        slug: "orhanli",
        name: "Orhanlı",
        districtSlug: "seferihisar",
        sea: "Denize 12–15 km, vadi içi",
        character: "kadim üretim havzası, anıt zeytin ağaçları ve ekolojik köy kültürü",
        highlights: [
          "Orhanlı Doğa Okulu",
          "Bin yıllık zeytin ağaçları",
          "Geleneksel tarım şenlikleri",
        ],
        avgM2: { sale: 16000, rent: 70 },
      },
      {
        slug: "payamli",
        name: "Payamlı",
        districtSlug: "seferihisar",
        sea: "Denize 8–10 km, hafif engebeli arazi",
        character: "badem ağaçları, zeytinlikleri ve doğa manzaralı arsalarıyla bilinen bölge",
        highlights: [
          "Badem ve zeytin bahçeleri",
          "Doğa manzaralı yüksek konum",
          "Yatırımlık uygun fiyatlı parseller",
        ],
        avgM2: { sale: 13500, rent: 60 },
      },
      {
        slug: "turgut",
        name: "Turgut",
        districtSlug: "seferihisar",
        sea: "Denize 6–8 km, iç kesim",
        character: "lavanta tarlaları ve geleneksel köy festivalleri ile tanınan popüler destinasyon",
        highlights: [
          "Lavanta şenlikleri ve tarlaları",
          "Sanat atölyeleri ve köy pazarı",
          "Hızlı değer kazanan arsa alanı",
        ],
        avgM2: { sale: 17000, rent: 80 },
      },
    ],
  },
  // ---- Öncelik 2 ilçeleri (mahalle sayısı sınırlı tutuldu) ----
  {
    slug: "urla",
    name: "Urla",
    ...izmir,
    priority: 2,
    summary:
      "Bağ evleri, sanat sokağı ve şarap rotasıyla İzmir'in en prestijli sahil ilçelerinden biri.",
    about: [
      "Urla, İzmir'in batısında yer alan, bağ evleri, butik şarap üreticileri ve sanat sokağıyla ünlü prestijli bir ilçedir. Yüksek gelir grubunun tercih ettiği villa ve müstakil ev projeleriyle gayrimenkul değerleri İzmir ortalamasının üzerindedir.",
      "İzmir merkeze yakınlığı ve gelişmiş sosyal yaşamıyla hem daimi konut hem de yatırım için güçlü bir bölgedir. Deniz manzaralı arsa ve lüks villa talebi süreklidir.",
    ],
    neighborhoods: [
      {
        slug: "kalabak",
        name: "Kalabak",
        districtSlug: "urla",
        sea: "Denize 1–2 km",
        character: "deniz manzaralı villa siteleriyle öne çıkan prestijli mahalle",
        highlights: ["Lüks villa siteleri", "Deniz manzarası", "Yüksek talep", "Marina yakını"],
        avgM2: { sale: 58000, rent: 240 },
      },
      {
        slug: "zeytinler",
        name: "Zeytinler",
        districtSlug: "urla",
        sea: "Denize 5–8 km, bağ evi bölgesi",
        character: "bağ evleri ve butik üreticilerle anılan doğal yerleşim",
        highlights: ["Bağ evleri", "Şarap rotası", "Geniş arazi", "Doğal yaşam"],
        avgM2: { sale: 26000, rent: 130 },
      },
    ],
  },
  {
    slug: "guzelbahce",
    name: "Güzelbahçe",
    ...izmir,
    priority: 2,
    summary:
      "İzmir merkeze en yakın sahil ilçesi; site yaşamı ve deniz manzaralı konutlarıyla tercih ediliyor.",
    about: [
      "Güzelbahçe, İzmir merkezine en yakın sahil ilçelerinden biridir. Modern site yaşamı, deniz manzaralı daireler ve düzenli sahil bandıyla orta-üst gelir grubunun gözdesidir.",
      "Şehir merkezine ulaşım kolaylığı, bölgeyi daimi konut için cazip kılar. Villa ve lüks daire talebi yıl boyunca yüksektir.",
    ],
    neighborhoods: [
      {
        slug: "yali",
        name: "Yalı",
        districtSlug: "guzelbahce",
        sea: "Denize sıfır sahil bandı",
        character: "deniz manzaralı daireler ve sahil yaşamıyla bilinen merkez mahalle",
        highlights: ["Deniz manzaralı daireler", "Sahil yürüyüş yolu", "Merkeze yakın", "Site yaşamı"],
        avgM2: { sale: 52000, rent: 230 },
      },
    ],
  },
  {
    slug: "cesme",
    name: "Çeşme",
    ...izmir,
    priority: 2,
    summary:
      "Türkiye'nin tatil ve lüks yazlık başkenti; Alaçatı ve koylarıyla premium yatırımın merkezi.",
    about: [
      "Çeşme, Türkiye'nin en bilinen tatil destinasyonlarından biridir. Alaçatı, Ilıca ve koylarıyla lüks yazlık, villa ve butik otel yatırımlarının merkezidir. Gayrimenkul fiyatları ülke genelinin oldukça üzerindedir.",
      "Yüksek sezon talebi, kısa dönem kiralama getirisi ve prestij değeri nedeniyle yatırımcılar için öncelikli bölgelerdendir.",
    ],
    neighborhoods: [
      {
        slug: "alacati",
        name: "Alaçatı",
        districtSlug: "cesme",
        sea: "Denize 1–3 km, taş evler bölgesi",
        character: "taş evleri, sörf ve butik otelleriyle dünyaca ünlü turistik mahalle",
        highlights: ["Tarihi taş evler", "Sörf cenneti", "Butik otel yatırımı", "Premium fiyat"],
        avgM2: { sale: 110000, rent: 450 },
      },
    ],
  },
  {
    slug: "menderes",
    name: "Menderes",
    ...izmir,
    priority: 2,
    summary:
      "Havalimanı yakını, Özdere ve Gümüldür sahilleriyle yazlık ve yatırım arazisinin buluştuğu ilçe.",
    about: [
      "Menderes, İzmir Adnan Menderes Havalimanı'na yakınlığı ve Özdere–Gümüldür sahilleriyle hem yazlık hem de yatırım arazisi açısından değerli bir ilçedir.",
      "Ulaşım avantajı ve gelişen sahil bandı, bölgedeki konut ve arsa talebini sürekli canlı tutar.",
    ],
    neighborhoods: [
      {
        slug: "ozdere",
        name: "Özdere",
        districtSlug: "menderes",
        sea: "Denize sıfır sahil bandı",
        character: "uzun sahil şeridi ve yazlık siteleriyle aileye uygun tatil mahallesi",
        highlights: ["Uzun kumsal", "Yazlık siteleri", "Aile dostu", "Uygun yazlık fiyatları"],
        avgM2: { sale: 40000, rent: 175 },
      },
      {
        slug: "gumuldur",
        name: "Gümüldür",
        districtSlug: "menderes",
        sea: "Denize sıfır, mandalina bölgesi",
        character: "mandalina bahçeleri ve sahil yazlıklarıyla bilinen yerleşim",
        highlights: ["Mandalina bahçeleri", "Sahil yazlıkları", "Doğal koylar", "Yatırımlık arsa"],
        avgM2: { sale: 38000, rent: 165 },
      },
    ],
  },
  {
    slug: "aliaga",
    name: "Aliağa",
    ...izmir,
    priority: 3,
    summary: "Sanayi ve liman kenti; deniz kıyısı sosyal alanları ve hızlı gelişimiyle yatırım bölgesi.",
    about: ["Aliağa, İzmir'in kuzeyinde yer alan sanayi ve ticaret merkezidir.", "Yatırım odaklı daire ve işyeri talebi yüksektir."],
    neighborhoods: [{ slug: "yeni-mahalle", name: "Yeni Mahalle", districtSlug: "aliaga", sea: "Denize 1-2 km", character: "hareketli yerleşim", highlights: ["Sosyal donatılar"], avgM2: { sale: 25000, rent: 120 } }]
  },
  {
    slug: "balcova",
    name: "Balçova",
    ...izmir,
    priority: 3,
    summary: "Termal tesisleri, alışveriş merkezleri ve yeşil dokusuyla İzmir'in köklü merkez ilçesi.",
    about: ["Balçova, İzmir'in batı aksında yer alır.", "Nezih yaşam alanlarıyla daire talebi yüksektir."],
    neighborhoods: [{ slug: "egitim", name: "Eğitim", districtSlug: "balcova", sea: "Körfeze yakın", character: "nezih merkez mahalle", highlights: ["Termal oteller"], avgM2: { sale: 45000, rent: 200 } }]
  },
  {
    slug: "bayindir",
    name: "Bayındır",
    ...izmir,
    priority: 3,
    summary: "Çiçekçilik ve tarımın başkenti; tarihi konakları ve kaplıcalarıyla doğa ile iç içe.",
    about: ["Bayındır, zengin tarım arazilerine ev sahipliği yapar.", "Arsa ve tarla yatırımları için uygundur."],
    neighborhoods: [{ slug: "mithatpasa", name: "Mithatpaşa", districtSlug: "bayindir", sea: "İç kesim", character: "tarihi tarım mahallesi", highlights: ["Çiçek seraları"], avgM2: { sale: 15000, rent: 70 } }]
  },
  {
    slug: "bayrakli",
    name: "Bayraklı",
    ...izmir,
    priority: 3,
    summary: "İzmir'in yeni kent merkezi; gökdelenleri, iş merkezleri ve modern konut projeleri.",
    about: ["Bayraklı, iş ve ticaret dünyasının kalbidir.", "Ticari gayrimenkul ve lüks rezidans talebi yüksektir."],
    neighborhoods: [{ slug: "mansuroglu", name: "Mansuroğlu", districtSlug: "bayrakli", sea: "Sahile yakın", character: "prestijli iş ve yaşam alanı", highlights: ["Adliye sarayı", "Gökdelenler"], avgM2: { sale: 50000, rent: 220 } }]
  },
  {
    slug: "bergama",
    name: "Bergama",
    ...izmir,
    priority: 3,
    summary: "UNESCO Dünya Mirası tarihi kent; zengin kültürü, tarım toprakları ve tarihi taş evleri.",
    about: ["Bergama, antik çağlardan bu yana önemli bir kültür merkezidir.", "Yatırımlık tarla ve tarihi ev talebi vardır."],
    neighborhoods: [{ slug: "turanli", name: "Turanlı", districtSlug: "bergama", sea: "İç kesim", character: "tarihi doku", highlights: ["Akropol yakını"], avgM2: { sale: 18000, rent: 80 } }]
  },
  {
    slug: "beydag",
    name: "Beydağ",
    ...izmir,
    priority: 3,
    summary: "Baraj gölü manzaralı, kestane ve zeytin bahçeleriyle Ege'nin sakin dağ ilçesi.",
    about: ["Beydağ, doğal tarım ve huzurlu bir kırsal yaşam sunar."],
    neighborhoods: [{ slug: "cumhuriyet", name: "Cumhuriyet", districtSlug: "beydag", sea: "İç kesim", character: "sakin köy dokusu", highlights: ["Baraj gölü manzarası"], avgM2: { sale: 11000, rent: 50 } }]
  },
  {
    slug: "bornova",
    name: "Bornova",
    ...izmir,
    priority: 3,
    summary: "Üniversite ve sanayi kenti; geniş ulaşım ağı, genç nüfusu ve tarihi levanten köşkleri.",
    about: ["Bornova, eğitim ve sanayinin buluşma noktasıdır.", "Kiralık ve satılık daire sirkülasyonu yüksektir."],
    neighborhoods: [{ slug: "kazimdirik", name: "Kazımdirik", districtSlug: "bornova", sea: "Körfeze 3-4 km", character: "üniversite ve gençlik yaşamı", highlights: ["Ege Üniversitesi", "Metro"], avgM2: { sale: 46000, rent: 210 } }]
  },
  {
    slug: "buca",
    name: "Buca",
    ...izmir,
    priority: 3,
    summary: "İzmir'in en kalabalık ilçesi; Dokuz Eylül Üniversitesi yerleşkeleri ve geniş konut stoku.",
    about: ["Buca, öğrenci nüfusunun yoğun olduğu bir yerleşimdir.", "Kira getirili daire yatırımı için tercih edilir."],
    neighborhoods: [{ slug: "sirinyer", name: "Şirinyer", districtSlug: "buca", sea: "İç kesim", character: "hareketli çarşı ve yaşam", highlights: ["Şirinyer Parkı"], avgM2: { sale: 32000, rent: 150 } }]
  },
  {
    slug: "cigli",
    name: "Çiğli",
    ...izmir,
    priority: 3,
    summary: "Katip Çelebi Üniversitesi, Organize Sanayi Bölgesi ve Kuş Cenneti ile kuzeyin parlayan yıldızı.",
    about: ["Çiğli, kuzey gelişim aksında yer alan sanayi ve konut merkezidir."],
    neighborhoods: [{ slug: "ataturk", name: "Atatürk", districtSlug: "cigli", sea: "Kuş cenneti yakını", character: "yeni yapılaşma", highlights: ["AOSB yakınlığı"], avgM2: { sale: 30000, rent: 140 } }]
  },
  {
    slug: "dikili",
    name: "Dikili",
    ...izmir,
    priority: 3,
    summary: "Uzun kumsalları, şifalı kaplıcaları ve Midilli Adası manzaralı sahiliyle sakin tatil cenneti.",
    about: ["Dikili, İzmir'in en kuzey sahil ilçelerinden biridir.", "Yazlık ve arsa yatırımı için popülerdir."],
    neighborhoods: [{ slug: "isiklar", name: "Işıklar", districtSlug: "dikili", sea: "Denize sıfır sahil", character: "yazlık bölgesi", highlights: ["Mavi bayraklı plajlar"], avgM2: { sale: 38000, rent: 160 } }]
  },
  {
    slug: "foca",
    name: "Foça",
    ...izmir,
    priority: 3,
    summary: "Tarihi Phokaia antik kenti; Siren Kayalıkları, taş evleri ve sakin balıkçı kasabası ruhu.",
    about: ["Foça, tarihi sit alanı korumasında lüks bir sahil yerleşimidir.", "Taş evler ve villa yatırımları değerlidir."],
    neighborhoods: [{ slug: "ataturk", name: "Atatürk", districtSlug: "foca", sea: "Denize sıfır", character: "tarihi taş evler bölgesi", highlights: ["Eski Foça Limanı"], avgM2: { sale: 55000, rent: 220 } }]
  },
  {
    slug: "gaziemir",
    name: "Gaziemir",
    ...izmir,
    priority: 3,
    summary: "Adnan Menderes Havalimanı, Fuar İzmir ve Ege Serbest Bölgesi ile lojistik merkezi.",
    about: ["Gaziemir, havalimanı ve sanayi merkezlerine yakınlığıyla bilinir.", "Modern konut siteleri talep görür."],
    neighborhoods: [{ slug: "akcay", name: "Akçay", districtSlug: "gaziemir", sea: "İç kesim", character: "ulaşım ve ticaret merkezi", highlights: ["Fuar İzmir", "Optimum AVM"], avgM2: { sale: 39000, rent: 180 } }]
  },
  {
    slug: "karabaglar",
    name: "Karabağlar",
    ...izmir,
    priority: 3,
    summary: "Mobilya sektörü ve geniş yerleşim alanlarıyla kentsel dönüşümün odak ilçesi.",
    about: ["Karabağlar, İzmir'in güney merkez aksında geniş bir yerleşim alanıdır."],
    neighborhoods: [{ slug: "bahcelievler", name: "Bahçelievler", districtSlug: "karabaglar", sea: "İç kesim", character: "yerleşik aile mahallesi", highlights: ["Çarşı ve marketler"], avgM2: { sale: 31000, rent: 140 } }]
  },
  {
    slug: "karaburun",
    name: "Karaburun",
    ...izmir,
    priority: 3,
    summary: "El değmemiş koyları, nergis bahçeleri ve dik yamaçlarıyla İzmir'in en sakin yarımadası.",
    about: ["Karaburun, doğal koruma statüsüne sahip, sakin yaşam arayanların gözdesidir.", "Deniz manzaralı taş evler ve arsalar değerlidir."],
    neighborhoods: [{ slug: "iskele", name: "İskele", districtSlug: "karaburun", sea: "Denize sıfır koylar", character: "balıkçı limanı ve temiz deniz", highlights: ["Nergis şenlikleri", "Bakir koylar"], avgM2: { sale: 50000, rent: 200 } }]
  },
  {
    slug: "karsiyaka",
    name: "Karşıyaka",
    ...izmir,
    priority: 3,
    summary: "İzmir'in simge sahil ilçesi; sahil yürüyüş yolu, köklü kültürü ve hareketli çarşısı.",
    about: ["Karşıyaka, Ege lüks yaşamının simgesidir.", "Bostanlı ve Mavişehir bölgeleri en prestijli konut alanlarıdır."],
    neighborhoods: [{ slug: "bostanli", name: "Bostanlı", districtSlug: "karsiyaka", sea: "Denize sıfır sahil bandı", character: "sosyal yaşam, kafe ve restoranlar", highlights: ["Bostanlı Sahili", "Tramvay"], avgM2: { sale: 65000, rent: 260 } }]
  },
  {
    slug: "kemalpasa",
    name: "Kemalpaşa",
    ...izmir,
    priority: 3,
    summary: "Kiraz bahçeleri, sanayi bölgesi ve villa imarlı orman köyleriyle gelişen merkez.",
    about: ["Kemalpaşa, Spil Dağı eteklerinde kurulmuş zengin tarım ve sanayi bölgesidir.", "Villa arsaları yoğun talep almaktadır."],
    neighborhoods: [{ slug: "sogukpinar", name: "Soğukpınar", districtSlug: "kemalpasa", sea: "İç kesim", character: "doğa ile iç içe müstakil yaşam", highlights: ["Kiraz festivalleri"], avgM2: { sale: 22000, rent: 100 } }]
  },
  {
    slug: "kinik",
    name: "Kınık",
    ...izmir,
    priority: 3,
    summary: "Kömür madenleri, tarım toprakları ve gelişen sanayisiyle kuzey sınır ilçesi.",
    about: ["Kınık, verimli tarım toprakları ve sanayi hamleleriyle gelişmektedir."],
    neighborhoods: [{ slug: "fatih", name: "Fatih", districtSlug: "kinik", sea: "İç kesim", character: "kırsal yaşam", highlights: ["Kınık OSB"], avgM2: { sale: 11000, rent: 50 } }]
  },
  {
    slug: "kiraz",
    name: "Kiraz",
    ...izmir,
    priority: 3,
    summary: "Hayvancılık ve tarım odağında, Ege'nin doğu ucundaki huzurlu dağ yerleşimi.",
    about: ["Kiraz, doğal tarım ve hayvancılık alanında bölgenin öncüsüdür."],
    neighborhoods: [{ slug: "cumhuriyet", name: "Cumhuriyet", districtSlug: "kiraz", sea: "İç kesim", character: "sakin kırsal doku", highlights: ["Doğal yaylalar"], avgM2: { sale: 10000, rent: 45 } }]
  },
  {
    slug: "konak",
    name: "Konak",
    ...izmir,
    priority: 3,
    summary: "İzmir'in tarihi ve idari merkezi; Alsancak, Kemeraltı Çarşısı ve kordon boyu.",
    about: ["Konak, İzmir'in kalbi ve ana merkezidir.", "Levanten apartmanları, Alsancak daireleri ve dükkân yatırımı öne çıkar."],
    neighborhoods: [{ slug: "alsancak", name: "Alsancak", districtSlug: "konak", sea: "Denize sıfır kordon boyu", character: "İzmir'in en ünlü caddeleri ve sosyal hayatı", highlights: ["Kordon Boyu", "Tarihi Kemeraltı"], avgM2: { sale: 60000, rent: 250 } }]
  },
  {
    slug: "menemen",
    name: "Menemen",
    ...izmir,
    priority: 3,
    summary: "Toprak çömlekçiliği, verimli ovası ve kuzey otoyoluyla hızla konutlaşan ilçe.",
    about: ["Menemen, Ulukent ve Seyrek gibi yeni konutlaşma alanlarıyla büyümektedir."],
    neighborhoods: [{ slug: "mermerli", name: "Mermerli", districtSlug: "menemen", sea: "İç kesim", character: "merkez gelişim bölgesi", highlights: ["Tarihi çömlek atölyeleri"], avgM2: { sale: 22000, rent: 110 } }]
  },
  {
    slug: "narlidere",
    name: "Narlıdere",
    ...izmir,
    priority: 3,
    summary: "Narenciye bahçeleri, ultra lüks konut siteleri ve metro hattıyla modern prestij.",
    about: ["Narlıdere, İzmir'in en yeşil ve düzenli batı ilçesidir.", "Geniş teraslı lüks daire projeleri meşhurdur."],
    neighborhoods: [{ slug: "yenikale", name: "Yenikale", districtSlug: "narlidere", sea: "Körfez manzaralı yamaç", character: "lüks konut siteleri ve metro", highlights: ["Metro istasyonu", "Körfez manzarası"], avgM2: { sale: 54000, rent: 230 } }]
  },
  {
    slug: "odemis",
    name: "Ödemiş",
    ...izmir,
    priority: 3,
    summary: "Birgi tarihi köyü, Bozdağ kayak merkezi ve patatesiyle ünlü büyük tarım havzası.",
    about: ["Ödemiş, Ege'nin en verimli havzalarından birinde kurulmuştur."],
    neighborhoods: [{ slug: "akincilar", name: "Akıncılar", districtSlug: "odemis", sea: "İç kesim", character: "geleneksel ticaret merkezi", highlights: ["Tarihi Birgi Köyü", "Bozdağ"], avgM2: { sale: 17000, rent: 75 } }]
  },
  {
    slug: "selcuk",
    name: "Selçuk",
    ...izmir,
    priority: 3,
    summary: "Efes Antik Kenti, Şirince ve Meryem Ana Evi ile dünya turizminin kesişim noktası.",
    about: ["Selçuk, tarihi turizm potansiyeli en yüksek ilçedir.", "Şirince taş evleri ve butik turizm yatırımları değerlidir."],
    neighborhoods: [{ slug: "ataturk", name: "Atatürk", districtSlug: "selcuk", sea: "Pamucak plajına 6-8 km", character: "turizm ve antik kent merkezi", highlights: ["Efes Antik Kenti", "Şirince"], avgM2: { sale: 35000, rent: 150 } }]
  },
  {
    slug: "tire",
    name: "Tire",
    ...izmir,
    priority: 3,
    summary: "Tarihi hanları, meşhur salı pazarı ve el sanatlarıyla korunan yeşil Ege kültürü.",
    about: ["Tire, zengin süt ve hayvancılık üretimi ve organik tarımıyla tanınır."],
    neighborhoods: [{ slug: "fatih", name: "Fatih", districtSlug: "tire", sea: "İç kesim", character: "tarih ve esnaf kültürü", highlights: ["Tire Salı Pazarı"], avgM2: { sale: 16500, rent: 70 } }]
  },
  {
    slug: "torbali",
    name: "Torbalı",
    ...izmir,
    priority: 3,
    summary: "Sanayi kuruluşları, tarım arazileri ve demiryolu ulaşımıyla güneyin sanayi kalbi.",
    about: ["Torbalı, fabrikaları ve hızlı nüfus artışı ile yeni konut imarlarının merkezidir."],
    neighborhoods: [{ slug: "tepekoy", name: "Tepeköy", districtSlug: "torbali", sea: "İç kesim", character: "sanayi ve yerleşik merkez", highlights: ["İZBAN istasyonu"], avgM2: { sale: 24000, rent: 115 } }]
  },
];

// ---- Türetilmiş yardımcılar ----
export const districtBySlug = (slug: string) =>
  districts.find((d) => d.slug === slug);

export const allNeighborhoods: Neighborhood[] = districts.flatMap(
  (d) => d.neighborhoods
);

export function neighborhoodBySlug(districtSlug: string, slug: string) {
  return districtBySlug(districtSlug)?.neighborhoods.find(
    (n) => n.slug === slug
  );
}

/** Ana odak ilçe (varsayılan içerik kaynağı) */
export const primaryDistrict = districts[0];
