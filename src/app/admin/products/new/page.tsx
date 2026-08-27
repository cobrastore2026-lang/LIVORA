import React from "react";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
          إضافة منتج جديد للكتالوج
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-light">
          قومي بإدخال تفاصيل المنتج، الصور، الأسعار والخيارات المختلفة
        </p>
      </div>

      <ProductForm categories={categories as any} />
    </div>
  );
}
