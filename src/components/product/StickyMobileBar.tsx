"use client";

import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getSingleProductWhatsAppUrl } from "@/lib/whatsapp";
import { Product } from "@/types";

interface StickyMobileBarProps {
  product: Product;
}

export default function StickyMobileBar({ product }: StickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 300px on mobile
      setIsVisible(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppBuy = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const productUrl = `${origin}/products/${product.slug}`;
    const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
    const variantText = defaultVariant ? `${defaultVariant.name}: ${defaultVariant.optionValue}` : "";

    const url = getSingleProductWhatsAppUrl({
      productName: product.name,
      price: product.price,
      variantText: variantText,
      productUrl: productUrl,
    });
    window.open(url, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-[#E8DFD3] shadow-2xl lg:hidden animate-fade-in">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500">السعر:</span>
          <span className="font-bold text-base text-[#171717]">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={handleWhatsAppBuy}
          className="flex-1 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#C8A96B]/40 shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>اطلب الآن عبر WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
