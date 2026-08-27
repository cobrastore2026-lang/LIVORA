import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCatalogClient from "@/app/products/ProductCatalogClient";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E8]">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            نتائج البحث عن: <span className="text-[#C8A96B]">&quot;{query}&quot;</span>
          </h1>
        </div>
        <ProductCatalogClient
          initialProducts={products as any}
          categories={categories as any}
          initialQuery={query}
        />
      </main>
      <Footer />
    </div>
  );
}
