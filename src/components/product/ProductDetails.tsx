"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Phone, Sparkles, ShieldCheck, Truck, Gift, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { getSingleProductWhatsAppUrl } from "@/lib/whatsapp";
import { Product, ProductVariant } from "@/types";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    return product.variants?.find((v) => v.isDefault) || product.variants?.[0] || null;
  });

  const [quantity, setQuantity] = useState(1);

  const isFavorite = isInWishlist(product.id);

  const unitPrice = product.price + (selectedVariant?.priceAdjustment || 0);
  const totalPrice = unitPrice * quantity;

  const coverImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: coverImage,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantOption: selectedVariant?.optionValue,
      priceAdjustment: selectedVariant?.priceAdjustment || 0,
      quantity: quantity,
    });
  };

  const handleWishlistToggle = () => {
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

  const handleWhatsAppBuy = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const productUrl = `${origin}/products/${product.slug}`;
    const variantText = selectedVariant ? `${selectedVariant.name}: ${selectedVariant.optionValue}` : "";

    const url = getSingleProductWhatsAppUrl({
      productName: product.name,
      price: totalPrice,
      variantText: variantText,
      productUrl: productUrl,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Category and SKU */}
      <div className="flex items-center justify-between text-xs text-[#737373] pb-2 border-b border-[#E8DFD3]">
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-[#C8A96B] font-bold hover:underline"
          >
            {product.category.name}
          </Link>
        )}
        {product.sku && <span>رمز المنتج: {product.sku}</span>}
      </div>

      {/* Product Name */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#171717] leading-tight">
          {product.name}
        </h1>
        {product.shortDescription && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {product.shortDescription}
          </p>
        )}
      </div>

      {/* Price and Discounts */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E8DFD3]">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-[#171717]">
            {formatPrice(unitPrice)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > unitPrice && (
            <span className="text-sm sm:text-base text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {product.discount && product.discount > 0 ? (
          <span className="bg-[#171717] text-[#C8A96B] text-xs font-bold px-3 py-1 rounded-full border border-[#C8A96B]/50 mr-auto">
            خصم {product.discount}%
          </span>
        ) : null}
      </div>

      {/* Stock badge */}
      {product.showStockBadge && product.displayStockCount && product.displayStockCount > 0 && (
        <div className="inline-flex items-center gap-2 bg-[#FAF7F2] text-[#171717] text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#E8DFD3]">
          <Sparkles className="w-4 h-4 text-[#C8A96B]" />
          <span>الكمية المتبقية للعرض: <strong className="text-[#C8A96B]">{product.displayStockCount} فقط</strong></span>
        </div>
      )}

      {/* Variants Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-[#171717]">
            اختر {product.variants[0]?.name || "الخيار"}:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#171717] text-[#C8A96B] border border-[#C8A96B] shadow-sm"
                      : "bg-white text-[#171717] border border-[#E8DFD3] hover:border-[#C8A96B]"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A96B]" />}
                  <span>{variant.optionValue}</span>
                  {variant.priceAdjustment !== 0 && (
                    <span className="text-[10px] text-gray-400">
                      ({variant.priceAdjustment > 0 ? `+${variant.priceAdjustment}` : variant.priceAdjustment})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#E8DFD3] rounded-2xl bg-white p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black rounded-xl hover:bg-gray-100 transition-colors text-lg"
            >
              -
            </button>
            <span className="w-10 text-center font-bold text-sm text-[#171717]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black rounded-xl hover:bg-gray-100 transition-colors text-lg"
            >
              +
            </button>
          </div>

          {/* Add to Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            className={`h-12 px-4 rounded-2xl border flex items-center justify-center transition-all ${
              isFavorite
                ? "bg-red-50 text-red-500 border-red-200"
                : "bg-white text-gray-600 border-[#E8DFD3] hover:text-red-500 hover:border-red-200"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 h-12 bg-white hover:bg-[#F6F0E8] text-[#171717] font-bold text-xs sm:text-sm px-4 rounded-2xl border border-[#171717] hover:border-[#C8A96B] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#C8A96B]" />
            <span>إضافة إلى السلة</span>
          </button>
        </div>

        {/* Primary Luxury Button: Direct WhatsApp Order */}
        <button
          onClick={handleWhatsAppBuy}
          className="w-full h-14 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-base rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-[#C8A96B]/50 shadow-gold-glow"
        >
          <Phone className="w-5 h-5" />
          <span>اطلب الآن عبر WhatsApp</span>
        </button>
      </div>

      {/* Luxury Assurances */}
      <div className="p-4 bg-white rounded-2xl border border-[#E8DFD3] space-y-3">
        <div className="flex items-center gap-3 text-xs text-[#171717]">
          <Truck className="w-4 h-4 text-[#C8A96B] flex-shrink-0" />
          <span>توصيل متاح إلى كافة محافظات ومدن الجمهورية اليمنية.</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#171717]">
          <ShieldCheck className="w-4 h-4 text-[#C8A96B] flex-shrink-0" />
          <span>منتج أصلي 100% مع ضمان أعلى معايير الجودة والمطابقة.</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#171717]">
          <Gift className="w-4 h-4 text-[#C8A96B] flex-shrink-0" />
          <span>تغليف هدايا ملكي أنيق مع كل طلبية.</span>
        </div>
      </div>

      {/* Full Description Details */}
      <div className="pt-4 border-t border-[#E8DFD3]">
        <h3 className="font-bold text-sm text-[#171717] mb-3">تفاصيل المنتج ومواصفاته:</h3>
        <div className="prose prose-sm text-gray-600 leading-relaxed font-light whitespace-pre-line">
          {product.description}
        </div>
      </div>

    </div>
  );
}
