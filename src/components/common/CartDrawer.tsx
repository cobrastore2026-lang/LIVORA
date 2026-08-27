"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, Phone, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { getCartWhatsAppUrl } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  const handleSendToWhatsApp = () => {
    if (items.length === 0) return;
    const url = getCartWhatsAppUrl({
      items,
      totalAmount: totalPrice,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-r border-[#E8DFD3]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8DFD3] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C8A96B]" />
              <h2 className="text-base font-bold text-[#171717]">
                سلة التسوق ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              aria-label="إغلاق السلة"
              className="p-1.5 text-gray-400 hover:text-black rounded-lg transition-colors hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F6F0E8] border border-[#E8DFD3] flex items-center justify-center text-[#C8A96B]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-[#171717]">سلة المشتريات فارغة</h3>
                  <p className="text-xs text-gray-500">
                    لم تقومي بإضافة أي منتج بعد. تصفحي تشكيلتنا الفاخرة واختاري ما يناسبك.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold py-2.5 px-6 rounded-full transition-colors border border-[#C8A96B]/30"
                >
                  استكشاف المنتجات
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-[#E8DFD3] shadow-sm relative group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F6F0E8] flex-shrink-0 border border-[#E8DFD3]">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-[#171717] line-clamp-1 leading-snug">
                        {item.product.name}
                      </h4>
                      {item.variantOption && (
                        <p className="text-[11px] text-[#737373] mt-0.5">
                          {item.variantName || "الخيار"}: <span className="text-[#C8A96B] font-medium">{item.variantOption}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-xs text-[#171717]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>

                      {/* Quantity Buttons */}
                      <div className="flex items-center border border-[#E8DFD3] rounded-lg overflow-hidden bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#171717]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="حذف المنتج"
                    className="absolute top-2.5 left-2.5 text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8DFD3] bg-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#737373] font-medium">المجموع الكلي:</span>
                <span className="font-bold text-base text-[#171717]">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <p className="text-[11px] text-[#737373] text-center">
                سيتم إرسال تفاصيل السلة بالكامل في رسالة واتساب منسقة لتأكيد طلبك مباشرة.
              </p>

              <button
                onClick={handleSendToWhatsApp}
                className="w-full bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-sm py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#C8A96B]/50 shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>إرسال الطلب عبر WhatsApp</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="text-xs font-semibold text-[#171717] hover:text-[#C8A96B] flex items-center gap-1 transition-colors"
                >
                  <span>عرض السلة بالتفصيل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={closeCart}
                  className="text-xs text-gray-500 hover:underline"
                >
                  متابعة التسوق
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
