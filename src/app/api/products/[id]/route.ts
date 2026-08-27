import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

interface Props {
  params: { id: string };
}

export async function GET(request: Request, { params }: Props) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Product GET [id] error:', error);
    return NextResponse.json({ error: 'فشل استرجاع المنتج' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح لك بالتعديل' }, { status: 401 });
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

    const existing = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    // Update Product data
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name : existing.name,
        slug: slug !== undefined ? slug : existing.slug,
        sku: sku !== undefined ? sku : existing.sku,
        description: description !== undefined ? description : existing.description,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        price: price !== undefined ? parseFloat(price) : existing.price,
        compareAtPrice: compareAtPrice !== undefined ? (compareAtPrice ? parseFloat(compareAtPrice) : null) : existing.compareAtPrice,
        discount: discount !== undefined ? (discount ? parseInt(discount) : 0) : existing.discount,
        status: status !== undefined ? status : existing.status,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isBestSeller: isBestSeller !== undefined ? Boolean(isBestSeller) : existing.isBestSeller,
        isNew: isNew !== undefined ? Boolean(isNew) : existing.isNew,
        displayStockCount: displayStockCount !== undefined ? (displayStockCount !== '' ? parseInt(displayStockCount) : null) : existing.displayStockCount,
        showStockBadge: showStockBadge !== undefined ? Boolean(showStockBadge) : existing.showStockBadge,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
      },
    });

    // Update images if provided
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].url;
        if (imgUrl && imgUrl.trim()) {
          await prisma.productImage.create({
            data: {
              productId: params.id,
              url: imgUrl,
              alt: updated.name,
              isCover: i === 0,
              sortOrder: i,
            },
          });
        }
      }
    }

    // Update variants if provided
    if (variants && Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: params.id } });
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (v.optionValue && v.optionValue.trim()) {
          await prisma.productVariant.create({
            data: {
              productId: params.id,
              name: v.name || 'الخيار',
              optionValue: v.optionValue.trim(),
              priceAdjustment: v.priceAdjustment ? parseFloat(v.priceAdjustment) : 0,
              sku: v.sku || null,
              stock: v.stock ? parseInt(v.stock) : 10,
              isDefault: i === 0,
            },
          });
        }
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: true, variants: true, category: true },
    });

    return NextResponse.json({ success: true, product: fullProduct });
  } catch (error) {
    console.error('Product PUT error:', error);
    return NextResponse.json({ error: 'فشل تحديث المنتج' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح لك بالحذف' }, { status: 401 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: 'فشل حذف المنتج' }, { status: 500 });
  }
}
