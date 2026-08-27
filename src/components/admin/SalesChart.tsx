"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";

interface ChartPoint {
  name: string;
  sales: number;
  orders: number;
}

interface SalesChartProps {
  data: ChartPoint[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const maxSales = Math.max(...data.map((d) => d.sales), 10000);

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-[#171717]">مؤشرات المبيعات الأسبوعية</h3>
          <p className="text-xs text-gray-400 font-light">توزيع المبيعات التقديرية على مدار أيام الأسبوع</p>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="pt-4 grid grid-cols-7 gap-2 sm:gap-4 items-end h-56">
        {data.map((item, idx) => {
          const heightPercent = Math.max(12, Math.round((item.sales / maxSales) * 100));
          return (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
              
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-[#171717] text-[#C8A96B] px-2 py-1 rounded-md shadow-md text-center pointer-events-none whitespace-nowrap -mb-1 z-10">
                {formatPrice(item.sales)}
              </div>

              {/* Bar */}
              <div className="w-full max-w-[38px] bg-[#FAF7F2] rounded-t-xl overflow-hidden h-full flex items-end">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-[#171717] to-[#C8A96B] rounded-t-xl group-hover:brightness-110 transition-all duration-500"
                />
              </div>

              {/* Day Label */}
              <span className="text-xs font-semibold text-gray-500 group-hover:text-[#171717] transition-colors">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
