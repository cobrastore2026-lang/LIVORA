const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateHeroBanners() {
  console.log('--- Updating LIVORA Hero Banners to User Images ---');

  const heroImage1 = '/images/hero-slide-1.jpg';
  const heroImage2 = '/images/hero-slide-2.jpg';

  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  
  if (banners.length > 0) {
    await prisma.banner.update({
      where: { id: banners[0].id },
      data: {
        imageUrl: heroImage1,
      },
    });
    console.log('✓ Banner 1 image updated to /images/hero-slide-1.jpg');
  }

  if (banners.length > 1) {
    await prisma.banner.update({
      where: { id: banners[1].id },
      data: {
        imageUrl: heroImage2,
      },
    });
    console.log('✓ Banner 2 image updated to /images/hero-slide-2.jpg');
  }
}

updateHeroBanners()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
