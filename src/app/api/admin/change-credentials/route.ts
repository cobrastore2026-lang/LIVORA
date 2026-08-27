import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, signAdminToken, getAdminCookieName } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: 'غير مصرح، يرجى تسجيل الدخول' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newEmail, newPassword, confirmPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'يرجى إدخال كلمة المرور الحالية لتأكيد التغييرات' },
        { status: 400 }
      );
    }

    // Fetch admin with passwordHash
    const adminRecord = await prisma.admin.findUnique({
      where: { id: currentAdmin.id },
    });

    if (!adminRecord) {
      return NextResponse.json({ error: 'حساب المسؤول غير موجود' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, adminRecord.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'كلمة المرور الحالية غير صحيحة' },
        { status: 400 }
      );
    }

    const updateData: { email?: string; passwordHash?: string } = {};

    // Validate and update email if provided and changed
    if (newEmail && newEmail.trim().toLowerCase() !== adminRecord.email.toLowerCase()) {
      const formattedEmail = newEmail.trim().toLowerCase();
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formattedEmail)) {
        return NextResponse.json({ error: 'صيغة البريد الإلكتروني الجديد غير صحيحة' }, { status: 400 });
      }

      // Check if email already in use by another admin
      const existing = await prisma.admin.findUnique({
        where: { email: formattedEmail },
      });

      if (existing && existing.id !== adminRecord.id) {
        return NextResponse.json(
          { error: 'هذا البريد الإلكتروني مستخدم بالفعل لحساب آخر' },
          { status: 400 }
        );
      }

      updateData.email = formattedEmail;
    }

    // Validate and update password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف أو أرقام على الأقل' },
          { status: 400 }
        );
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: 'كلمة المرور الجديدة وتأكيدها غير متطابقين' },
          { status: 400 }
        );
      }

      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'لم يتم إدخال أي بريد إلكتروني أو كلمة مرور جديدة لتحديثها' },
        { status: 400 }
      );
    }

    // Update in database
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminRecord.id },
      data: updateData,
    });

    // Re-sign token
    const token = signAdminToken({
      adminId: updatedAdmin.id,
      email: updatedAdmin.email,
      name: updatedAdmin.name,
      role: updatedAdmin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات حساب الدخول بنجاح',
      email: updatedAdmin.email,
    });

    response.cookies.set(getAdminCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Change admin credentials error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث بيانات الحساب: ' + (error?.message || 'خطأ غير معروف') },
      { status: 500 }
    );
  }
}
