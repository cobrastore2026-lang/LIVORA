"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Flame, Star, Tag } from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<"featured" | "bestseller" | "new" | "offers">("featured");

  const filterMap = {
    featured: products.filter((p) => p.isFeatured),
    bestseller: products.filter((p) => p.isBestSeller),
    new: products.filter((p) => p.isNew),
    offers: products.filter((p) => p.discount && p.discount > 0),
  };

  const displayedProducts = (filterMap[activeTab] || []).slice(0, 8);

  const tabs = [
    { id: "featured", label: "المختارات المميزة", icon: Sparkles },
    { id: "bestseller", label: "الأكثر طلباً", icon: Flame },
    { id: "new", label: "أحدث الإضافات", icon: Star },
    { id: "offers", label: "العروض الخاصة", icon: Tag },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-y border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#C8A96B] uppercase tracking-widest block mb-1">
            مختارات فاخرة تبرز أناقتك
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#171717]">
            تألقي مع تشكيلات ليفورا
          </h2>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#171717] text-[#C8A96B] shadow-md border border-[#C8A96B]/40 scale-105"
                    : "bg-white text-[#737373] hover:text-[#171717] hover:bg-[#F6F0E8] border border-[#E8DFD3]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#C8A96B]" : "text-gray-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-500">
            لا توجد منتجات ضمن هذا القسم حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Explore All CTA */}
        <div className="mt-12 text-center">
          <Link
            href={`/products${activeTab === 'offers' ? '?filter=offers' : ''}`}
            className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs sm:text-sm py-3.5 px-8 rounded-full transition-all duration-300 border border-[#C8A96B]/40 shadow-sm group"
          >
            <span>استكشاف كافة المنتجات ({products.length})</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
