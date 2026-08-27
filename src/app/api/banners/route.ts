import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error('Banners GET error:', error);
    return NextResponse.json({ error: 'فشل استرجاع البانرات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { title, subtitle, description, imageUrl, buttonText, buttonLink, badgeText, position, isActive, sortOrder } = await request.json();

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'العنوان ورابط الصورة مطلوبان' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        imageUrl,
        buttonText: buttonText || 'تسوقي الآن',
        buttonLink: buttonLink || '/products',
        badgeText: badgeText || null,
        position: position || 'HERO',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    console.error('Banner POST error:', error);
    return NextResponse.json({ error: 'فشل إضافة البانر' }, { status: 500 });
  }
}
