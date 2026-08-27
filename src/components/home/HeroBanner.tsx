"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { Banner } from "@/types";

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroBanners = banners && banners.length > 0 ? banners : [
    {
      id: "default-1",
      title: "أناقة لا متناهية تُبرز سحرك الخاص",
      subtitle: "تشكيلة LIVORA الحصرية 2026",
      description: "اكتشفي أرقى الإكسسوارات ومستحضرات الجمال المختارة لتمنحك إطلالة ملكية في كل مناسبة.",
      imageUrl: "/images/hero-slide-1.jpg",
      buttonText: "اكتشفي التشكيلة الجديدة",
      buttonLink: "/products",
      badgeText: "مجموعة فاخرة وحصرية",
      position: "HERO",
      isActive: true,
      sortOrder: 1,
    }
  ];

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const current = heroBanners[currentIndex] || heroBanners[0];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#171717] text-white">
      <div className="relative min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex items-center">
        
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={current.imageUrl}
            alt={current.title}
            fill
            priority
            className="object-cover object-center opacity-45 scale-105 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171717]/95 via-[#171717]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-80" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            
            {/* Badge */}
            {current.badgeText && (
              <div className="inline-flex items-center gap-2 bg-[#C8A96B]/20 border border-[#C8A96B]/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#C8A96B] backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{current.badgeText}</span>
              </div>
            )}

            {/* Subtitle */}
            {current.subtitle && (
              <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-[#C8A96B] uppercase">
                {current.subtitle}
              </p>
            )}

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-[#FAF7F2] leading-tight sm:leading-tight">
              {current.title}
            </h1>

            {/* Description */}
            {current.description && (
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                {current.description}
              </p>
            )}

            {/* CTA Button */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link
                href={current.buttonLink || "/products"}
                className="bg-[#C8A96B] hover:bg-white text-black font-bold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-300 flex items-center gap-2 shadow-gold-glow group"
              >
                <span>{current.buttonText || "تسوقي الآن"}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/about"
                className="text-sm text-gray-300 hover:text-[#C8A96B] font-medium px-4 py-3 transition-colors underline-offset-4 hover:underline"
              >
                تعرفي على قصة ليفورا
              </Link>
            </div>

          </div>
        </div>

        {/* Slide navigation controls */}
        {heroBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="السابق"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#C8A96B] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="التالي"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#C8A96B] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 right-1/2 translate-x-1/2 z-20 flex items-center gap-2">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`شريحة ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? "w-8 bg-[#C8A96B]" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
