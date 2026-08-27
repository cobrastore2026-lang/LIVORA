import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { path = '/', referrer = '' } = body;

    // Do not count admin routes as store visits
    if (typeof path === 'string' && path.startsWith('/admin')) {
      return NextResponse.json({ success: true, ignored: true });
    }

    await prisma.analyticsEvent.create({
      data: {
        eventType: 'PAGE_VIEW',
        entityType: 'STOREFRONT',
        metadata: JSON.stringify({
          path,
          referrer: referrer || null,
          userAgent: req.headers.get('user-agent') || 'Unknown',
        }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track visit error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
