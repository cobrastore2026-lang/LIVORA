import React from "react";
import Image from "next/image";
import { Star, Sparkles, Quote } from "lucide-react";
import { Review } from "@/types";

interface CuratedReviewsProps {
  reviews: Review[];
}

export default function CuratedReviews({ reviews }: CuratedReviewsProps) {
  const activeReviews = reviews && reviews.length > 0 ? reviews.filter((r) => r.isActive) : [];

  if (activeReviews.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-[#F6F0E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#C8A96B] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تجارب استثنائية وثقة غالية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#171717]">
            آراء مختارة
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 font-light">
            شهادات تعكس شغفنا بتقديم تجربة تسوق تفوق التوقعات لعميلاتنا في جميع محافظات اليمن.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-[#E8DFD3] hover:border-[#C8A96B] transition-all duration-300 hover:shadow-luxury-hover flex flex-col justify-between relative group"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-4 left-4 w-8 h-8 text-[#C8A96B]/15 group-hover:text-[#C8A96B]/30 transition-colors" />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "text-[#C8A96B] fill-[#C8A96B]" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm leading-relaxed text-[#171717]/85 italic mb-6">
                  &ldquo;{review.content}&rdquo;
                </p>
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#FAF7F2]">
                {review.avatarUrl ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C8A96B]/40 flex-shrink-0">
                    <Image
                      src={review.avatarUrl}
                      alt={review.authorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#171717] text-[#C8A96B] font-bold text-sm flex items-center justify-center flex-shrink-0 border border-[#C8A96B]/40">
                    {review.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-[#171717]">{review.authorName}</h4>
                  <span className="text-[10px] text-gray-400">عميلة ليفورا</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
