"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Star,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "لوحة المؤشرات", href: "/admin", icon: LayoutDashboard },
    { name: "إدارة المنتجات", href: "/admin/products", icon: Package },
    { name: "إدارة التصنيفات", href: "/admin/categories", icon: Layers },
    { name: "إدارة الطلبات", href: "/admin/orders", icon: ShoppingBag },
    { name: "آراء مختارة", href: "/admin/reviews", icon: Star },
    { name: "البانرات والـ Hero", href: "/admin/banners", icon: ImageIcon },
    { name: "إعدادات المتجر", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <aside className="w-64 bg-[#171717] text-[#FAF7F2] h-full flex flex-col justify-between border-l border-[#2B2B2B] shadow-2xl select-none">
      
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#2B2B2B] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C8A96B]/50 bg-white flex-shrink-0">
              <Image
                src="/images/livora-logo.jpg"
                alt="LIVORA Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#F6F0E8]">
                LIVORA
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#C8A96B] font-semibold -mt-0.5">
                لوحة الإدارة
              </span>
            </div>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#C8A96B] text-black shadow-md font-bold"
                    : "text-gray-300 hover:bg-[#2B2B2B] hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-[#C8A96B]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation: Visit Store + Logout */}
      <div className="p-4 border-t border-[#2B2B2B] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-gray-300 hover:bg-[#2B2B2B] hover:text-[#C8A96B] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>عرض المتجر</span>
          </span>
          <span className="text-[10px] bg-[#2B2B2B] px-2 py-0.5 rounded text-gray-400">مباشر</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors font-medium text-right"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

    </aside>
  );
}
