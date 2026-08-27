import { NextResponse } from 'next/server';
import { getAdminCookieName } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  response.cookies.delete(getAdminCookieName());
  return response;
}
