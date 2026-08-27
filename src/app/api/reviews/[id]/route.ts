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

    const { authorName, avatarUrl, rating, content, isActive, sortOrder } = await request.json();

    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        authorName,
        avatarUrl,
        rating: rating !== undefined ? parseInt(rating) : undefined,
        content,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
      },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error('Review PUT error:', error);
    return NextResponse.json({ error: 'فشل تحديث الرأي' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await prisma.review.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'تم حذف الرأي بنجاح' });
  } catch (error) {
    console.error('Review DELETE error:', error);
    return NextResponse.json({ error: 'فشل حذف الرأي' }, { status: 500 });
  }
}
