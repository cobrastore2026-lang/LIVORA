"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, Trash2, Phone, ArrowLeft, ArrowRight, Sparkles, Truck } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { getCartWhatsAppUrl } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const [notes, setNotes] = useState("");

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;
    const url = getCartWhatsAppUrl({
      items,
      totalAmount: totalPrice,
      notes: notes,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E8]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Page Title */}
        <div className="pb-6 mb-8 border-b border-[#E8DFD3] flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#171717]">
              سلة المشتريات ({totalItems})
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-light">
              راجعي المنتجات المختارة واستكملي طلبك فوراً عبر الواتساب
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إفراغ السلة</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#E8DFD3] max-w-lg mx-auto shadow-luxury space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-center text-[#C8A96B] mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-[#171717]">سلة التسوق فارغة</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              لم تقومي باختيار أي منتج بعد. زوري متجرنا واكتشفي أرقى الإكسسوارات والمكياج ومنتجات العناية.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs sm:text-sm font-bold py-3 px-8 rounded-full transition-colors border border-[#C8A96B]/30"
              >
                <span>ابدئي التسوق الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items List - 8 cols */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DFD3] flex flex-col sm:flex-row items-center gap-4 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F6F0E8] flex-shrink-0 border border-[#E8DFD3]">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="hover:text-[#C8A96B] transition-colors">
                        <h3 className="font-bold text-sm sm:text-base text-[#171717]">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.variantOption && (
                        <p className="text-xs text-[#737373] mt-1">
                          {item.variantName || "الخيار"}: <span className="text-[#C8A96B] font-semibold">{item.variantOption}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#E8DFD3] rounded-xl bg-[#FAF7F2] p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#171717]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm sm:text-base text-[#171717]">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="حذف"
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Notes */}
              <div className="bg-white rounded-2xl p-5 border border-[#E8DFD3] space-y-2">
                <label className="block text-xs font-bold text-[#171717]">
                  ملاحظات إضافية على الطلب (اختياري):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتبي أي تفاصيل تودين إضافتها بخصوص المقاس أو التغليف أو عنوان التوصيل..."
                  rows={3}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              {/* Continue Shopping Link */}
              <div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#171717] hover:text-[#C8A96B] transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>متابعة التسوق وإضافة منتجات أخرى</span>
                </Link>
              </div>
            </div>

            {/* Summary & WhatsApp Checkout - 4 cols */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8DFD3] shadow-luxury space-y-5 sticky top-28">
              <h3 className="font-bold text-base text-[#171717] pb-3 border-b border-[#E8DFD3]">
                ملخص الطلبية
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>مجموع المنتجات ({totalItems}):</span>
                  <span className="font-bold text-[#171717]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن والتوصيل:</span>
                  <span className="text-[#C8A96B] font-semibold">يُحدد عبر الواتساب</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8DFD3] flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#171717]">المبلغ الإجمالي:</span>
                <span className="font-bold text-xl text-[#171717]">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl text-[11px] text-[#737373] space-y-1.5 border border-[#E8DFD3]">
                <div className="flex items-center gap-1.5 font-medium text-[#171717]">
                  <Truck className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>التوصيل متاح لكافة محافظات اليمن</span>
                </div>
                <p>الدفع عند الاستلام بعد معاينة وفحص الطلبية.</p>
              </div>

              {/* Primary WhatsApp Order Button */}
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-sm py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 border border-[#C8A96B]/40 shadow-gold-glow"
              >
                <Phone className="w-4 h-4" />
                <span>إرسال الطلب عبر WhatsApp</span>
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                سيتم تحويلك إلى تطبيق واتساب مع رسالة تفصيلية تحتوي على كافة المنتجات والكميات لتأكيد طلبك مباشرة.
              </p>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
