"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Loader2, Sparkles, Image as ImageIcon, Check, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { Product, Category } from "@/types";

interface ProductImagePreviewItemProps {
  url: string;
  index: number;
  isCover: boolean;
  onSetCover: (index: number) => void;
  onRemove: (index: number) => void;
}

function ProductImagePreviewItem({
  url,
  index,
  isCover,
  onSetCover,
  onRemove,
}: ProductImagePreviewItemProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [url]);

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] border-2 border-[#E8DFD3] group shadow-sm flex items-center justify-center">
      {hasError ? (
        <div className="flex flex-col items-center justify-center p-3 text-center w-full h-full bg-[#FAF7F2]">
          <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
          <span className="text-[10px] text-gray-500 font-bold">تعذر تحميل الرابط</span>
          <span className="text-[9px] text-gray-400 truncate max-w-[100px] mt-0.5" dir="ltr">
            {url.substring(0, 24)}...
          </span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt={`Product Image ${index + 1}`}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      )}

      {isCover ? (
        <span className="absolute top-2 right-2 bg-[#171717] text-[#C8A96B] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#C8A96B]/40 shadow-sm z-10">
          الرئيسية
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onSetCover(index)}
          className="absolute top-2 right-2 bg-black/70 hover:bg-[#C8A96B] text-white hover:text-black text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          تعيين كرئيسية
        </button>
      )}

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute bottom-2 left-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
        title="حذف الصورة"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface ProductFormProps {
  initialProduct?: Product;
  categories: Category[];
}

