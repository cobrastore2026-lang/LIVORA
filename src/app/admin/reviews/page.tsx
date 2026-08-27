"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2, Star, X } from "lucide-react";
import { Review } from "@/types";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Form states
  const [authorName, setAuthorName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    setAuthorName("");
    setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop");
    setRating(5);
    setContent("");
    setIsActive(true);
    setSortOrder("0");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (r: Review) => {
    setEditingReview(r);
    setAuthorName(r.authorName);
    setAvatarUrl(r.avatarUrl || "");
    setRating(r.rating);
    setContent(r.content);
    setIsActive(r.isActive);
    setSortOrder(r.sortOrder.toString());
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = {
        authorName,
        avatarUrl: avatarUrl || undefined,
        rating,
        content,
        isActive,
        sortOrder: parseInt(sortOrder) || 0,
      };

      const url = editingReview ? `/api/reviews/${editingReview.id}` : "/api/reviews";
      const method = editingReview ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchReviews();
      } else {
        setError(data.error || "فشل حفظ الرأي");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل تريدين حذف رأي "${name}"؟`)) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
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
            إدارة &quot;آراء مختارة&quot; ({reviews.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">
            إضافة وتعديل شهادات العملاء وتحديد التقييم بالنجوم وحالة العرض
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold py-3 px-5 rounded-xl transition-all border border-[#C8A96B]/40 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة رأي مختار</span>
        </button>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[#C8A96B] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-6 border border-[#E8DFD3] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating ? "text-[#C8A96B] fill-[#C8A96B]" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {r.isActive ? "معروض" : "مخفي"}
                  </span>
                </div>

                <p className="text-xs text-gray-700 italic leading-relaxed">
                  &ldquo;{r.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {r.avatarUrl ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C8A96B]/40">
                      <Image src={r.avatarUrl} alt={r.authorName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#171717] text-[#C8A96B] text-xs font-bold flex items-center justify-center">
                      {r.authorName.charAt(0)}
                    </div>
                  )}
                  <span className="font-bold text-xs text-[#171717]">{r.authorName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(r)}
                    className="p-1.5 text-[#C8A96B] hover:bg-[#C8A96B]/15 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id, r.authorName)}
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
                {editingReview ? "تعديل الرأي المختار" : "إضافة رأي جديد"}
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
                  اسم العميلة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="مثال: أروى باحميد"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  التقييم بالنجوم:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-[#C8A96B]"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? "fill-[#C8A96B] text-[#C8A96B]" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <ImageUploader
                value={avatarUrl}
                onChange={setAvatarUrl}
                label="الصورة الشخصية للعميلة (اختياري)"
                aspectRatio="square"
              />

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1.5">
                  نص الرأي <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتبي نص الشهادة والثناء على المنتجات والتغليف..."
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reviewActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#C8A96B] rounded cursor-pointer"
                />
                <label htmlFor="reviewActive" className="text-xs font-semibold text-[#171717] cursor-pointer">
                  تفعيل العرض في الصفحة الرئيسية
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>حفظ الرأي</span>}
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
