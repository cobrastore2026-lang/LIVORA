import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'فشل استرجاع الطلبات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
      totalAmount,
      subtotal,
      discountAmount,
      notes,
      items,
      paymentMethod,
    } = body;

    const orderNumber = `LVR-${Date.now().toString().slice(-6)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        customerCity: customerCity || null,
        customerAddress: customerAddress || null,
        totalAmount: parseFloat(totalAmount) || 0,
        subtotal: parseFloat(subtotal) || parseFloat(totalAmount) || 0,
        discountAmount: parseFloat(discountAmount) || 0,
        notes: notes || null,
        status: 'NEW',
        paymentMethod: paymentMethod || 'WHATSAPP_COD',
        isWhatsappOrder: true,
        items: {
          create: (items || []).map((item: any) => ({
            productId: item.productId,
            productName: item.product?.name || item.productName || 'منتج ليفورا',
            variantInfo: item.variantOption ? `${item.variantName || 'الخيار'}: ${item.variantOption}` : null,
            unitPrice: parseFloat(item.unitPrice),
            quantity: parseInt(item.quantity) || 1,
            totalPrice: (parseFloat(item.unitPrice) * (parseInt(item.quantity) || 1)),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json({ error: 'فشل تسجيل الطلب' }, { status: 500 });
  }
}
