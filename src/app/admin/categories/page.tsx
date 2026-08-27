"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2, Layers, Check, X } from "lucide-react";
import { Category } from "@/types";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop");
    setSortOrder("0");
    setIsActive(true);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setSortOrder(cat.sortOrder.toString());
    setIsActive(cat.isActive);
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = {
        name,
        slug: slug || undefined,
        description,
        image,
        sortOrder: parseInt(sortOrder) || 0,
        isActive,
      };

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        setError(data.error || "فشل حفظ التصنيف");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنتِ متأكدة من حذف تصنيف "${name}"؟`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.error || "فشل حذف التصنيف");
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
            إدارة التصنيفات ({categories.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">
            إضافة أقسام المتجر وترتيبها وتعيين صور الغلاف
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold py-3 px-5 rounded-xl transition-all border border-[#C8A96B]/40 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تصنيف جديد</span>
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[#C8A96B] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-5 border border-[#E8DFD3] shadow-sm flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8DFD3] flex-shrink-0">
                  <Image
                    src={
                      cat.image ||
                      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#171717] truncate">{cat.name}</h3>
                    {!cat.isActive && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        معطل
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                    {cat.description || "لا يوجد وصف"}
                  </p>
                  <span className="text-[11px] font-semibold text-[#C8A96B] mt-1 block">
                    {cat._count?.products || 0} منتج
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#FAF7F2] flex items-center justify-between">
                <span className="text-[10px] text-gray-400">الترتيب: {cat.sortOrder}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-[#C8A96B] hover:bg-[#C8A96B]/15 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                {editingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
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
                  اسم التصنيف <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: الإكسسوارات الفاخرة"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  الاسم في الرابط (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="accessories"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <ImageUploader
                value={image}
                onChange={setImage}
                label="صورة غلاف التصنيف"
                aspectRatio="video"
              />

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  الوصف
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف مختصر للتصنيف..."
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    الترتيب (الأولوية)
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2 text-xs text-[#171717]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="catActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#C8A96B] rounded cursor-pointer"
                  />
                  <label htmlFor="catActive" className="text-xs font-semibold text-[#171717] cursor-pointer">
                    مفعّل في المتجر
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>حفظ التصنيف</span>}
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
