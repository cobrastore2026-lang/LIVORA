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

    const body = await request.json();
    const updated = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        imageUrl: body.imageUrl,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        badgeText: body.badgeText,
        position: body.position,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
        sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder) : undefined,
      },
    });

    return NextResponse.json({ success: true, banner: updated });
  } catch (error) {
    console.error('Banner PUT error:', error);
    return NextResponse.json({ error: 'فشل تحديث البانر' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await prisma.banner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'تم حذف البانر بنجاح' });
  } catch (error) {
    console.error('Banner DELETE error:', error);
    return NextResponse.json({ error: 'فشل حذف البانر' }, { status: 500 });
  }
}
