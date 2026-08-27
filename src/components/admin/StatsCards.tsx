import React from "react";
import { DollarSign, ShoppingBag, Package, Layers, Users, Calendar, Eye, Activity } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    totalSales: number;
    totalOrders: number;
    newOrdersCount: number;
    totalProducts: number;
    totalCategories: number;
    visits?: {
      today: number;
      month: number;
      year: number;
      total: number;
    };
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const visits = stats.visits || { today: 0, month: 0, year: 0, total: 0 };

  const storeCards = [
    {
      title: "إجمالي المبيعات",
      value: formatPrice(stats.totalSales || 0),
      subtitle: "حجم الطلبيات المسجلة",
      icon: DollarSign,
      color: "text-[#C8A96B]",
      bg: "bg-[#171717]",
    },
    {
      title: "إجمالي الطلبات",
      value: (stats.totalOrders || 0).toString(),
      subtitle: stats.newOrdersCount > 0 ? `${stats.newOrdersCount} طلب جديد بحاجة للمتابعة` : "لا توجد طلبات معلقة",
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "المنتجات النشطة",
      value: (stats.totalProducts || 0).toString(),
      subtitle: "في المتجر حالياً",
      icon: Package,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "التصنيفات الرئيسية",
      value: (stats.totalCategories || 0).toString(),
      subtitle: "أقسام المتجر المتاحة",
      icon: Layers,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const visitCards = [
    {
      title: "الزيارات اليومية",
      value: (visits.today || 0).toLocaleString("ar-YE"),
      subtitle: "زيارات اليوم المسجلة",
      icon: Eye,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "الزيارات الشهرية",
      value: (visits.month || 0).toLocaleString("ar-YE"),
      subtitle: "خلال الشهر الحالي",
      icon: Calendar,
      color: "text-cyan-500",
      bg: "bg-cyan-50",
    },
    {
      title: "الزيارات السنوية",
      value: (visits.year || 0).toLocaleString("ar-YE"),
      subtitle: "خلال العام الحالي",
      icon: Activity,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      title: "إجمالي زيارات المتجر",
      value: (visits.total || 0).toLocaleString("ar-YE"),
      subtitle: "كافة الزيارات منذ البداية",
      icon: Users,
      color: "text-[#C8A96B]",
      bg: "bg-[#FAF7F2]",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Store & Orders Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {storeCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#E8DFD3] shadow-sm flex flex-col justify-between space-y-3 hover:border-[#C8A96B]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">{c.title}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg} ${c.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#171717]">{c.value}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{c.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visitor Traffic Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Users className="w-4 h-4 text-[#C8A96B]" />
          <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
            حركة الزوار وترافيك المتجر (Live Traffic)
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visitCards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#E8DFD3] shadow-sm flex flex-col justify-between space-y-3 hover:border-[#C8A96B]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">{c.title}</span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg} ${c.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#171717]">{c.value}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">{c.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
