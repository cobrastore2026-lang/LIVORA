import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const revalidate = 0;

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
          تعديل المنتج: {product.name}
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-light">
          تحديث الأسعار، الوصف، الصور، والخيارات
        </p>
      </div>

      <ProductForm initialProduct={product as any} categories={categories as any} />
    </div>
  );
}
