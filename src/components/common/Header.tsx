"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, Phone, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "جميع المنتجات", href: "/products" },
    { name: "التصنيفات", href: "/#categories" },
    { name: "العروض الحصرية", href: "/products?filter=offers" },
    { name: "قصة ليفورا", href: "/about" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#171717] text-[#C8A96B] text-xs font-medium py-2 px-4 text-center border-b border-[#2B2B2B] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>توصيل متاح لكافة محافظات الجمهورية اليمنية | اطلبي الآن عبر الواتساب بكل سهولة</span>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#F6F0E8]/95 backdrop-blur-md shadow-sm border-[#E8DFD3] py-2.5"
            : "bg-[#F6F0E8] border-[#E8DFD3]/60 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Trigger & Search */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="القائمة الرئيسية"
                className="p-2 text-[#171717] hover:text-[#C8A96B] transition-colors rounded-lg focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-search-modal"));
                }}
                aria-label="بحث"
                className="p-2 text-[#171717] hover:text-[#C8A96B] transition-colors rounded-lg"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative py-1 hover:text-[#C8A96B] ${
                      isActive ? "text-[#C8A96B] font-bold" : "text-[#171717]"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-[#C8A96B] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center">
              <Link href="/" className="inline-flex flex-col items-center group">
                <span className="font-luxury text-2xl sm:text-3xl font-bold tracking-[0.25em] text-[#171717] group-hover:text-[#C8A96B] transition-colors">
                  LIVORA
                </span>
                <span className="text-[10px] tracking-[0.3em] font-medium text-[#C8A96B] -mt-1 font-sans">
                  ليفورا
                </span>
              </Link>
            </div>

            {/* Actions: Search, Wishlist, Cart */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-search-modal"));
                }}
                aria-label="بحث سريع"
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8DFD3] hover:border-[#C8A96B] text-xs text-[#737373] hover:text-[#171717] bg-white/60 transition-all shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>ابحثي عن منتج، تصنيف...</span>
              </button>

              <Link
                href="/wishlist"
                aria-label="المفضلة"
                className="relative p-2 text-[#171717] hover:text-[#C8A96B] transition-colors rounded-full hover:bg-white/50"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#C8A96B] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                aria-label="السلة"
                className="relative p-2 text-[#171717] hover:text-[#C8A96B] transition-colors rounded-full hover:bg-white/50"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#171717] text-[#C8A96B] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm border border-[#C8A96B]">
                    {totalItems}
                  </span>
                )}
              </button>

              <a
                href="https://wa.me/967737462144"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-300 border border-[#C8A96B]/40 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>تواصل واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#FAF7F2] h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD3]">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#C8A96B]/50 shadow-sm bg-white flex-shrink-0">
                  <Image
                    src="/images/livora-logo.jpg"
                    alt="LIVORA Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-luxury text-lg font-bold tracking-widest text-[#171717]">LIVORA</span>
                  <span className="text-[9px] text-[#C8A96B] tracking-wider font-sans">ليفورا</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-3 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? "bg-[#C8A96B]/15 text-[#C8A96B] font-bold"
                      : "text-[#171717] hover:bg-[#E8DFD3]/40"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-[#E8DFD3] flex flex-col gap-3">
              <a
                href="https://wa.me/967737462144"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#171717] text-[#C8A96B] font-medium py-2.5 rounded-xl border border-[#C8A96B]/50"
              >
                <Phone className="w-4 h-4" />
                <span>طلب مباشر عبر الواتساب</span>
              </a>
              <p className="text-center text-xs text-[#737373]">
                رقم المتجر: 967737462144+
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
