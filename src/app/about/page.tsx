import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Phone, ShieldCheck, Heart, Crown, Truck, Gift } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export default async function AboutPage() {
  const settings = await prisma.setting.findMany();
  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const aboutTitle = settingsMap["about_title"] || "قصة ليفورا | فخامة تليق بكِ";
  const aboutText = settingsMap["about_text"] || "انطلقت LIVORA لتكون المعيار الحقيقي للأناقة والجمال العصري في اليمن...";
  const aboutImage = settingsMap["about_image"] || "/images/livora-logo.jpg";

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E8]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        
        {/* Hero About Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#C8A96B]/20 text-[#171717] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#C8A96B]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>عن LIVORA ليفورا</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#171717]">
            {aboutTitle}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            وجهتكِ الأولى في اليمن للتألق بأرقى الإكسسوارات ومستحضرات التجميل والعناية الفاخرة.
          </p>
        </div>

        {/* Narrative & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-[#E8DFD3] shadow-luxury">
          <div className="lg:col-span-6 relative aspect-square max-w-md mx-auto w-full rounded-2xl overflow-hidden shadow-md border-2 border-[#C8A96B]/20 bg-[#FAF7F2]">
            <Image
              src={aboutImage}
              alt="LIVORA Story - شعار ليفورا الرسمي"
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
              رؤيتنا وشغفنا
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#737373] whitespace-pre-line font-light">
              {aboutText}
            </p>

            <div className="pt-4 border-t border-[#FAF7F2]">
              <a
                href="https://wa.me/967737462144"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs sm:text-sm py-3 px-6 rounded-full transition-all border border-[#C8A96B]/40 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>تواصل مباشر عبر الواتساب</span>
              </a>
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mx-auto">
              <Crown className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-[#171717]">فخامة لا تضاهى</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              نختار كل قطعة لتلهمك الثقة والجمال الاستثنائي في كل مناسبة.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-[#171717]">أصالة وضمان الجودة</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              منتجات أصلية 100% مختارة بعناية فائقة تلبي أعلى المعايير.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-[#171717]">تجربة عميلة ملكية</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              خدمة راقية وسرعة استجابة وتوصيل آمن إلى جميع مدن اليمن.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
