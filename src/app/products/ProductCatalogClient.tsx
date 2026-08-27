"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown, X, Sparkles, Flame, Tag, Clock } from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import { normalizeArabicText } from "@/lib/utils";
import { Product, Category } from "@/types";

interface ProductCatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialFilter?: string;
  initialSort?: string;
  initialQuery?: string;
}

export default function ProductCatalogClient({
  initialProducts,
  categories,
  initialCategory,
  initialFilter,
  initialSort = "newest",
  initialQuery = "",
}: ProductCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter || "all");
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category check
      if (selectedCategory !== "all" && product.category?.slug !== selectedCategory) {
        return false;
      }

      // Filter tags check
      if (selectedFilter === "offers" && (!product.discount || product.discount <= 0)) {
        return false;
      }
      if (selectedFilter === "bestseller" && !product.isBestSeller) {
        return false;
      }
      if (selectedFilter === "featured" && !product.isFeatured) {
        return false;
      }
      if (selectedFilter === "new" && !product.isNew) {
        return false;
      }

      // Price limit check
      if (product.price > maxPrice) {
        return false;
      }

      // Search query check (with Arabic normalization)
      if (searchQuery.trim()) {
        const normQuery = normalizeArabicText(searchQuery);
        const normName = normalizeArabicText(product.name);
        const normDesc = normalizeArabicText(product.description || "");
        const normCat = normalizeArabicText(product.category?.name || "");

        if (!normName.includes(normQuery) && !normDesc.includes(normQuery) && !normCat.includes(normQuery)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "bestseller") {
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [initialProducts, selectedCategory, selectedFilter, sortBy, searchQuery, maxPrice]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedFilter("all");
    setSortBy("newest");
    setSearchQuery("");
    setMaxPrice(50000);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedFilter !== "all" ||
    sortBy !== "newest" ||
    searchQuery.trim() !== "" ||
    maxPrice < 50000;

  return (
    <div>
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E8DFD3]">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#171717]">
            {selectedCategory !== "all"
              ? categories.find((c) => c.slug === selectedCategory)?.name || "تشكيلة المنتجات"
              : "تشكيلة منتجات LIVORA الفاخرة"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-light">
            عرض {filteredProducts.length} من أصل {initialProducts.length} منتج
          </p>
        </div>

        {/* Action Controls: Mobile filter trigger + Desktop sort */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8DFD3] rounded-xl text-xs font-bold text-[#171717] shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C8A96B]" />
            <span>الفلاتر ({hasActiveFilters ? "مفعلة" : "الكل"})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-[#E8DFD3] px-3.5 py-2.5 rounded-xl text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span className="text-gray-400 hidden sm:inline">الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#171717] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest">الأحدث وصولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="bestseller">الأكثر طلباً</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-luxury sticky top-28 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
            <h3 className="font-bold text-sm text-[#171717] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C8A96B]" />
              <span>تصفية المنتجات</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-red-500 hover:underline font-medium"
              >
                إعادة ضبط
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#171717]">التصنيف:</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-right text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === "all"
                    ? "bg-[#171717] text-[#C8A96B] font-bold"
                    : "text-[#737373] hover:bg-[#F6F0E8] hover:text-[#171717]"
                }`}
              >
                <span>جميع التصنيفات</span>
                <span>({initialProducts.length})</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-right text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? "bg-[#171717] text-[#C8A96B] font-bold"
                      : "text-[#737373] hover:bg-[#F6F0E8] hover:text-[#171717]"
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat._count?.products !== undefined && <span>({cat._count.products})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Special Tags Filter */}
          <div className="space-y-2 pt-3 border-t border-[#E8DFD3]">
            <label className="block text-xs font-bold text-[#171717]">المجموعات الخاصة:</label>
            <div className="space-y-1">
              {[
                { id: "all", label: "كافة المنتجات", icon: Sparkles },
                { id: "offers", label: "العروض والخصومات", icon: Tag },
                { id: "bestseller", label: "الأكثر مبيعاً", icon: Flame },
                { id: "new", label: "أحدث الإضافات", icon: Clock },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`w-full text-right text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                    selectedFilter === f.id
                      ? "bg-[#C8A96B]/20 text-[#171717] font-bold border border-[#C8A96B]/40"
                      : "text-[#737373] hover:bg-[#F6F0E8] hover:text-[#171717]"
                  }`}
                >
                  <f.icon className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2 pt-3 border-t border-[#E8DFD3]">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#171717]">أقصى سعر:</label>
              <span className="font-bold text-[#C8A96B]">{maxPrice.toLocaleString('ar-YE')} ر.ي</span>
            </div>
            <input
              type="range"
              min={5000}
              max={50000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C8A96B] cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFD3] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-center text-[#C8A96B] mx-auto">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-[#171717]">لا توجد نتائج مطابقة لخيارات التصفية</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto font-light">
                جربي اختيار تصنيف آخر أو إعادة ضبط الفلاتر لاستعراض جميع منتجات ليفورا.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold py-2.5 px-6 rounded-full transition-colors border border-[#C8A96B]/30"
              >
                إعادة ضبط كافة الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#FAF7F2] h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD3]">
              <h3 className="font-bold text-sm text-[#171717] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C8A96B]" />
                <span>فلاتر المنتجات</span>
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-gray-500 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-2">التصنيف:</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-right text-xs py-2 px-3 rounded-lg ${
                      selectedCategory === "all" ? "bg-[#171717] text-[#C8A96B] font-bold" : "text-[#737373]"
                    }`}
                  >
                    جميع التصنيفات
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-right text-xs py-2 px-3 rounded-lg ${
                        selectedCategory === c.slug ? "bg-[#171717] text-[#C8A96B] font-bold" : "text-[#737373]"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special tags */}
              <div className="pt-4 border-t border-[#E8DFD3]">
                <label className="block text-xs font-bold text-[#171717] mb-2">المجموعات:</label>
                <div className="space-y-1">
                  {[
                    { id: "all", label: "كافة المنتجات" },
                    { id: "offers", label: "العروض والخصومات" },
                    { id: "bestseller", label: "الأكثر مبيعاً" },
                    { id: "new", label: "أحدث الإضافات" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFilter(f.id)}
                      className={`w-full text-right text-xs py-2 px-3 rounded-lg ${
                        selectedFilter === f.id ? "bg-[#C8A96B]/20 text-[#171717] font-bold" : "text-[#737373]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFD3] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#171717] text-[#C8A96B] font-bold text-xs py-3 rounded-xl border border-[#C8A96B]/40"
              >
                تطبيق الفلاتر ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full text-center text-xs text-red-500 py-1.5"
                >
                  إعادة ضبط
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
