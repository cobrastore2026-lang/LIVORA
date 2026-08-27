import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Category } from "@/types";

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-[#F6F0E8] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E8DFD3]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C8A96B] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مجموعات ليفورا الفاخرة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#171717]">
              تسوقي حسب التصنيف
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-[#171717] hover:text-[#C8A96B] flex items-center gap-1.5 transition-colors group"
          >
            <span>استعراض كافة التصنيفات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id || cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#E8DFD3] hover:border-[#C8A96B] transition-all duration-300 hover:shadow-luxury-hover flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Text Overlay */}
                <div className="absolute bottom-3 right-3 left-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base font-display drop-shadow-sm group-hover:text-[#C8A96B] transition-colors">
                    {cat.name}
                  </h3>
                  {cat._count?.products !== undefined && (
                    <span className="text-[11px] text-gray-200 block font-light">
                      {cat._count.products} منتج
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
