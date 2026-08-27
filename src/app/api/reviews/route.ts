import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json({ error: 'فشل استرجاع الآراء' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { authorName, avatarUrl, rating, content, isActive, sortOrder } = await request.json();

    if (!authorName || !content) {
      return NextResponse.json({ error: 'الاسم ونص الرأي مطلوبان' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        authorName,
        avatarUrl: avatarUrl || null,
        rating: rating ? parseInt(rating) : 5,
        content,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error('Review POST error:', error);
    return NextResponse.json({ error: 'فشل إضافة الرأي' }, { status: 500 });
  }
}
