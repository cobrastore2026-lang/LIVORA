"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("open-search-modal", handleOpen);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-search-modal", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const trendingTags = ["عقد ذهبي", "أحمر شفاه", "سيروم", "حقيبة كلاتش", "إكسسوارات شعر", "فرش مكياج"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="min-h-screen px-4 text-center flex items-start justify-center pt-16 sm:pt-24">
        <div className="inline-block w-full max-w-2xl bg-[#FAF7F2] rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all border border-[#E8DFD3] relative z-10">
          
          {/* Search Header Form */}
          <form onSubmit={handleSearchSubmit} className="relative p-4 border-b border-[#E8DFD3] bg-white flex items-center gap-3">
            <Search className="w-5 h-5 text-[#C8A96B] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحثي عن المنتجات، الإكسسوارات، المكياج..."
              className="w-full bg-transparent text-sm sm:text-base text-[#171717] placeholder-gray-400 focus:outline-none"
            />
            {isLoading && <Loader2 className="w-4 h-4 text-[#C8A96B] animate-spin flex-shrink-0" />}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-black rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Trending Tags */}
          <div className="p-4 bg-[#F6F0E8] border-b border-[#E8DFD3] flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#737373] flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#C8A96B]" />
              الأكثر بحثاً:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="text-xs bg-white hover:bg-[#171717] hover:text-[#C8A96B] text-[#171717] px-2.5 py-1 rounded-full border border-[#E8DFD3] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {query.trim() === "" ? (
              <div className="py-8 text-center text-xs text-gray-500">
                اكتبي اسم المنتج أو التصنيف للبدء في البحث الفوري...
              </div>
            ) : results.length === 0 && !isLoading ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm font-semibold text-[#171717]">لم يتم العثور على نتائج مطابقة لـ &quot;{query}&quot;</p>
                <p className="text-xs text-gray-500">جربي استخدام كلمات بحث أخرى أو تصفح التصنيفات.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((prod) => {
                  const cover = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";
                  return (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2.5 bg-white hover:bg-[#FAF7F2] rounded-xl border border-[#E8DFD3] hover:border-[#C8A96B] transition-all group"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F6F0E8] flex-shrink-0">
                        <Image src={cover} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-gray-400 block truncate">{prod.category?.name}</span>
                        <h4 className="text-xs font-semibold text-[#171717] group-hover:text-[#C8A96B] transition-colors truncate">
                          {prod.name}
                        </h4>
                        <span className="text-xs font-bold text-[#171717] mt-0.5 block">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* View All Button if results */}
          {results.length > 0 && (
            <div className="p-3 bg-white border-t border-[#E8DFD3] text-center">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="text-xs font-bold text-[#171717] hover:text-[#C8A96B] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>عرض جميع نتائج البحث لـ &quot;{query}&quot;</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
