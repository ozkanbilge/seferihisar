import { db as prisma } from '../src/lib/db';
import { listings } from '../src/data/listings';
import { primaryDistrict } from '../src/data/locations';

async function main() {
  console.log('Seed işlemi başlatılıyor...');

  // 1. Locations
  console.log('Bölgeler ekleniyor...');
  
  // Önce primary district
  const seferihisar = await prisma.location.upsert({
    where: { slug: primaryDistrict.slug },
    update: {},
    create: {
      slug: primaryDistrict.slug,
      name: primaryDistrict.name,
      summary: primaryDistrict.summary,
      content: primaryDistrict.about.join('\n'),
      priority: primaryDistrict.priority,
      neighborhoods: {
        create: primaryDistrict.neighborhoods.map((n) => ({
          slug: n.slug,
          name: n.name,
          desc: n.character,
        })),
      },
    },
  });

  // Diğer ilçeler (örneğin Urla, Çeşme vs. src/data/locations.ts içindeki districts listesi)
  // Mevcut yapıda locations.ts sadece export districts yapıyor, `locations` arrayi olarak import ettik ama adı `districts` orada.
  // importu düzeltip yapabiliriz. Şimdilik geçici olarak ekleyelim.
  
  const { districts } = require('../src/data/locations');
  for (const d of districts) {
    if (d.slug === primaryDistrict.slug) continue;
    await prisma.location.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        name: d.name,
        summary: d.summary,
        content: d.about.join('\n'),
        priority: d.priority,
      },
    });
  }

  // 2. Properties (İlanlar)
  console.log('İlanlar ekleniyor...');
  for (const listing of listings) {
    // Bulunduğu lokasyonu ve mahalleyi bul
    const loc = await prisma.location.findUnique({ where: { slug: listing.districtSlug } });
    const neigh = await prisma.neighborhood.findUnique({ where: { slug: listing.neighborhoodSlug } });

    if (loc && neigh) {
      const isLand = listing.typeSlug === "arsa" || listing.typeSlug === "tarla";
      
      // Parse buildingAge (e.g. "5" or "12") to estimate buildYear
      let buildYear: number | null = null;
      if (listing.buildingAge) {
        const ageMatch = listing.buildingAge.match(/^\d+/);
        if (ageMatch) {
          buildYear = 2026 - parseInt(ageMatch[0], 10);
        }
      }

      await prisma.property.upsert({
        where: { slug: listing.slug },
        update: {},
        create: {
          slug: listing.slug,
          title: listing.title,
          desc: listing.description,
          price: listing.price,
          currency: "₺",
          type: listing.typeSlug,
          transaction: listing.transaction,
          status: "active",
          rooms: listing.rooms || null,
          bathrooms: listing.bath || null,
          area: listing.area,
          landArea: isLand ? listing.area : null,
          buildYear: buildYear,
          heating: listing.heating || null,
          floor: listing.floor || null,
          locationId: loc.id,
          neighborhoodId: neigh.id,
          address: null,
          images: listing.images,
          features: listing.features,
        },
      });
    }
  }

  console.log('Seed başarıyla tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
