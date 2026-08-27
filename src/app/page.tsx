import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CuratedReviews from "@/components/home/CuratedReviews";
import AboutSection from "@/components/home/AboutSection";

export const revalidate = 0; // Dynamic server rendering for live updates

export default async function HomePage() {
  // Fetch data in parallel for optimal speed
  const [banners, categories, products, reviews, settings] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { status: "ACTIVE" } } },
        },
      },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
      },
    }),
    prisma.review.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.setting.findMany(),
  ]);

  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0E8]">
      <Header />
      
      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <HeroBanner banners={banners as any} />

        {/* Categories Grid */}
        <CategoriesSection categories={categories as any} />

        {/* Featured, Best Sellers, New Arrivals, and Offers */}
        <FeaturedProducts products={products as any} />

        {/* Luxury About Story */}
        <AboutSection
          title={settingsMap["about_title"]}
          text={settingsMap["about_text"]}
          image={settingsMap["about_image"]}
        />

        {/* Curated Customer Testimonials */}
        <CuratedReviews reviews={reviews as any} />
      </main>

      <Footer />
    </div>
  );
}
