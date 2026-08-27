"use client";

import React from "react";
import { Menu, ShieldCheck, User } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  adminName?: string;
}

export default function AdminHeader({ onOpenMobileSidebar, adminName = "مدير النظام" }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-[#E8DFD3] py-4 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      
      {/* Mobile Sidebar Toggle */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 text-[#171717] hover:bg-[#FAF7F2] rounded-lg"
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-serif font-bold text-lg text-[#171717]">LIVORA</span>
      </div>

      {/* Title / Breadcrumb context */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-[#C8A96B]" />
        <span>لوحة التحكم الإدارية المعتمدة لمتجر LIVORA</span>
      </div>

      {/* Admin User Profile Tag */}
      <div className="flex items-center gap-3 mr-auto">
        <div className="flex items-center gap-2.5 bg-[#FAF7F2] border border-[#E8DFD3] px-3.5 py-1.5 rounded-full">
          <div className="w-6 h-6 rounded-full bg-[#171717] text-[#C8A96B] flex items-center justify-center text-xs font-bold">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#171717]">{adminName}</span>
        </div>
      </div>

    </header>
  );
}
