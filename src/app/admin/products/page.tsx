"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Loader2, Sparkles, Tag, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Product, Category } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      if (dataProd.products) setProducts(dataProd.products);
      if (dataCat.categories) setCategories(dataCat.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنتِ متأكدة من حذف المنتج "${name}"؟`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("فشل حذف المنتج");
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter((p) => {
    if (selectedCat !== "all" && p.category?.slug !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
            إدارة المنتجات ({products.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">
            إضافة وتعديل وحذف المنتجات وتحديد الأسعار والخيارات وشارات العرض
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold py-3 px-5 rounded-xl transition-all border border-[#C8A96B]/40 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الـ SKU أو التصنيف..."
            className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl pr-10 pl-3.5 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full sm:w-auto bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-4 py-2 text-xs font-semibold text-[#171717] focus:outline-none cursor-pointer"
        >
          <option value="all">جميع التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table / Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[#C8A96B] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-[#E8DFD3] text-xs text-gray-500">
          لا توجد منتجات مطابقة لخيارات البحث.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F2] text-[#171717] font-bold border-b border-[#E8DFD3]">
                <tr>
                  <th className="p-4">المنتج</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4">السعر</th>
                  <th className="p-4">الخصم</th>
                  <th className="p-4">المخزون المعروض</th>
                  <th className="p-4">الوسوم</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD3]">
                {filtered.map((prod) => {
                  const cover =
                    prod.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";

                  return (
                    <tr key={prod.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F6F0E8] flex-shrink-0 border border-[#E8DFD3]">
                            <Image src={cover} alt={prod.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-[#171717] block line-clamp-1">
                              {prod.name}
                            </span>
                            {prod.sku && (
                              <span className="text-[10px] text-gray-400">SKU: {prod.sku}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-[#737373] font-medium">
                        {prod.category?.name || "غير محدد"}
                      </td>

                      <td className="p-4 font-bold text-[#171717]">
                        {formatPrice(prod.price)}
                      </td>

                      <td className="p-4">
                        {prod.discount && prod.discount > 0 ? (
                          <span className="bg-[#171717] text-[#C8A96B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C8A96B]/40">
                            {prod.discount}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      <td className="p-4">
                        {prod.showStockBadge && prod.displayStockCount ? (
                          <span className="text-xs font-semibold text-[#C8A96B]">
                            متبقي {prod.displayStockCount}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">غير مفعّل</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {prod.isFeatured && (
                            <span className="bg-[#C8A96B]/15 text-[#C8A96B] text-[10px] px-2 py-0.5 rounded-md font-bold">
                              مميز
                            </span>
                          )}
                          {prod.isBestSeller && (
                            <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded-md font-bold">
                              أكثر مبيعاً
                            </span>
                          )}
                          {prod.isNew && (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md font-bold">
                              جديد
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            title="معاينة في المتجر"
                            className="p-2 text-gray-400 hover:text-[#171717] hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            title="تعديل"
                            className="p-2 text-[#C8A96B] hover:bg-[#C8A96B]/15 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            disabled={deletingId === prod.id}
                            title="حذف"
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === prod.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
