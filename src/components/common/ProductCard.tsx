"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Phone, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { getSingleProductWhatsAppUrl } from "@/lib/whatsapp";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const coverImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.isCover)?.url || product.images[0].url
      : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";

  const isFavorite = isInWishlist(product.id);

  const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  const variantText = defaultVariant ? `${defaultVariant.name}: ${defaultVariant.optionValue}` : "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: coverImage,
      variantId: defaultVariant?.id,
      variantName: defaultVariant?.name,
      variantOption: defaultVariant?.optionValue,
      priceAdjustment: defaultVariant?.priceAdjustment || 0,
      quantity: 1,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: coverImage,
      categoryName: product.category?.name,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
    });
  };

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const productUrl = `${origin}/products/${product.slug}`;
    const url = getSingleProductWhatsAppUrl({
      productName: product.name,
      price: product.price,
      variantText: variantText,
      productUrl: productUrl,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8DFD3] hover:border-[#C8A96B] transition-all duration-300 hover:shadow-luxury-hover">
      
      {/* Image & Badges Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6F0E8] block">
        <Image
          src={coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {product.discount && product.discount > 0 ? (
            <span className="bg-[#171717] text-[#C8A96B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C8A96B]/50 shadow-sm">
              خصم {product.discount}%
            </span>
          ) : null}

          {product.isNew && (
            <span className="bg-[#C8A96B] text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              جديد
            </span>
          )}

          {product.isBestSeller && (
            <span className="bg-[#FAF7F2] text-[#171717] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E8DFD3] shadow-sm">
              الأكثر مبيعاً
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorite
              ? "bg-red-50 text-red-500 shadow-md"
              : "bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500" : ""}`} />
        </button>

        {/* Low Stock Badge */}
        {product.showStockBadge && product.displayStockCount && product.displayStockCount > 0 && (
          <div className="absolute bottom-2 right-2 left-2 bg-[#171717]/85 backdrop-blur-sm text-[#C8A96B] text-[11px] font-medium py-1 px-2.5 rounded-lg flex items-center justify-center gap-1.5 border border-[#C8A96B]/30">
            <Sparkles className="w-3 h-3 text-[#C8A96B]" />
            <span>متبقي {product.displayStockCount} فقط</span>
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Category Name */}
        {product.category && (
          <span className="text-[11px] font-medium text-[#737373] mb-1">
            {product.category.name}
          </span>
        )}

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="group-hover:text-[#C8A96B] transition-colors">
          <h3 className="font-semibold text-sm line-clamp-2 text-[#171717] leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-bold text-base text-[#171717]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-[#F6F0E8] flex items-center gap-2">
          
          {/* WhatsApp Direct Buy */}
          <button
            onClick={handleWhatsAppBuy}
            className="flex-1 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-semibold text-xs py-2 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 border border-[#C8A96B]/30 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>طلب واتساب</span>
          </button>

          {/* Add to Cart Icon Button */}
          <button
            onClick={handleAddToCart}
            aria-label="إضافة إلى السلة"
            title="إضافة إلى السلة"
            className="w-9 h-9 rounded-xl bg-[#FAF7F2] hover:bg-[#C8A96B] text-[#171717] hover:text-black border border-[#E8DFD3] hover:border-[#C8A96B] flex items-center justify-center transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
