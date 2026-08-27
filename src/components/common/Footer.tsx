import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Instagram, ShieldCheck, Truck, Sparkles, Gift } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-[#FAF7F2] border-t border-[#2B2B2B] mt-20">
      {/* Value Propositions / Luxury Assurances */}
      <div className="border-b border-[#2B2B2B] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-full bg-[#2B2B2B] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#F6F0E8]">جودة أصلية مضمونة</h4>
              <p className="text-xs text-gray-400">نختار كل قطعة بأعلى معايير الفخامة والجمال</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-full bg-[#2B2B2B] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B]">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#F6F0E8]">توصيل لجميع المحافظات</h4>
              <p className="text-xs text-gray-400">خدمة شحن سريعة وآمنة إلى باب منزلك في اليمن</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-full bg-[#2B2B2B] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B]">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#F6F0E8]">تغليف هدايا فاخر</h4>
              <p className="text-xs text-gray-400">تغليف ملكي أنيق يليق بذوقك وإهدائك لمن تحبين</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-full bg-[#2B2B2B] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#F6F0E8]">طلب فوري وسهل</h4>
              <p className="text-xs text-gray-400">إتمام الطلب مباشرة بنقرة واحدة عبر الواتساب</p>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#C8A96B]/50 bg-white flex-shrink-0 shadow-md">
                <Image
                  src="/images/livora-logo.jpg"
                  alt="LIVORA Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-[0.25em] text-[#F6F0E8] group-hover:text-[#C8A96B] transition-colors leading-none">
                  LIVORA
                </span>
                <span className="text-xs tracking-[0.35em] text-[#C8A96B] font-medium mt-0.5">
                  ليفورا
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              علامة يمنية راقية تجمع بين الفخامة والأنوثة العصرية. نقدم لكِ أرقى الإكسسوارات، مستحضرات التجميل، ومنتجات العناية بالبشرة والحقائب لتظهري دائماً بإطلالة تسحر القلوب.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/967737462144"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-[#2B2B2B] hover:bg-[#C8A96B] hover:text-black transition-colors flex items-center justify-center text-[#C8A96B]"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#2B2B2B] hover:bg-[#C8A96B] hover:text-black transition-colors flex items-center justify-center text-[#C8A96B]"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[#C8A96B] tracking-wider uppercase">أقسام المتجر</h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li><Link href="/products?category=accessories" className="hover:text-[#C8A96B] transition-colors">الإكسسوارات الفاخرة</Link></li>
              <li><Link href="/products?category=makeup" className="hover:text-[#C8A96B] transition-colors">المكياج ومستحضرات التجميل</Link></li>
              <li><Link href="/products?category=skincare" className="hover:text-[#C8A96B] transition-colors">منتجات العناية بالبشرة</Link></li>
              <li><Link href="/products?category=beauty-tools" className="hover:text-[#C8A96B] transition-colors">أدوات وفرش التجميل</Link></li>
              <li><Link href="/products?category=hair-accessories" className="hover:text-[#C8A96B] transition-colors">إكسسوارات الشعر</Link></li>
              <li><Link href="/products?category=handbags" className="hover:text-[#C8A96B] transition-colors">الحقائب والكلاتشات</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[#C8A96B] tracking-wider uppercase">روابط هامة</h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li><Link href="/" className="hover:text-[#C8A96B] transition-colors">الصفحة الرئيسية</Link></li>
              <li><Link href="/products" className="hover:text-[#C8A96B] transition-colors">جميع المنتجات</Link></li>
              <li><Link href="/about" className="hover:text-[#C8A96B] transition-colors">عن متجر ليفورا</Link></li>
              <li><Link href="/contact" className="hover:text-[#C8A96B] transition-colors">التواصل والاستفسار</Link></li>
              <li><Link href="/wishlist" className="hover:text-[#C8A96B] transition-colors">قائمة رغباتي (المفضلة)</Link></li>
              <li><Link href="/cart" className="hover:text-[#C8A96B] transition-colors">سلة المشتريات</Link></li>
            </ul>
          </div>

          {/* Contact and WhatsApp direct */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[#C8A96B] tracking-wider uppercase">الطلب المباشر والدعم</h4>
            <p className="text-xs text-gray-400">
              فريق ليفورا يسعد بخدمتك والرد على استفساراتك وتجهيز طلباتك عبر تطبيق الواتساب طوال أيام الأسبوع.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/967737462144"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C8A96B] text-black font-bold text-xs px-4 py-2.5 rounded-full hover:bg-white transition-all shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>967737462144+</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#2B2B2B] py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 LIVORA | ليفورا. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-gray-500">
            <Link href="/about" className="hover:text-gray-300">عن العلامة</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gray-300">خدمة العملاء</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-[#C8A96B]">لوحة الإدارة</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
