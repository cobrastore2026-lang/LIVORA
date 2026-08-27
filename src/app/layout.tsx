import type { Metadata } from "next";
import { Tajawal, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartDrawer from "@/components/common/CartDrawer";
import SearchModal from "@/components/common/SearchModal";
import VisitorTracker from "@/components/common/VisitorTracker";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-luxury",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LIVORA | ليفورا - متجر الأناقة والجمال الفاخر للمرأة في اليمن",
  description: "اكتشفي أرقى الإكسسوارات، مستحضرات المكياج، ومنتجات العناية بالبشرة والحقائب الفاخرة مع خدمة طلب فورية وتوصيل لكافة المحافظات اليمنية عبر الواتساب.",
  keywords: ["LIVORA", "ليفورا", "متجر إلكتروني اليمن", "إكسسوارات نسائية", "مكياج يمن", "عناية بالبشرة", "حقائب سهرة", "منتجات جمال"],
  openGraph: {
    title: "LIVORA | ليفورا - فخامة تليق بكِ",
    description: "الوجهة الأولى للمرأة الأنيقة في اليمن - إكسسوارات ومكياج وعناية فاخرة.",
    locale: "ar_YE",
    type: "website",
    siteName: "LIVORA",
  },
  icons: {
    icon: "/images/livora-logo.jpg",
    apple: "/images/livora-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cinzel.variable} ${cormorant.variable}`}>
      <body className={`${tajawal.className} min-h-screen flex flex-col bg-[#F6F0E8] text-[#171717] antialiased selection:bg-[#C8A96B] selection:text-black font-sans`}>
        <VisitorTracker />
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartDrawer />
            <SearchModal />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
