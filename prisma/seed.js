const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding LIVORA Luxury Store Data ---');

  // 1. Seed Admin
  const adminEmail = 'admin@livora.ye';
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123456', 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        name: 'مدير ليفورا',
        passwordHash: passwordHash,
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✓ Admin user created: admin@livora.ye / admin123456');
  }

  // 2. Seed Settings
  const defaultSettings = [
    { key: 'store_name', value: 'LIVORA | ليفورا', group: 'GENERAL', description: 'اسم المتجر' },
    { key: 'whatsapp_number', value: '967737462144', group: 'CONTACT', description: 'رقم الواتساب للطلبات' },
    { key: 'whatsapp_message_prefix', value: 'السلام عليكم، أرغب في طلب:', group: 'CONTACT', description: 'مقدمة رسالة الواتساب' },
    { key: 'instagram_url', value: 'https://instagram.com/livora_ye', group: 'SOCIAL', description: 'رابط انستغرام' },
    { key: 'tiktok_url', value: 'https://tiktok.com/@livora.ye', group: 'SOCIAL', description: 'رابط تيك توك' },
    { key: 'currency_symbol', value: 'ر.ي', group: 'GENERAL', description: 'رمز العملة الافتراضية' },
    { key: 'store_description', value: 'الوجهة الأولى للمرأة الأنيقة في اليمن - إكسسوارات، مكياج، ومنتجات عناية وجمال فاخرة ومختارة بعناية فائقة.', group: 'GENERAL', description: 'وصف المتجر المختصر' },
    { key: 'about_title', value: 'قصة ليفورا | فخامة تليق بكِ', group: 'ABOUT', description: 'عنوان قسم من نحن' },
    { key: 'about_text', value: 'انطلقت LIVORA لتكون المعيار الحقيقي للأناقة والجمال العصري في اليمن. نختار كل قطعة بعناية استثنائية لتلهم كل امرأة ثقة مطلقة وإشراقة ساحرة. نؤمن بأن الجمال تفاصيل دقيقة، ولذا نوفر منتجات راقية بأعلى معايير الجودة لتصل إلى باب منزلك بكل فخامة وسرعة.', group: 'ABOUT', description: 'نص قصة المتجر' },
    { key: 'about_image', value: '/images/livora-logo.jpg', group: 'ABOUT', description: 'صورة قسم من نحن (شعار LIVORA الرسمي)' },
    { key: 'store_logo', value: '/images/livora-logo.jpg', group: 'GENERAL', description: 'شعار المتجر الرسمي' },
    { key: 'shipping_notice', value: 'توصيل متاح إلى كافة محافظات ومدن الجمهورية اليمنية بكل سرعة وأمان.', group: 'GENERAL', description: 'تنبيه الشحن' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group, description: s.description },
      create: s,
    });
  }
  console.log('✓ Store settings initialized');

  // 3. Seed Categories
  const categoriesData = [
    {
      name: 'الإكسسوارات',
      slug: 'accessories',
      description: 'أرقى الإكسسوارات والقطع المطلية والمجوهرات العصرية التي تزيدك تألقاً.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      sortOrder: 1,
    },
    {
      name: 'المكياج',
      slug: 'makeup',
      description: 'مستحضرات تجميل فاخرة بدرجات ساحرة ولمسات مخملية تدوم طويلاً.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
      sortOrder: 2,
    },
    {
      name: 'منتجات العناية',
      slug: 'skincare',
      description: 'عناية فائقة للبشرة مستخلصة من أفضل المكونات الطبيعية للنضارة والنعومة.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      sortOrder: 3,
    },
    {
      name: 'أدوات التجميل',
      slug: 'beauty-tools',
      description: 'فرش مكياج وأدوات تطبيق احترافية لنتائج مثالية في كل إطلالة.',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop',
      sortOrder: 4,
    },
    {
      name: 'إكسسوارات الشعر',
      slug: 'hair-accessories',
      description: 'بنس وربطات وتيجان مخملية ولؤلؤية تضيف تسريحتك لمسة ملكية.',
      image: 'https://images.unsplash.com/photo-1608248597359-0a693b4a2432?q=80&w=800&auto=format&fit=crop',
      sortOrder: 5,
    },
    {
      name: 'الحقائب',
      slug: 'handbags',
      description: 'حقائب سهرة وكلاتشات يومية أنيقة بتصاميم عصرية وتشطيبات راقية.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      sortOrder: 6,
    },
    {
      name: 'منتجات الجمال',
      slug: 'beauty-products',
      description: 'عطور وزيوت عطرية ومجموعات متكاملة للمناسبات الفاخرة.',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
      sortOrder: 7,
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = c.id;
  }
  console.log('✓ Categories created');

  // 4. Seed Banners / Hero
  const bannersData = [
    {
      title: 'أناقة متكاملة تُبرز سحركِ الخاص',
      subtitle: 'تشكيلة LIVORA الحصرية 2026',
      description: 'اكتشفي تشكيلة شاملة ومتكاملة من أرقى الإكسسوارات، الحقائب، مستحضرات التجميل، وأدوات العناية لتمنحك إطلالة ملكية في كل تفصيل.',
      imageUrl: '/images/hero-slide-1.jpg',
      buttonText: 'اكتشفي التشكيلة الجديدة',
      buttonLink: '/products',
      badgeText: 'مجموعة فاخرة وحصرية',
      position: 'HERO',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'عناية متكاملة وإشراقة طبيعية',
      subtitle: 'عروض الموسم الحصرية',
      description: 'منتجات العناية بالبشرة والمكياج الأكثر طلباً بأسعار استثنائية مع توصيل لكافة المحافظات.',
      imageUrl: '/images/hero-slide-2.jpg',
      buttonText: 'تسوقي العروض المميزة',
      buttonLink: '/products?filter=offers',
      badgeText: 'خصومات تصل إلى 30%',
      position: 'HERO',
      isActive: true,
      sortOrder: 2,
    },
  ];

  await prisma.banner.deleteMany({});
  for (const b of bannersData) {
    await prisma.banner.create({ data: b });
  }
  console.log('✓ Hero banners created');

  // 5. Seed 20 Luxury Sample Products
  const productsData = [
    // 1. Accessories
    {
      name: 'عقد ليفورا الذهبي الملكي مرصع بالزركون',
      slug: 'livora-royal-gold-necklace',
      sku: 'LVR-ACC-001',
      categoryId: categoryMap['accessories'],
      price: 24000,
      compareAtPrice: 32000,
      discount: 25,
      description: 'عقد فاخر مطلي بالذهب عيار 18 بتصميم كلاسيكي ناعم مرصع بأحجار الزركون النقية السويسرية التي تمنحك بريقاً استثنائياً يدوم طويلاً، مقاوم لتغير اللون ومريح للبشرة الحساسة.',
      shortDescription: 'عقد ذهبي راقٍ مطلي عيار 18 مع زركون نقي لإطلالة ساحرة.',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      displayStockCount: 4,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'اللون', optionValue: 'ذهبي شامبين', priceAdjustment: 0, isDefault: true },
        { name: 'اللون', optionValue: 'فضي ملكي', priceAdjustment: 0, isDefault: false },
        { name: 'اللون', optionValue: 'روز جولد', priceAdjustment: 1000, isDefault: false },
      ],
    },
    {
      name: 'طقم أساور ليفورا بتصميم الماسة الهندسية',
      slug: 'livora-geometric-bracelets-set',
      sku: 'LVR-ACC-002',
      categoryId: categoryMap['accessories'],
      price: 18500,
      compareAtPrice: 22000,
      discount: 16,
      description: 'طقم أساور أنيق ومزدوج بتصميم عصري هندسي مفتوح يناسب جميع مقاسات المعصم، مصنوع من الفولاذ المقاوم للصدأ ومطلي بعناية ليعكس بريق الفخامة.',
      shortDescription: 'طقم أساور هندسية مطلية بتصميم مزدوج وعصري.',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      displayStockCount: 6,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1611591475102-468ae396a568?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'اللون', optionValue: 'ذهبي شامبين', priceAdjustment: 0, isDefault: true },
        { name: 'اللون', optionValue: 'فضي برّاق', priceAdjustment: 0, isDefault: false },
      ],
    },
    {
      name: 'أقراط اللؤلؤ الطبيعي المتدلية',
      slug: 'natural-pearl-drop-earrings',
      sku: 'LVR-ACC-003',
      categoryId: categoryMap['accessories'],
      price: 14000,
      compareAtPrice: 17500,
      discount: 20,
      description: 'أقراط متدلية راقية بحبات اللؤلؤ الطبيعي اللامع، مصممة بأناقة تفيض بالأنوثة لتناسب السهرات والمناسبات الخاصة.',
      shortDescription: 'أقراط لؤلؤية متدلية راقية للمناسبات والسهرات.',
      isFeatured: true,
      isBestSeller: false,
      isNew: true,
      displayStockCount: 3,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'الخيار', optionValue: 'لؤلؤ كلاسيكي مع ذهبي', priceAdjustment: 0, isDefault: true },
        { name: 'الخيار', optionValue: 'لؤلؤ نقي مع فضي', priceAdjustment: 0, isDefault: false },
      ],
    },

    // 2. Makeup
    {
      name: 'مجموعة أحمر الشفاه المخملية فيلفت نود LIVORA',
      slug: 'livora-velvet-nude-lip-set',
      sku: 'LVR-MAK-001',
      categoryId: categoryMap['makeup'],
      price: 16500,
      compareAtPrice: 21000,
      discount: 21,
      description: 'مجموعة أحمر شفاه مخملي غنية بالزيوت المرطبة وزبدة الشيا، تركيبة تدوم حتى 12 ساعة دون جفاف مع ألوان نود راقية تلائم مختلف درجات البشرة.',
      shortDescription: 'أحمر شفاه مخملي غير لامع وثابت بتدرجات النود الجذابة.',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      displayStockCount: 5,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'الدرجة', optionValue: 'كلاسيك نود 01', priceAdjustment: 0, isDefault: true },
        { name: 'الدرجة', optionValue: 'وردي دافئ 02', priceAdjustment: 0, isDefault: false },
        { name: 'الدرجة', optionValue: 'توتي مخملي 03', priceAdjustment: 0, isDefault: false },
      ],
    },
    {
      name: 'باليت ظلال العيون الذهبية الدافئة',
      slug: 'golden-warm-eyeshadow-palette',
      sku: 'LVR-MAK-002',
      categoryId: categoryMap['makeup'],
      price: 22000,
      compareAtPrice: 28000,
      discount: 21,
      description: 'باليت ظلال عيون تحتوي على 12 لوناً فائق الصباغة بين اللامع والمات، سهلة الدمج وتمنحك خيارات لانهائية من الإطلالات اليومية البسيطة إلى السموكي الفاخر.',
      shortDescription: 'باليت ظلال عيون بـ 12 درجة دافئة ولامعة عالية الثبات.',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      displayStockCount: 7,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'النوع', optionValue: 'مجموعة السهرة الذهبية', priceAdjustment: 0, isDefault: true },
        { name: 'النوع', optionValue: 'مجموعة الروز المات', priceAdjustment: 0, isDefault: false },
      ],
    },
    {
      name: 'هايلايتر ليفورا السائل بريق الشامبين',
      slug: 'livora-liquid-champagne-highlighter',
      sku: 'LVR-MAK-003',
      categoryId: categoryMap['makeup'],
      price: 13000,
      compareAtPrice: 16000,
      discount: 19,
      description: 'هايلايتر سائل خفيف الوزن يمتزج بسلاسة مع كريم الأساس أو يوضع منفرداً على عظام الخد لمنحك توهجاً زجاجياً صحياً ومشرقاً.',
      shortDescription: 'هايلايتر سائل ببريق الشامبين لإضاءة وجه ساحرة.',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      displayStockCount: 4,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'اللون', optionValue: 'شامبين جلو', priceAdjustment: 0, isDefault: true },
        { name: 'اللون', optionValue: 'برونز ذهبي', priceAdjustment: 0, isDefault: false },
      ],
    },

    // 3. Skincare
    {
      name: 'سيروم حمض الهيالورونيك وفيتامين C للنضارة الفائقة',
      slug: 'hyaluronic-vitamin-c-serum',
      sku: 'LVR-SKN-001',
      categoryId: categoryMap['skincare'],
      price: 19500,
      compareAtPrice: 25000,
      discount: 22,
      description: 'تركيبة مركزة وغنية بحمض الهيالورونيك النقي وفيتامين سي المضاد للأكسدة، تعزز ترطيب البشرة العميق وتوحد لونها وتقلل من علامات التعب والإجهاد.',
      shortDescription: 'سيروم مركز لتفتيح البشرة والترطيب العميق والنضارة.',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      displayStockCount: 5,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'الحجم', optionValue: '30 مل', priceAdjustment: 0, isDefault: true },
        { name: 'الحجم', optionValue: '50 مل', priceAdjustment: 4000, isDefault: false },
      ],
    },
    {
      name: 'كريم الليل لترميم البشرة بالكولاجين البحري',
      slug: 'marine-collagen-night-cream',
      sku: 'LVR-SKN-002',
      categoryId: categoryMap['skincare'],
      price: 21000,
      compareAtPrice: 27000,
      discount: 22,
      description: 'كريم ليلي غني بمستخلصات الكولاجين البحري والزيوت الطبيعية المغذية، يعمل أثناء النوم على تجديد خلايا البشرة واستعادة مرونتها ونعومتها.',
      shortDescription: 'كريم ليلي مغذٍ بالكولاجين لتجديد البشرة أثناء النوم.',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      displayStockCount: 3,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'النوع', optionValue: 'عبوة 50 غرام', priceAdjustment: 0, isDefault: true },
      ],
    },
    {
      name: 'زيت الورد الدمشقي العضوي النقي للوجه',
      slug: 'damask-rose-organic-face-oil',
      sku: 'LVR-SKN-003',
      categoryId: categoryMap['skincare'],
      price: 17000,
      compareAtPrice: 20000,
      discount: 15,
      description: 'قطرات سحرية من زيت الورد العضوي المعصور على البارد، يمنح البشرة إشراقة حريرية ورائحة عطرية آسرة تهدئ الحواس وتغذي المسام.',
      shortDescription: 'زيت طبيعي فاخر لنضارة ونعومة البشرة برائحة الورد.',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      displayStockCount: 4,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1608248597359-0a693b4a2432?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'الحجم', optionValue: '30 مل', priceAdjustment: 0, isDefault: true },
      ],
    },

    // 4. Beauty Tools
    {
      name: 'طقم فرش المكياج الاحترافية ليفورا 12 قطعة مع حقيبة جلدية',
      slug: 'livora-pro-makeup-brush-set',
      sku: 'LVR-TLS-001',
      categoryId: categoryMap['beauty-tools'],
      price: 23500,
      compareAtPrice: 30000,
      discount: 22,
      description: 'طقم فرش مكياج فائق النعومة مصنوع من ألياف صناعية صديقة للبيئة وكثيفة، تشمل جميع فراشي الوجه والعيون الأساسية وتأتي في حقيبة جلدية فاخرة باللون السكري والذهبي.',
      shortDescription: '12 فرشاة مكياج احترافية ناعمة مع حقيبة جلدية فاخرة.',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      displayStockCount: 3,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'لون المقبض', optionValue: 'عاجي مع ذهبي', priceAdjustment: 0, isDefault: true },
        { name: 'لون المقبض', optionValue: 'أسود مطفي مع روز جولد', priceAdjustment: 0, isDefault: false },
      ],
    },
    {
      name: 'أداة تدليك الوجه بحجر اليشم الأخضر الطبيعي والجواشا',
      slug: 'jade-roller-and-gua-sha-set',
      sku: 'LVR-TLS-002',
      categoryId: categoryMap['beauty-tools'],
      price: 12500,
      compareAtPrice: 16000,
      discount: 22,
      description: 'مجموعة الرول وحجر الجواشا المصنوعة من حجر اليشم الطبيعي 100%، تساعد على تحفيز الدورة الدموية وتخفيف انتفاخ الوجه وشد البشرة ومنحها حيوية ملحوظة.',
      shortDescription: 'رولر وحجر جواشا طبيعي لشد الوجه وتحفيز النضارة.',
      isFeatured: false,
      isBestSeller: false,
      isNew: false,
      displayStockCount: 8,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'نوع الحجر', optionValue: 'اليشم الأخضر الإمبراطوري', priceAdjustment: 0, isDefault: true },
        { name: 'نوع الحجر', optionValue: 'الكوارتز الوردي الفاخر', priceAdjustment: 1000, isDefault: false },
      ],
    },

    // 5. Hair Accessories
    {
      name: 'طوق الشعر المخملي الملكي المرصع بالكريستال',
      slug: 'royal-velvet-crystal-headband',
      sku: 'LVR-HAR-001',
      categoryId: categoryMap['hair-accessories'],
      price: 11000,
      compareAtPrice: 14000,
      discount: 21,
      description: 'طوق شعر عريض مبطن بالمخمل الفاخر ومرصع يدpipeاً بحبات الكريستال اللامعة، مريح للغاية ولا يسبب أي ضغط على الرأس ليمنحك إطلالة راقية في مناسباتك.',
      shortDescription: 'طوق مخملي عريض مرصع بالكريستال للمناسبات الفاخرة.',
      isFeatured: true,
      isBestSeller: false,
      isNew: true,
      displayStockCount: 2,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1608248597359-0a693b4a2432?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'اللون', optionValue: 'أسود مخملي', priceAdjustment: 0, isDefault: true },
        { name: 'اللون', optionValue: 'عاجي شامبين', priceAdjustment: 0, isDefault: false },
        { name: 'اللون', optionValue: 'زمردي عميق', priceAdjustment: 0, isDefault: false },
      ],
    },
    {
      name: 'مجموعة مشابك الشعر اللؤلؤية الكلاسيكية 4 قطع',
      slug: 'pearl-hair-clips-set-4pcs',
      sku: 'LVR-HAR-002',
      categoryId: categoryMap['hair-accessories'],
      price: 7500,
      compareAtPrice: 9500,
      discount: 21,
      description: 'مجموعة مشابك وبنس شعر أنيقة بتطريزات اللؤلؤ الصناعي عالي الجودة والذهب المصقول، تثبت الشعر بنعومة وأناقة.',
      shortDescription: 'طقم 4 مشابك لؤلؤية أنيقة بتصاميم متنوعة.',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      displayStockCount: 6,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608248597359-0a693b4a2432?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'النوع', optionValue: 'طقم اللؤلؤ الذهبي', priceAdjustment: 0, isDefault: true },
      ],
    },
    {
      name: 'ربطة الشعر الحريرية سيلك ليفورا 100% طبيعي',
      slug: 'livora-100-pure-silk-scrunchie',
      sku: 'LVR-HAR-003',
      categoryId: categoryMap['hair-accessories'],
      price: 6000,
      compareAtPrice: 8000,
      discount: 25,
      description: 'ربطة شعر مصنوعة من حرير التوت الطبيعي 100% لحماية الشعر من التقصف والتساقط والمحافظة على رطوبته الطبيعية دون ترك علامات عند فك الشعر.',
      shortDescription: 'ربطة حرير توت طبيعي 100% فائقة النعومة لحماية الشعر.',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      displayStockCount: 9,
      showStockBadge: false,
      images: [
        'https://images.unsplash.com/photo-1608248597359-0a693b4a2432?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'اللون', optionValue: 'شامبين عاجي', priceAdjustment: 0, isDefault: true },
        { name: 'اللون', optionValue: 'وردي بودري', priceAdjustment: 0, isDefault: false },
        { name: 'اللون', optionValue: 'أسود ملكي', priceAdjustment: 0, isDefault: false },
      ],
    },

    // 6. Handbags
    {
      name: 'حقيبة كلاتش السهرة الفاخرة بقفل ذهبي منحوت',
      slug: 'evening-luxury-clutch-gold-lock',
      sku: 'LVR-BAG-001',
      categoryId: categoryMap['handbags'],
      price: 34000,
      compareAtPrice: 42000,
      discount: 19,
      description: 'حقيبة يد كلاتش استثنائية بتصميم صلب وأنيق مغطى بالساتان الحريري مع قفل ذهبي منحوت بدقة وسلسلة كتف ذهبية قابلة للإزالة لحملها بعدة طرق راقية.',
      shortDescription: 'حقيبة كلاتش للسهرات بقفل ذهبي وسلسلة كتف أنيقة.',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      displayStockCount: 2,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'اللون', optionValue: 'عاجي شامبين', priceAdjustment: 0, isDefault: true },
        { name: 'اللون', optionValue: 'أسود فاخر', priceAdjustment: 0, isDefault: false },
        { name: 'اللون', optionValue: 'ذهبي متلألئ', priceAdjustment: 2000, isDefault: false },
      ],
    },
    {
      name: 'حقيبة كروس ليفورا من الجلد المنقوش بتطريزات هندسية',
      slug: 'livora-embossed-crossbody-bag',
      sku: 'LVR-BAG-002',
      categoryId: categoryMap['handbags'],
      price: 29500,
      compareAtPrice: 36000,
      discount: 18,
      description: 'حقيبة يد عملية وفاخرة من الجلد النباتي عالي الجودة مع نقوش هندسية أنيقة وحزام قابل للتعديل ومساحة واسعة تكفي لجميع مقتنياتك اليومية.',
      shortDescription: 'حقيبة كروس راقية من الجلد المنقوش للمشاوير واليوميات.',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      displayStockCount: 4,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'اللون', optionValue: 'بيج عاجي', priceAdjustment: 0, isDefault: true },
        { name: 'اللون', optionValue: 'هافان كلاسيكي', priceAdjustment: 0, isDefault: false },
        { name: 'اللون', optionValue: 'أسود ملكي', priceAdjustment: 0, isDefault: false },
      ],
    },
    {
      name: 'حقيبة كتف مصغرة ميني ليدي ليفورا',
      slug: 'mini-lady-livora-shoulder-bag',
      sku: 'LVR-BAG-003',
      categoryId: categoryMap['handbags'],
      price: 26000,
      compareAtPrice: 31000,
      discount: 16,
      description: 'حقيبة ميني ترند مستوحاة من خطوط الموضة العالمية، تجمع بين الحجم الصغير الجذاب واللمسات الذهبية اللامعة لإطلالة أنثوية مميزة.',
      shortDescription: 'حقيبة كتف ميني أنيقة بتفاصيل ذهبية جذابة.',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      displayStockCount: 3,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'اللون', optionValue: 'سكري لؤلؤي', priceAdjustment: 0, isDefault: true },
        { name: 'اللون', optionValue: 'وردي باستيل', priceAdjustment: 0, isDefault: false },
      ],
    },

    // 7. Beauty Products & Perfumes
    {
      name: 'عطر ليفورا رويال نايت أو دو بارفان 100 مل',
      slug: 'livora-royal-night-perfume-100ml',
      sku: 'LVR-BTY-001',
      categoryId: categoryMap['beauty-products'],
      price: 38000,
      compareAtPrice: 48000,
      discount: 21,
      description: 'توليفة عطرية ملكية ساحرة تجمع بين نفحات العود الأبيض والورد البلغاري مع لمسات من الفانيليا والمسك الفاخر لثبات استثنائي يدوم لأيام.',
      shortDescription: 'عطر شرقي فرنسي فاخر يجمع العود الأبيض والمسك والفانيليا.',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      displayStockCount: 3,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'الحجم', optionValue: '100 مل', priceAdjustment: 0, isDefault: true },
        { name: 'الحجم', optionValue: '50 مل خاص بالسفر', priceAdjustment: -12000, isDefault: false },
      ],
    },
    {
      name: 'زيت مسك العروس المعطر للجسم والشعر',
      slug: 'bridal-musk-body-and-hair-oil',
      sku: 'LVR-BTY-002',
      categoryId: categoryMap['beauty-products'],
      price: 15000,
      compareAtPrice: 19000,
      discount: 21,
      description: 'زيت معطر مخملي للجسم والشعر بمزيج المسك الأبيض البودري وزهرة الأوركيد، يمنح الجسم نعومة حريرية ورائحة أنثوية تدوم طويلاً.',
      shortDescription: 'زيت مسك العروس الأبيض للجسم والشعر بنعومة فائقة.',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      displayStockCount: 6,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'الرائحة', optionValue: 'مسك البودرة الكلاسيكي', priceAdjustment: 0, isDefault: true },
        { name: 'الرائحة', optionValue: 'مسك الرمان المنعش', priceAdjustment: 0, isDefault: false },
      ],
    },
    {
      name: 'شمعة ليفورا المعطرة برائحة العنبر وخشب الصندل',
      slug: 'livora-amber-sandalwood-scented-candle',
      sku: 'LVR-BTY-003',
      categoryId: categoryMap['beauty-products'],
      price: 11500,
      compareAtPrice: 14500,
      discount: 21,
      description: 'شمعة صويا طبيعية 100% مصبوبة يدوياً في وعاء زجاجي ذهبي فاخر، تنشر عبقاً دافئاً من العنبر وخشب الصندل لتهيئة أجواء استرخاء ملكية.',
      shortDescription: 'شمعة صويا طبيعية فاخرة بوعاء زجاجي ذهبي أنيق.',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      displayStockCount: 5,
      showStockBadge: true,
      images: [
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
      ],
      variants: [
        { name: 'الرائحة', optionValue: 'العنبر والصندل', priceAdjustment: 0, isDefault: true },
        { name: 'الرائحة', optionValue: 'اللافندر والفانيليا', priceAdjustment: 0, isDefault: false },
      ],
    },
  ];

  for (const item of productsData) {
    const { images, variants, ...prodFields } = item;
    const product = await prisma.product.upsert({
      where: { slug: prodFields.slug },
      update: prodFields,
      create: prodFields,
    });

    // Handle images
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i],
          alt: product.name,
          isCover: i === 0,
          sortOrder: i,
        },
      });
    }

    // Handle variants
    await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: v.name,
          optionValue: v.optionValue,
          priceAdjustment: v.priceAdjustment,
          isDefault: v.isDefault,
          stock: 15,
        },
      });
    }
  }
  console.log('✓ 20 Luxury Arabic products seeded with images & variants');

  // 6. Seed Curated Testimonials (آراء مختارة)
  const reviewsData = [
    {
      authorName: 'أروى باحميد',
      rating: 5,
      content: 'العقد الذهبي وطقم الأساور وصلني بأرقى تغليف شفته بحياتي! التفاصيل فخمة ولمعة الزركون حقيقية وتبهر. شكراً ليفورا على هذه الجودة الرائعة.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isActive: true,
      sortOrder: 1,
    },
    {
      authorName: 'سارة الكبسي',
      rating: 5,
      content: 'طلبت أحمر الشفاه المخملي مع سيروم الهيالورونيك، المنتجات أصلية والنتيجة تفوق الوصف! وسرعة الرد على الواتساب والتوصيل ممتازة جداً.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      isActive: true,
      sortOrder: 2,
    },
    {
      authorName: 'ريما العولقي',
      rating: 5,
      content: 'كلاتش السهرة طلع بالواقع أجمل بمراحل من الصور! قفل الحقيبة الذهبي ثقيل وفاخر، متجر ليفورا صار وجهتي المفضلة دائماً.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      isActive: true,
      sortOrder: 3,
    },
    {
      authorName: 'منى اليافعي',
      rating: 5,
      content: 'عطر رويال نايت ثباته وفخامته خيالية، والتعامل الراقي عبر الواتساب يجعل تجربة التسوق في غاية السهولة والمتعة.',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop',
      isActive: true,
      sortOrder: 4,
    },
  ];

  await prisma.review.deleteMany({});
  for (const r of reviewsData) {
    await prisma.review.create({ data: r });
  }
  console.log('✓ Curated testimonials seeded');

  // 7. Seed Sample Orders for Analytics
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const firstProduct = await prisma.product.findFirst();
    if (firstProduct) {
      await prisma.order.create({
        data: {
          orderNumber: 'LVR-2026-1001',
          customerName: 'فاطمة السعدي',
          customerPhone: '771234567',
          customerCity: 'صنعاء',
          customerAddress: 'حدة - شارع الستين',
          totalAmount: 42500,
          subtotal: 42500,
          discountAmount: 0,
          status: 'DELIVERED',
          paymentMethod: 'WHATSAPP_COD',
          isWhatsappOrder: true,
          items: {
            create: [
              {
                productId: firstProduct.id,
                productName: firstProduct.name,
                unitPrice: firstProduct.price,
                quantity: 1,
                totalPrice: firstProduct.price,
                variantInfo: 'ذهبي شامبين',
              },
            ],
          },
        },
      });

      await prisma.order.create({
        data: {
          orderNumber: 'LVR-2026-1002',
          customerName: 'هند المقطري',
          customerPhone: '739876543',
          customerCity: 'عدن',
          customerAddress: 'خور مكسر',
          totalAmount: 34000,
          subtotal: 34000,
          discountAmount: 0,
          status: 'CONFIRMED',
          paymentMethod: 'WHATSAPP_COD',
          isWhatsappOrder: true,
        },
      });

      await prisma.order.create({
        data: {
          orderNumber: 'LVR-2026-1003',
          customerName: 'أحلام الجابري',
          customerPhone: '775551234',
          customerCity: 'المكلا',
          customerAddress: 'الديس',
          totalAmount: 18500,
          subtotal: 18500,
          discountAmount: 0,
          status: 'NEW',
          paymentMethod: 'WHATSAPP_COD',
          isWhatsappOrder: true,
        },
      });
      console.log('✓ Initial orders seeded for analytics');
    }
  }

  console.log('--- LIVORA Seed Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
