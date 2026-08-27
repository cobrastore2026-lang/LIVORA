import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

interface Props {
  params: { id: string };
}

export async function GET(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order GET [id] error:', error);
    return NextResponse.json({ error: 'فشل استرجاع الطلب' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { status, notes, customerName, customerPhone, customerCity, customerAddress } = await request.json();

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        notes,
        customerName,
        customerPhone,
        customerCity,
        customerAddress,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Order PUT error:', error);
    return NextResponse.json({ error: 'فشل تحديث الطلب' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    console.error('Order DELETE error:', error);
    return NextResponse.json({ error: 'فشل حذف الطلب' }, { status: 500 });
  }
}
