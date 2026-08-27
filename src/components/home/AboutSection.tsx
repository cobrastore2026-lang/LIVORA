import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Phone, CheckCircle2, ArrowLeft } from "lucide-react";

interface AboutSectionProps {
  title?: string;
  text?: string;
  image?: string;
}

export default function AboutSection({
  title = "قصة ليفورا | فخامة تليق بكِ",
  text = "انطلقت LIVORA لتكون المعيار الحقيقي للأناقة والجمال العصري في اليمن. نختار كل قطعة بعناية استثنائية لتلهم كل امرأة ثقة مطلقة وإشراقة ساحرة. نؤمن بأن الجمال تفاصيل دقيقة، ولذا نوفر منتجات راقية بأعلى معايير الجودة لتصل إلى باب منزلك بكل فخامة وسرعة.",
  image = "/images/livora-logo.jpg",
}: AboutSectionProps) {
  const highlights = [
    "مختارات حصرية لا تتوفر في الأسواق التقليدية",
    "توصيل آمن وسريع لكافة المحافظات والمدن اليمنية",
    "تغليف ملكي فاخر جاهز للإهداء",
    "تجربة طلب مباشرة وفورية دون تعقيدات عبر الواتساب",
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Image with Luxury Gold Accent Border */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C8A96B]/30 bg-white">
              <Image
                src={image}
                alt="LIVORA Story - شعار ليفورا الرسمي"
                fill
                className="object-contain p-4"
              />
            </div>
            {/* Luxury Float Badge */}
            <div className="absolute -bottom-4 -right-4 sm:bottom-4 sm:-right-4 bg-[#171717] text-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#C8A96B]/50 shadow-xl max-w-xs hidden sm:block">
              <span className="font-serif text-xl font-bold tracking-widest text-[#C8A96B] block">LIVORA</span>
              <p className="text-[11px] text-gray-300 mt-1">الوجهة الأولى للمرأة الأنيقة في اليمن</p>
            </div>
          </div>

          {/* Text Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#C8A96B]/15 text-[#C8A96B] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#C8A96B]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>هوية ليفورا الفاخرة</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#171717] leading-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-[#737373] font-light">
              {text}
            </p>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96B] flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-[#171717] font-medium leading-normal">{item}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="pt-4 flex items-center gap-4 flex-wrap">
              <a
                href="https://wa.me/967737462144"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs sm:text-sm py-3.5 px-6 rounded-full transition-all duration-300 border border-[#C8A96B]/40 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>تحدثي معنا عبر WhatsApp</span>
              </a>

              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#171717] hover:text-[#C8A96B] transition-colors"
              >
                <span>اقرئي المزيد عن رؤيتنا</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
