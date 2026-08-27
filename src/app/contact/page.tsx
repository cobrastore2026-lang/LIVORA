"use client";

import React, { useState } from "react";
import { Phone, Instagram, Send, MapPin, Sparkles, MessageCircle, Clock } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    let text = `السلام عليكم، استفسار من عميلة ليفورا:\n\n`;
    if (name.trim()) text += `الاسم: ${name.trim()}\n`;
    if (phone.trim()) text += `رقم الهاتف: ${phone.trim()}\n`;
    text += `نص الرسالة: ${message.trim()}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/967737462144?text=${encoded}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E8]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#C8A96B]/20 text-[#171717] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#C8A96B]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>نحن في خدمتكِ دائماً</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#171717]">
            تواصل مع فريق LIVORA
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light">
            نسعد بالإجابة على استفساراتكِ ومساعدتكِ في اختيار وتجهيز طلبيتك الفاخرة
          </p>
        </div>

        {/* Contact Info & Direct WhatsApp Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Info cards - 5 cols */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* WhatsApp Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#171717] text-[#C8A96B] flex items-center justify-center border border-[#C8A96B]/40">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#171717]">الطلب والتواصل عبر الواتساب</h3>
              <p className="text-xs text-gray-500 font-light">
                القناة الأسرع والأكثر تفضيلاً لجميع الطلبات والاستفسارات المباشرة.
              </p>
              <a
                href="https://wa.me/967737462144"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#171717] hover:text-[#C8A96B] transition-colors"
              >
                <span>967737462144+</span>
              </a>
            </div>

            {/* Coverage Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#171717] text-[#C8A96B] flex items-center justify-center border border-[#C8A96B]/40">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#171717]">تغطية الشحن والتوصيل</h3>
              <p className="text-xs text-gray-500 font-light">
                نوصل إلى كافة محافظات ومدن الجمهورية اليمنية (صنعاء، عدن، تعز، المكلا، إب، الحديدة، وباقي المدن).
              </p>
            </div>

            {/* Social Media Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#171717] text-[#C8A96B] flex items-center justify-center border border-[#C8A96B]/40">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#171717]">حساباتنا على وسائل التواصل</h3>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#FAF7F2] hover:bg-[#171717] hover:text-[#C8A96B] px-3 py-1.5 rounded-full border border-[#E8DFD3] transition-colors font-medium"
                >
                  انستغرام @livora_ye
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#FAF7F2] hover:bg-[#171717] hover:text-[#C8A96B] px-3 py-1.5 rounded-full border border-[#E8DFD3] transition-colors font-medium"
                >
                  تيك توك @livora.ye
                </a>
              </div>
            </div>

          </div>

          {/* Direct WhatsApp message builder - 7 cols */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8DFD3] shadow-luxury">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-[#C8A96B]" />
              <h2 className="font-bold text-lg text-[#171717]">إرسال رسالة مباشرة إلى الإدارة</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  الاسم الكامل (اختياري):
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: فاطمة"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  رقم الهاتف (اختياري):
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 771234567"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  الاستفسار أو الرسالة:
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتبي استفسارك بخصوص المنتجات، التوصيل، أو الأسعار..."
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#C8A96B]/40 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>إرسال عبر تطبيق WhatsApp</span>
              </button>
            </form>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
