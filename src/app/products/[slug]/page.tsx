import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import StickyMobileBar from "@/components/product/StickyMobileBar";
import RelatedProducts from "@/components/product/RelatedProducts";

interface Props {
  params: { slug: string };
}

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, category: true },
  });

  if (!product) {
    return {
      title: "المنتج غير موجود | LIVORA ليفورا",
    };
  }

  const coverUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";

  return {
    title: `${product.name} | متجر LIVORA الفاخر`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | LIVORA`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: [
        {
          url: coverUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { isDefault: "desc" } },
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products in same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "ACTIVE",
    },
    take: 4,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E8]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#171717]">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-[#171717]">جميع المنتجات</Link>
          {product.category && (
            <>
              <ChevronLeft className="w-3.5 h-3.5" />
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#171717]">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[#171717] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Gallery - 6 cols */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <ProductGallery images={product.images as any} productName={product.name} />
          </div>

          {/* Details & WhatsApp Actions - 6 cols */}
          <div className="lg:col-span-6">
            <ProductDetails product={product as any} />
          </div>

        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedProducts as any} />

      </main>

      {/* Sticky Mobile WhatsApp Bar */}
      <StickyMobileBar product={product as any} />

      <Footer />
    </div>
  );
}
