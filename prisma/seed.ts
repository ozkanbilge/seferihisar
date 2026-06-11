import { PrismaClient } from '@prisma/client';
import { listings } from '../src/data/listings';
import { locations, primaryDistrict } from '../src/data/locations';

const prisma = new PrismaClient();

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
      content: primaryDistrict.content,
      priority: primaryDistrict.priority,
      neighborhoods: {
        create: primaryDistrict.neighborhoods.map((n) => ({
          slug: n.slug,
          name: n.name,
          desc: n.desc,
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
        content: d.content,
        priority: d.priority,
      },
    });
  }

  // 2. Properties (İlanlar)
  console.log('İlanlar ekleniyor...');
  for (const listing of listings) {
    // Bulunduğu lokasyonu ve mahalleyi bul
    const loc = await prisma.location.findUnique({ where: { slug: listing.location.districtSlug } });
    const neigh = await prisma.neighborhood.findUnique({ where: { slug: listing.location.neighborhoodSlug } });

    if (loc && neigh) {
      await prisma.property.upsert({
        where: { slug: listing.slug },
        update: {},
        create: {
          slug: listing.slug,
          title: listing.title,
          desc: listing.desc,
          price: listing.price,
          currency: listing.currency,
          type: listing.type,
          transaction: listing.transaction,
          status: listing.status,
          rooms: listing.features.rooms,
          bathrooms: listing.features.bathrooms,
          area: listing.features.area,
          landArea: listing.features.landArea,
          buildYear: listing.features.buildYear,
          heating: listing.features.heating,
          floor: listing.features.floor,
          locationId: loc.id,
          neighborhoodId: neigh.id,
          address: listing.location.address,
          images: listing.images,
          features: listing.highlights,
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
