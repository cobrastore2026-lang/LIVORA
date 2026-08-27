import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    // Allow upload if admin is logged in, or in dev/local mode
    if (!admin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول كمسؤول" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const file = files[0] || (formData.get("image") as File);

    if (!file || typeof file === "string" || !file.size) {
      return NextResponse.json({ error: "لم يتم العثور على أي ملف صورة صالح" }, { status: 400 });
    }

    // Check size limit (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الصورة كبير جداً (الحد الأقصى 15 ميغابايت)" }, { status: 400 });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Read bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name || "") || ".jpg";
    const cleanExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, "") || ".jpg";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `livora-${uniqueSuffix}${cleanExt}`;

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/api/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء رفع الصورة: " + (error?.message || "خطأ غير معروف") },
      { status: 500 }
    );
  }
}
