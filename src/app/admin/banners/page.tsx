"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2, Sparkles, X, Image as ImageIcon } from "lucide-react";
import { Banner } from "@/types";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [buttonText, setButtonText] = useState("اكتشفي التشكيلة");
  const [buttonLink, setButtonLink] = useState("/products");
  const [badgeText, setBadgeText] = useState("تشكيلة حصرية");
  const [sortOrder, setSortOrder] = useState("1");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (data.banners) setBanners(data.banners);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setTitle("");
    setSubtitle("تشكيلة LIVORA الحصرية 2026");
    setDescription("");
    setImageUrl("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop");
    setButtonText("تسوقي الآن");
    setButtonLink("/products");
    setBadgeText("مجموعة فاخرة");
    setSortOrder("1");
    setIsActive(true);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || "");
    setDescription(b.description || "");
    setImageUrl(b.imageUrl);
    setButtonText(b.buttonText || "تسوقي الآن");
    setButtonLink(b.buttonLink || "/products");
    setBadgeText(b.badgeText || "");
    setSortOrder(b.sortOrder.toString());
    setIsActive(b.isActive);
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = {
        title,
        subtitle,
        description,
        imageUrl,
        buttonText,
        buttonLink,
        badgeText,
        sortOrder: parseInt(sortOrder) || 1,
        isActive,
      };

      const url = editingBanner ? `/api/banners/${editingBanner.id}` : "/api/banners";
      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchBanners();
      } else {
        setError(data.error || "فشل حفظ البانر");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل تريدين حذف البانر "${name}"؟`)) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
            إدارة البانرات والـ Hero ({banners.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">
            التحكم في سلايدات البانر الرئيسي والعناوين والأزرار الترويجية
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold py-3 px-5 rounded-xl transition-all border border-[#C8A96B]/40 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة بانر جديد</span>
        </button>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[#C8A96B] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD3] shadow-sm flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/9] w-full bg-[#171717]">
                <Image src={b.imageUrl} alt={b.title} fill className="object-cover opacity-80" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      b.isActive ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {b.isActive ? "مفعّل" : "معطل"}
                  </span>
                  {b.badgeText && (
                    <span className="bg-[#171717] text-[#C8A96B] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#C8A96B]/50">
                      {b.badgeText}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                {b.subtitle && (
                  <span className="text-[11px] text-[#C8A96B] font-bold block">{b.subtitle}</span>
                )}
                <h3 className="font-bold text-base text-[#171717]">{b.title}</h3>
                {b.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{b.description}</p>
                )}
                <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>زر الـ CTA: <strong className="text-[#171717]">{b.buttonText}</strong></span>
                  <span>الترتيب: {b.sortOrder}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFD3] flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-2 text-[#C8A96B] hover:bg-[#C8A96B]/15 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.title)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFD3] z-10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
              <h3 className="font-bold text-base text-[#171717]">
                {editingBanner ? "تعديل البانر" : "إضافة بانر جديد"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  العنوان الرئيسي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: أناقة لا متناهية تُبرز سحرك الخاص"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    العنوان الفرعي
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="تشكيلة LIVORA 2026"
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2 text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    نص الشارة العلوية
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="مجموعة حصرية"
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2 text-xs text-[#171717]"
                  />
                </div>
              </div>

              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="صورة البانر"
                aspectRatio="banner"
              />

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  الوصف الموجز
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="نص توضيحي يظهر تحت العنوان الرئيسي..."
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    نص زر الـ CTA
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="اكتشفي التشكيلة"
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2 text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    رابط الزر
                  </label>
                  <input
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    placeholder="/products"
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2 text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#C8A96B] rounded cursor-pointer"
                />
                <label htmlFor="bannerActive" className="text-xs font-semibold text-[#171717] cursor-pointer">
                  تفعيل ظهور البانر في الصفحة الرئيسية
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>حفظ البانر</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
