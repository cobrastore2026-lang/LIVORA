"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeFromWishlist, wishlistCount } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      image: item.image,
      quantity: 1,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E8]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Page Title */}
        <div className="pb-6 mb-8 border-b border-[#E8DFD3]">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#171717]">
            قائمة رغباتي ({wishlistCount})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-light">
            المنتجات المفضلة التي قمت بحفظها لشرائها لاحقاً
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#E8DFD3] max-w-lg mx-auto shadow-luxury space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-center text-[#C8A96B] mx-auto">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-[#171717]">قائمة المفضلة فارغة</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              يمكنكِ إضافة المنتجات التي تعجبكِ إلى المفضلة بالنقر على أيقونة القلب على أي منتج.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs sm:text-sm font-bold py-3 px-8 rounded-full transition-colors border border-[#C8A96B]/30"
              >
                <span>استكشاف المنتجات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8DFD3] hover:border-[#C8A96B] transition-all duration-300 shadow-sm"
              >
                {/* Image */}
                <Link href={`/products/${item.slug}`} className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6F0E8] block">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item.productId);
                    }}
                    aria-label="حذف من المفضلة"
                    className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-white flex items-center justify-center shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  {item.categoryName && (
                    <span className="text-[11px] text-[#737373] mb-1">{item.categoryName}</span>
                  )}
                  <Link href={`/products/${item.slug}`} className="group-hover:text-[#C8A96B] transition-colors">
                    <h3 className="font-semibold text-xs sm:text-sm text-[#171717] line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="font-bold text-sm sm:text-base text-[#171717]">
                      {formatPrice(item.price)}
                    </span>
                    {item.compareAtPrice && item.compareAtPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F6F0E8]">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-semibold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 border border-[#C8A96B]/30"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>إضافة إلى السلة</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
