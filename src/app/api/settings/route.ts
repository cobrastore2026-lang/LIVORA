import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);
    return NextResponse.json({ success: true, settings: settingsMap, raw: settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'فشل استرجاع الإعدادات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const settingsObj = await request.json();

    for (const [key, value] of Object.entries(settingsObj)) {
      if (typeof value === 'string') {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: {
            key,
            value,
            group: key.startsWith('about') ? 'ABOUT' : key.startsWith('whatsapp') ? 'CONTACT' : 'GENERAL',
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
