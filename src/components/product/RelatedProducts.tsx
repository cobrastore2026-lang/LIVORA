import React from "react";
import ProductCard from "@/components/common/ProductCard";
import { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 border-t border-[#E8DFD3] mt-16">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
          منتجات قد تنال إعجابكِ أيضاً
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-light">
          مختارات متناسقة من نفس التشكيلة لتكمل إطلالتك
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 4).map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
