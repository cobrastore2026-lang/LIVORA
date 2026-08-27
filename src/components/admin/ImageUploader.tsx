"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Plus, X, Loader2, Link as LinkIcon, Check, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: "square" | "video" | "banner";
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "صورة الغلاف",
  placeholder = "أدخلي رابط الصورة أو قومي برفعها من جهازك",
  aspectRatio = "square",
  className = "",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState(value || "");
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        onChange(data.url);
        setUrlInput(data.url);
      } else {
        setError(data.error || "فشل رفع الصورة");
      }
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ أثناء الاتصال بالخادم لرفع الصورة");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setError("");
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    setError("");
  };

  const aspectClass =
    aspectRatio === "banner"
      ? "aspect-[21/9] sm:aspect-[16/7]"
      : aspectRatio === "video"
      ? "aspect-video"
      : "aspect-square";

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#171717]">
          {label}
        </label>
      )}

      {error && (
        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* If Image exists: show preview */}
      {value ? (
        <div className="relative group border border-[#E8DFD3] rounded-2xl overflow-hidden bg-[#FAF7F2] p-2">
          <div className={`relative ${aspectClass} w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="معاينة الصورة"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x400/F6F0E8/171717?text=صورة+غير+صالحة";
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#E8DFD3] text-xs">
            <span className="text-gray-500 truncate max-w-[200px] text-[11px] font-mono" dir="ltr">
              {value}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-2.5 py-1 bg-white hover:bg-[#FAF7F2] text-[#171717] rounded-lg border border-[#E8DFD3] text-[11px] font-bold transition-colors"
              >
                تغيير
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* If No Image: Upload or Enter URL Box */
        <div className="border-2 border-dashed border-[#E8DFD3] hover:border-[#C8A96B] rounded-2xl p-5 bg-[#FAF7F2] transition-colors">
          
          {/* Tabs: Upload / URL */}
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "upload"
                  ? "bg-[#171717] text-[#C8A96B]"
                  : "bg-white text-gray-600 hover:text-black border border-[#E8DFD3]"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع من جهازك</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "url"
                  ? "bg-[#171717] text-[#C8A96B]"
                  : "bg-white text-gray-600 hover:text-black border border-[#E8DFD3]"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>رابط صورة مباشر</span>
            </button>
          </div>

          {activeTab === "upload" ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer flex flex-col items-center justify-center py-6 text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-[#E8DFD3] group-hover:border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shadow-sm mb-3 transition-transform group-hover:scale-105">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <p className="text-xs font-bold text-[#171717]">
                {isUploading ? "جاري رفع الصورة..." : "انقري لاختيار صورة من جهازك"}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                PNG, JPG, WEBP, GIF (الحد الأقصى 10 ميغابايت)
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleUrlSubmit();
                    }
                  }}
                  placeholder={placeholder}
                  className="flex-1 bg-white border border-[#E8DFD3] rounded-xl px-3.5 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  تعيين
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