export default function ProductForm({ initialProduct, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || categories[0]?.id || "");
  const [price, setPrice] = useState(initialProduct?.price ? initialProduct.price.toString() : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialProduct?.compareAtPrice ? initialProduct.compareAtPrice.toString() : ""
  );
  const [discount, setDiscount] = useState(
    initialProduct?.discount ? initialProduct.discount.toString() : "0"
  );
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [status, setStatus] = useState(initialProduct?.status || "ACTIVE");

  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  const [isBestSeller, setIsBestSeller] = useState(initialProduct?.isBestSeller || false);
  const [isNew, setIsNew] = useState(initialProduct?.isNew !== undefined ? initialProduct.isNew : true);

  const [displayStockCount, setDisplayStockCount] = useState(
    initialProduct?.displayStockCount !== undefined && initialProduct?.displayStockCount !== null
      ? initialProduct.displayStockCount.toString()
      : "5"
  );
  const [showStockBadge, setShowStockBadge] = useState(
    initialProduct?.showStockBadge !== undefined ? initialProduct.showStockBadge : true
  );

  // Multi-image list
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    if (initialProduct?.images && initialProduct.images.length > 0) {
      return initialProduct.images.map((img) => img.url);
    }
    return ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"];
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  // Variants list
  const [variants, setVariants] = useState<
    { name: string; optionValue: string; priceAdjustment: number; stock: number }[]
  >(() => {
    if (initialProduct?.variants && initialProduct.variants.length > 0) {
      return initialProduct.variants.map((v) => ({
        name: v.name,
        optionValue: v.optionValue,
        priceAdjustment: v.priceAdjustment,
        stock: v.stock,
      }));
    }
    return [{ name: "اللون", optionValue: "ذهبي شامبين", priceAdjustment: 0, stock: 10 }];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddImage = () => {
    let cleanUrl = newImageUrl.trim();
    if (!cleanUrl) return;

    // Normalize URL
    if (
      !cleanUrl.startsWith("http://") &&
      !cleanUrl.startsWith("https://") &&
      !cleanUrl.startsWith("/") &&
      !cleanUrl.startsWith("data:")
    ) {
      if (cleanUrl.includes(".") && !cleanUrl.includes("\\")) {
        cleanUrl = "https://" + cleanUrl;
      }
    }

    setImageUrls((prev) => [...prev, cleanUrl]);
    setNewImageUrl("");
    setImageUploadError("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setImageUploadError("");

    const fileList = Array.from(files);

    // 1. Instant local preview using FileReader
    for (const file of fileList) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const previewUrl = event.target.result as string;
          // Add preview immediately
          setImageUrls((prev) => [...prev, previewUrl]);
        }
      };
      reader.readAsDataURL(file);
    }

    // 2. Upload to server in background
    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success && data.url) {
          // Replace base64 preview with permanent server URL
          const serverUrl = data.url;
          setImageUrls((prev) => {
            const hasBase64 = prev.some((u) => u.startsWith("data:"));
            if (hasBase64) {
              let replaced = false;
              return prev.map((u) => {
                if (!replaced && u.startsWith("data:")) {
                  replaced = true;
                  return serverUrl;
                }
                return u;
              });
            }
            return prev.includes(serverUrl) ? prev : [...prev, serverUrl];
          });
        } else {
          setImageUploadError(data.error || "تعذر إكمال الرفع على الخادم");
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setImageUploadError("حدث خطأ أثناء الاتصال بالخادم لرفع الصورة");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setImageUrls((prev) => {
      const item = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [item, ...rest];
    });
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "اللون", optionValue: "خيار جديد", priceAdjustment: 0, stock: 10 },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: string, val: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Auto include un-added image URL if typed
      const finalImages = [...imageUrls];
      if (newImageUrl.trim() && !finalImages.includes(newImageUrl.trim())) {
        finalImages.push(newImageUrl.trim());
      }

      if (finalImages.length === 0) {
        setError("يرجى إضافة صورة واحدة على الأقل للمنتج");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name,
        slug: slug || undefined,
        sku: sku || undefined,
        categoryId,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        discount: discount ? parseInt(discount) : 0,
        shortDescription,
        description,
        status,
        isFeatured,
        isBestSeller,
        isNew,
        displayStockCount: displayStockCount ? parseInt(displayStockCount) : null,
        showStockBadge,
        images: finalImages,
        variants,
      };

      const url = isEditing ? `/api/products/${initialProduct.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(data.error || "فشل حفظ المنتج");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-16">
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-semibold border border-red-200">
          {error}
        </div>
      )}

      {/* Main Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-5">
        <h3 className="font-bold text-base text-[#171717] pb-3 border-b border-[#E8DFD3]">
          المعلومات الأساسية للمنتج
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              اسم المنتج <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عقد ليفورا الذهبي الملكي"
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              التصنيف <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              الاسم اللطيف في الرابط (Slug) - اختياري
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="livora-gold-necklace"
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              رمز المنتج (SKU)
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="LVR-ACC-001"
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#171717] mb-1.5">
            وصف مختصر
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="وصف تسويقي موجز يظهر في بطاقة المنتج..."
            className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#171717] mb-1.5">
            الوصف التفصيلي والمواصفات <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="تفاصيل المنتج، الخامات، طريقة الاستخدام، نصائح العناية..."
            className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
          />
        </div>
      </div>

      {/* Pricing & Stock Management */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-5">
        <h3 className="font-bold text-base text-[#171717] pb-3 border-b border-[#E8DFD3]">
          الأسعار والعروض وشارة المخزون
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              السعر (ر.ي) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="24000"
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              السعر قبل الخصم (ر.ي)
            </label>
            <input
              type="number"
              min="0"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="32000"
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              نسبة الخصم (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="25"
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        {/* Display Stock Count (متبقي X فقط) */}
        <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD3] grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              رقم العرض المتبقي (display_stock_count):
            </label>
            <p className="text-[11px] text-gray-500 font-light mb-2">
              الرقم الظاهر للعميلة مثل &quot;متبقي 4 فقط&quot;
            </p>
            <input
              type="number"
              min="1"
              max="99"
              value={displayStockCount}
              onChange={(e) => setDisplayStockCount(e.target.value)}
              className="w-full sm:w-32 bg-white border border-[#E8DFD3] rounded-xl px-3.5 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showStockBadge"
              checked={showStockBadge}
              onChange={(e) => setShowStockBadge(e.target.checked)}
              className="w-4 h-4 accent-[#C8A96B] rounded cursor-pointer"
            />
            <label htmlFor="showStockBadge" className="text-xs font-semibold text-[#171717] cursor-pointer">
              تفعيل ظهور شارة &quot;متبقي X فقط&quot; في بطاقة وصفحة المنتج
            </label>
          </div>
        </div>

        {/* Status & Tags */}
        <div className="pt-3 border-t border-[#E8DFD3] space-y-3">
          <label className="block text-xs font-bold text-[#171717]">
            وسوم التصنيف والترويج:
          </label>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#C8A96B] rounded cursor-pointer"
              />
              <span>منتج مميز (Featured)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 accent-[#C8A96B] rounded cursor-pointer"
              />
              <span>الأكثر طلباً (Best Seller)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 accent-[#C8A96B] rounded cursor-pointer"
              />
              <span>جديد (New)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
          <div>
            <h3 className="font-bold text-base text-[#171717]">معرض صور المنتج ({imageUrls.length})</h3>
            <p className="text-xs font-normal text-gray-400 mt-0.5">الصورة الأولى هي الصورة الرئيسية للمنتج</p>
          </div>
          
          <label
            htmlFor="product-file-upload-input"
            className={`inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold py-2.5 px-4 rounded-xl border border-[#C8A96B]/50 transition-all cursor-pointer shadow-sm select-none ${
              isUploadingImage ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{isUploadingImage ? "جاري الرفع..." : "رفع صور من جهازك"}</span>
            <input
              id="product-file-upload-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {imageUploadError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
            {imageUploadError}
          </div>
        )}

        {/* Single Direct URL Input Row */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImage();
              }
            }}
            placeholder="أدخلي أو الصقي رابط صورة مباشر (https://...)"
            className="flex-1 bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black text-xs font-bold px-6 py-3 rounded-xl transition-colors border border-[#C8A96B]/30 flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رابط</span>
          </button>
        </div>

        {/* Images Preview Grid */}
        {imageUrls.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
            {imageUrls.map((url, idx) => (
              <ProductImagePreviewItem
                key={`${url}-${idx}`}
                url={url}
                index={idx}
                isCover={idx === 0}
                onSetCover={handleSetCoverImage}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-red-200 rounded-2xl bg-red-50/50">
            <p className="text-xs text-red-500 font-bold">لم تتم إضافة أي صورة حتى الآن! يرجى رفع صورة أو وضع رابط.</p>
          </div>
        )}
      </div>

      {/* Product Variants (الخيارات: ألوان / أحجام) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
          <h3 className="font-bold text-base text-[#171717]">
            خيارات المنتج (Product Variants)
          </h3>
          <button
            type="button"
            onClick={handleAddVariant}
            className="text-xs text-[#C8A96B] font-bold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة خيار جديد</span>
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD3]"
            >
              <div className="w-full sm:w-1/4">
                <input
                  type="text"
                  value={v.name}
                  onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                  placeholder="النوع (اللون / الحجم)"
                  className="w-full bg-white border border-[#E8DFD3] rounded-xl px-3 py-2 text-xs text-[#171717]"
                />
              </div>

              <div className="w-full sm:w-1/3">
                <input
                  type="text"
                  value={v.optionValue}
                  onChange={(e) => handleVariantChange(idx, "optionValue", e.target.value)}
                  placeholder="القيمة (ذهبي شامبين / أسود)"
                  className="w-full bg-white border border-[#E8DFD3] rounded-xl px-3 py-2 text-xs text-[#171717]"
                />
              </div>

              <div className="w-full sm:w-1/4">
                <input
                  type="number"
                  value={v.priceAdjustment}
                  onChange={(e) =>
                    handleVariantChange(idx, "priceAdjustment", parseFloat(e.target.value) || 0)
                  }
                  placeholder="فارق السعر (+/-)"
                  className="w-full bg-white border border-[#E8DFD3] rounded-xl px-3 py-2 text-xs text-[#171717]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveVariant(idx)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Controls */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-sm py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#C8A96B]/50 shadow-gold-glow disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>{isEditing ? "حفظ وتحديث بيانات المنتج" : "نشر المنتج الجديد في المتجر"}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-4 rounded-2xl bg-white border border-[#E8DFD3] text-xs font-bold text-[#171717] hover:bg-gray-50"
        >
          إلغاء
        </button>
      </div>

    </form>
  );
}
