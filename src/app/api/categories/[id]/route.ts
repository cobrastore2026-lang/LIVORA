import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

interface Props {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { name, slug, description, image, sortOrder, isActive } = await request.json();

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        image,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error('Category PUT error:', error);
    return NextResponse.json({ error: 'فشل تحديث التصنيف' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Check if products exist in category
    const count = await prisma.product.count({ where: { categoryId: params.id } });
    if (count > 0) {
      return NextResponse.json(
        { error: `لا يمكن حذف هذا التصنيف لأنه يحتوي على ${count} منتج. يرجى نقل أو حذف المنتجات أولاً.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'تم حذف التصنيف بنجاح' });
  } catch (error) {
    console.error('Category DELETE error:', error);
    return NextResponse.json({ error: 'فشل حذف التصنيف' }, { status: 500 });
  }
}
