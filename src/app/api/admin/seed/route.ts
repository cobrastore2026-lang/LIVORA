import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import { getCurrentAdmin } from '@/lib/auth';

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    await execPromise('node prisma/seed.js');

    return NextResponse.json({
      success: true,
      message: 'تم إعادة توليد وتحديث البيانات التجريبية لمتجر ليفورا بنجاح!',
    });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json({ error: 'فشل تنفيذ إعادة توليد البيانات' }, { status: 500 });
  }
}
