const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAssets() {
  console.log('--- Updating LIVORA Hero Image and Brand Logo ---');

  // 1. Update Hero Banners
  // Multi-category luxury flatlay image featuring jewelry/accessories, beauty tools, cosmetics, handbag, perfumes
  const heroImage1 = 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1600&auto=format&fit=crop';
  const heroImage2 = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop';

  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  if (banners.length > 0) {
    await prisma.banner.update({
      where: { id: banners[0].id },
      data: {
        imageUrl: heroImage1,
        title: 'أناقة متكاملة تُبرز سحركِ الخاص',
        subtitle: 'تشكيلة LIVORA الحصرية 2026',
        description: 'اكتشفي تشكيلة شاملة ومتكاملة من أرقى الإكسسوارات، الحقائب، مستحضرات التجميل، وأدوات العناية لتمنحك إطلالة ملكية في كل مناسبة.',
      },
    });
    console.log('✓ Banner 1 updated with multi-category luxury flatlay image');
  }

  if (banners.length > 1) {
    await prisma.banner.update({
      where: { id: banners[1].id },
      data: {
        imageUrl: heroImage2,
        title: 'جمال، إكسسوارات، وعناية متكاملة',
        subtitle: 'مختارات الموسم الحصرية',
        description: 'حقائب، إكسسوارات شعر، مكياج، وعطور فاخرة بأسعار استثنائية مع توصيل سريع لكافة المحافظات اليمنية.',
      },
    });
    console.log('✓ Banner 2 updated');
  }

  // 2. Update About Story image to the official LIVORA Logo
  await prisma.setting.upsert({
    where: { key: 'about_image' },
    update: { value: '/images/livora-logo.jpg' },
    create: {
      key: 'about_image',
      value: '/images/livora-logo.jpg',
      group: 'ABOUT',
      description: 'صورة قسم من نحن (شعار LIVORA الرسمي)',
    },
  });

  await prisma.setting.upsert({
    where: { key: 'store_logo' },
    update: { value: '/images/livora-logo.jpg' },
    create: {
      key: 'store_logo',
      value: '/images/livora-logo.jpg',
      group: 'GENERAL',
      description: 'شعار المتجر الرسمي',
    },
  });

  console.log('✓ About section image and Store Logo updated to /images/livora-logo.jpg');
}

updateAssets()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
