/**
 * Çok dilli destek: TR (varsayılan), EN, AR (RTL).
 * Dil tercihi "lang" çerezinde tutulur; sunucu bileşenleri cookies() ile,
 * istemci bileşenleri getClientLang() ile okur.
 */

export type Lang = "tr" | "en" | "ar";

export const LANG_COOKIE = "lang";
export const LANGS: { code: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "tr", label: "TR", dir: "ltr" },
  { code: "en", label: "EN", dir: "ltr" },
  { code: "ar", label: "AR", dir: "rtl" },
];

export const isLang = (v: string | undefined | null): v is Lang =>
  v === "tr" || v === "en" || v === "ar";

export const langDir = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

export function getClientLang(): Lang {
  if (typeof document === "undefined") return "tr";
  const m = document.cookie.match(/(?:^|;\s*)lang=(\w+)/);
  return isLang(m?.[1]) ? m[1] : "tr";
}

export function setClientLang(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=31536000`;
}

/* ---- UI sözlüğü ---- */

const tr = {
  nav: {
    "/satilik": "Satılık",
    "/kiralik": "Kiralık",
    "/izmir/seferihisar": "Bölgeler",
    "/blog": "Blog",
    "/hesabim": "Hesabım",
    "/iletisim": "İletişim",
  } as Record<string, string>,
  callUs: "Bizi Arayın",
  viewAllListings: "Tüm İlanları Gör",
  viewAllNeighborhoods: "Tüm Mahalleleri Gör",
  viewAllPosts: "Tüm Yazıları Gör",
  otherDistricts: "İzmir'in Diğer Yatırım Bölgeleri",
  showAll: "Tümünü Gör",
  hide: "Gizle",
  contactForm: "İletişim Formu",
  // Arsa sorgulama
  arsa: {
    eyebrow: "Ücretsiz Emlak Aracı",
    title: "Anlık Arsa Değeri Sorgula",
    subtitle:
      "İl, ilçe ve mahalleyi seçip ada ve parsel numarasını girin; taşınmazınızın kayıtlı alanı, niteliği ve parsel sınırları TKGM Parsel Sorgu sisteminden anlık olarak çekilsin.",
    formTitle: "Sorgulama Formu",
    name: "Adınız",
    surname: "Soyadınız",
    phone: "Telefon Numaranız",
    il: "İl",
    ilce: "İlçe",
    mahalle: "Mahalle",
    ada: "Ada",
    parsel: "Parsel",
    loadingList: "Yükleniyor...",
    selectFirst: "Önce ilçe seçin",
    select: "Seçiniz",
    submit: "Hızlı Değer Sorgula",
    submitting: "TKGM Sorgulanıyor...",
    waitingTitle: "Değer Raporu Bekleniyor",
    waitingText:
      "Lütfen sol taraftaki formu doldurarak parsel sorgusunu başlatın. TKGM kayıtlı parsel bilgileri ve kadastro çizimi burada belirecektir.",
    scanningTitle: "TKGM Parsel Sorgu Sistemi Taranıyor",
    scanningText: "Ada/parsel sınırları Tapu Kadastro kayıtlarından getiriliyor...",
    found: "TKGM Kaydı Bulundu",
    area: "Kayıtlı Alan (TKGM)",
    quality: "Nitelik",
    sheet: "Pafta",
    ground: "Zemin Durumu",
    location: "Mevkii",
    unitPrice: "Ort. Arsa m² Fiyatı",
    estimated: "Tahmini Toplam Piyasa Değeri",
    guarantee: "Satış Güvencesi",
    guaranteeText: "Private Estate ile piyasa değerinin %30 üzerine satış garantisi",
    contactDetail: "Detaylı değerleme için bizimle iletişime geçin.",
    noData:
      "Bu bölge için güncel emsal verimiz bulunmuyor. Detaylı değerleme için bizimle iletişime geçin — WhatsApp butonunu kullanabilirsiniz.",
    whatsapp: "Bana Bildir & WhatsApp İletişim",
    geomMissing: "Parsel geometrisi alınamadı.",
    source: "Kaynak: TKGM Parsel Sorgu",
    drawing: "Tapu Kadastro Kadastral Çizim",
    fillAll: "Lütfen il, ilçe, mahalle ile ada ve parsel numaralarını girin.",
    queryError: "Sorgulama esnasında bir hata oluştu. Lütfen tekrar deneyin.",
    lastQueried: "Son sorguladığınız parsel",
  },
};

type Dict = typeof tr;

const en: Dict = {
  nav: {
    "/satilik": "For Sale",
    "/kiralik": "For Rent",
    "/izmir/seferihisar": "Districts",
    "/blog": "Blog",
    "/hesabim": "My Account",
    "/iletisim": "Contact",
  },
  callUs: "Call Us",
  viewAllListings: "View All Listings",
  viewAllNeighborhoods: "View All Neighborhoods",
  viewAllPosts: "View All Posts",
  otherDistricts: "Other Investment Districts of İzmir",
  showAll: "View All",
  hide: "Hide",
  contactForm: "Contact Form",
  arsa: {
    eyebrow: "Free Real Estate Tool",
    title: "Instant Land Value Inquiry",
    subtitle:
      "Select province, district and neighborhood, enter block and parcel numbers; the registered area, quality and parcel boundaries are fetched live from the official TKGM Parcel Inquiry system.",
    formTitle: "Inquiry Form",
    name: "First Name",
    surname: "Last Name",
    phone: "Phone Number",
    il: "Province",
    ilce: "District",
    mahalle: "Neighborhood",
    ada: "Block",
    parsel: "Parcel",
    loadingList: "Loading...",
    selectFirst: "Select district first",
    select: "Select",
    submit: "Quick Value Inquiry",
    submitting: "Querying TKGM...",
    waitingTitle: "Awaiting Value Report",
    waitingText:
      "Fill in the form on the left to start the parcel inquiry. Registered TKGM parcel details and the cadastral drawing will appear here.",
    scanningTitle: "Scanning TKGM Parcel Inquiry System",
    scanningText: "Fetching block/parcel boundaries from Land Registry records...",
    found: "TKGM Record Found",
    area: "Registered Area (TKGM)",
    quality: "Quality",
    sheet: "Sheet",
    ground: "Ground Status",
    location: "Locality",
    unitPrice: "Avg. Land Price per m²",
    estimated: "Estimated Total Market Value",
    guarantee: "Sale Assurance",
    guaranteeText: "Sale guarantee at 30% above market value with Private Estate",
    contactDetail: "Contact us for a detailed valuation.",
    noData:
      "We don't have current comparable data for this region. Contact us for a detailed valuation — you can use the WhatsApp button.",
    whatsapp: "Notify Me & WhatsApp Contact",
    geomMissing: "Parcel geometry unavailable.",
    source: "Source: TKGM Parcel Inquiry",
    drawing: "Land Registry Cadastral Drawing",
    fillAll: "Please select province, district, neighborhood and enter block and parcel numbers.",
    queryError: "An error occurred during the inquiry. Please try again.",
    lastQueried: "Your last queried parcel",
  },
};

const ar: Dict = {
  nav: {
    "/satilik": "للبيع",
    "/kiralik": "للإيجار",
    "/izmir/seferihisar": "المناطق",
    "/blog": "المدونة",
    "/hesabim": "حسابي",
    "/iletisim": "اتصل بنا",
  },
  callUs: "اتصل بنا",
  viewAllListings: "عرض جميع العقارات",
  viewAllNeighborhoods: "عرض جميع الأحياء",
  viewAllPosts: "عرض جميع المقالات",
  otherDistricts: "مناطق استثمارية أخرى في إزمير",
  showAll: "عرض الكل",
  hide: "إخفاء",
  contactForm: "نموذج الاتصال",
  arsa: {
    eyebrow: "أداة عقارية مجانية",
    title: "استعلام فوري عن قيمة الأرض",
    subtitle:
      "اختر المحافظة والمنطقة والحي، وأدخل رقم القطعة والبارسيل؛ يتم جلب المساحة المسجلة ونوع العقار وحدود القطعة مباشرة من نظام الاستعلام الرسمي TKGM.",
    formTitle: "نموذج الاستعلام",
    name: "الاسم",
    surname: "اللقب",
    phone: "رقم الهاتف",
    il: "المحافظة",
    ilce: "المنطقة",
    mahalle: "الحي",
    ada: "رقم القطعة",
    parsel: "البارسيل",
    loadingList: "جارٍ التحميل...",
    selectFirst: "اختر المنطقة أولاً",
    select: "اختر",
    submit: "استعلام سريع عن القيمة",
    submitting: "جارٍ الاستعلام من TKGM...",
    waitingTitle: "في انتظار تقرير القيمة",
    waitingText:
      "يرجى ملء النموذج لبدء استعلام القطعة. ستظهر هنا بيانات القطعة المسجلة لدى TKGM والرسم العقاري.",
    scanningTitle: "جارٍ مسح نظام استعلام القطع TKGM",
    scanningText: "جارٍ جلب حدود القطعة من سجلات الطابو...",
    found: "تم العثور على سجل TKGM",
    area: "المساحة المسجلة (TKGM)",
    quality: "النوع",
    sheet: "الخريطة",
    ground: "حالة الأرض",
    location: "الموقع",
    unitPrice: "متوسط سعر م² للأرض",
    estimated: "القيمة السوقية التقديرية الإجمالية",
    guarantee: "ضمان البيع",
    guaranteeText: "ضمان البيع بنسبة 30% فوق القيمة السوقية مع Private Estate",
    contactDetail: "تواصل معنا للحصول على تقييم مفصل.",
    noData:
      "لا تتوفر لدينا بيانات مقارنة حديثة لهذه المنطقة. تواصل معنا للتقييم المفصل — يمكنك استخدام زر واتساب.",
    whatsapp: "أبلغني وتواصل عبر واتساب",
    geomMissing: "تعذر الحصول على هندسة القطعة.",
    source: "المصدر: استعلام القطع TKGM",
    drawing: "الرسم العقاري للطابو",
    fillAll: "يرجى اختيار المحافظة والمنطقة والحي وإدخال رقم القطعة والبارسيل.",
    queryError: "حدث خطأ أثناء الاستعلام. يرجى المحاولة مرة أخرى.",
    lastQueried: "آخر قطعة استعلمت عنها",
  },
};

const dicts: Record<Lang, Dict> = { tr, en, ar };

export function getDict(lang: Lang): Dict {
  return dicts[lang] ?? tr;
}
