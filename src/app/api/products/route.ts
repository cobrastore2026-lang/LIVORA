import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { shortDescription: { contains: q } },
        { sku: { contains: q } },
        { category: { name: { contains: q } } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { isDefault: 'desc' } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'فشل استرجاع المنتجات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      price,
      compareAtPrice,
      discount,
      status,
      isFeatured,
      isBestSeller,
      isNew,
      displayStockCount,
      showStockBadge,
      categoryId,
      images,
      variants,
    } = body;

    if (!name || !description || price === undefined || !categoryId) {
      return NextResponse.json(
        { error: 'يرجى استكمال الحقول الإجبارية (الاسم، الوصف، السعر، التصنيف)' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let finalSlug = slug ? slug.trim().toLowerCase().replace(/[\s+]/g, '-') : name.trim().toLowerCase().replace(/[\s+]/g, '-');
    finalSlug = finalSlug.replace(/[^a-zA-Z0-9\u0621-\u064A-]/g, '');
    
    // Check if slug exists
    const existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        sku: sku || null,
        description,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        discount: discount ? parseInt(discount) : 0,
        status: status || 'ACTIVE',
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isNew: Boolean(isNew),
        displayStockCount: displayStockCount !== undefined && displayStockCount !== '' ? parseInt(displayStockCount) : null,
        showStockBadge: Boolean(showStockBadge),
        categoryId,
        images: {
          create: (images || []).map((img: any, idx: number) => ({
            url: typeof img === 'string' ? img : img.url,
            alt: name,
            isCover: idx === 0,
            sortOrder: idx,
          })),
        },
        variants: {
          create: (variants || []).map((v: any, idx: number) => ({
            name: v.name || 'الخيار',
            optionValue: v.optionValue,
            priceAdjustment: v.priceAdjustment ? parseFloat(v.priceAdjustment) : 0,
            sku: v.sku || null,
            stock: v.stock ? parseInt(v.stock) : 10,
            isDefault: idx === 0,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Product POST error:', error);
    return NextResponse.json({ error: 'فشل إضافة المنتج' }, { status: 500 });
  }
}
