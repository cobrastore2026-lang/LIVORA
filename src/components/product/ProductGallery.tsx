"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const imageList = images && images.length > 0 ? images : [
    { id: "def-img", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop", isCover: true, sortOrder: 0 }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = imageList[activeIndex] || imageList[0];

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      
      {/* Thumbnails Sidebar */}
      {imageList.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] pb-2 sm:pb-0 scrollbar-none">
          {imageList.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 sm:w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                activeIndex === idx ? "border-[#C8A96B] shadow-md scale-95" : "border-[#E8DFD3] hover:border-gray-400 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Active Image Display */}
      <div className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#E8DFD3] shadow-luxury">
        <Image
          src={activeImage.url}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

    </div>
  );
}
