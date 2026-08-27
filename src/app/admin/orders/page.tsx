"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Eye, Loader2, Phone, MapPin, X, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    NEW: { label: "جديد", color: "bg-blue-50 text-blue-600 border-blue-200" },
    CONFIRMED: { label: "تم التأكيد", color: "bg-amber-50 text-amber-600 border-amber-200" },
    PROCESSING: { label: "جاري التجهيز", color: "bg-purple-50 text-purple-600 border-purple-200" },
    READY_FOR_DELIVERY: { label: "جاهز للتوصيل", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    DELIVERED: { label: "تم التوصيل", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    CANCELLED: { label: "ملغي", color: "bg-red-50 text-red-600 border-red-200" },
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
            إدارة ومتابعة الطلبات ({orders.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">
            سجل الطلبات الواردة وتحديث حالات التجهيز والتوصيل
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-4 py-2.5 text-xs font-bold text-[#171717] focus:outline-none cursor-pointer"
        >
          <option value="all">جميع الحالات</option>
          <option value="NEW">جديد</option>
          <option value="CONFIRMED">تم التأكيد</option>
          <option value="PROCESSING">جاري التجهيز</option>
          <option value="READY_FOR_DELIVERY">جاهز للتوصيل</option>
          <option value="DELIVERED">تم التوصيل</option>
          <option value="CANCELLED">ملغي</option>
        </select>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[#C8A96B] animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-[#E8DFD3] text-xs text-gray-500">
          لا توجد طلبات مسجلة ضمن هذه الحالة.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8DFD3] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F2] text-[#171717] font-bold border-b border-[#E8DFD3]">
                <tr>
                  <th className="p-4">رقم الطلب</th>
                  <th className="p-4">العميل / المدينة</th>
                  <th className="p-4">المبلغ الإجمالي</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD3]">
                {orders.map((ord) => {
                  const statusInfo = statusMap[ord.status] || { label: ord.status, color: "bg-gray-100 text-gray-700 border-gray-200" };
                  return (
                    <tr key={ord.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-4 font-bold text-[#171717]">
                        {ord.orderNumber}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#171717]">
                            {ord.customerName || "عميل عبر WhatsApp"}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {ord.customerCity || "اليمن"} {ord.customerPhone ? `• ${ord.customerPhone}` : ""}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-[#171717]">
                        {formatPrice(ord.totalAmount)}
                      </td>

                      <td className="p-4 text-gray-500">
                        {new Date(ord.createdAt).toLocaleDateString('ar-YE')}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={ord.status}
                            disabled={updatingId === ord.id}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${statusInfo.color}`}
                          >
                            <option value="NEW">جديد</option>
                            <option value="CONFIRMED">تم التأكيد</option>
                            <option value="PROCESSING">جاري التجهيز</option>
                            <option value="READY_FOR_DELIVERY">جاهز للتوصيل</option>
                            <option value="DELIVERED">تم التوصيل</option>
                            <option value="CANCELLED">ملغي</option>
                          </select>
                          {updatingId === ord.id && <Loader2 className="w-3 h-3 text-[#C8A96B] animate-spin" />}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-2 text-[#C8A96B] hover:bg-[#C8A96B]/15 rounded-lg transition-colors inline-flex items-center gap-1 font-bold text-xs"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFD3] z-10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
              <div>
                <h3 className="font-bold text-base text-[#171717]">
                  تفاصيل الطلب: {selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-gray-400">
                  {new Date(selectedOrder.createdAt).toLocaleString('ar-YE')}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD3] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">العميل:</span>
                <span className="font-bold text-[#171717]">{selectedOrder.customerName || "غير محدد"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الهاتف:</span>
                <span className="font-bold text-[#171717]">{selectedOrder.customerPhone || "عبر الواتساب"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المدينة / العنوان:</span>
                <span className="font-bold text-[#171717]">
                  {selectedOrder.customerCity || "اليمن"} {selectedOrder.customerAddress ? `- ${selectedOrder.customerAddress}` : ""}
                </span>
              </div>
              {selectedOrder.notes && (
                <div className="pt-2 border-t border-[#E8DFD3]">
                  <span className="text-gray-500 block mb-1">ملاحظات:</span>
                  <p className="text-[#171717] italic">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-[#171717]">عناصر الطلبية:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white border border-[#E8DFD3] rounded-xl text-xs"
                  >
                    <div>
                      <h5 className="font-bold text-[#171717]">{item.productName}</h5>
                      {item.variantInfo && (
                        <span className="text-[10px] text-[#C8A96B]">{item.variantInfo}</span>
                      )}
                      <span className="text-[10px] text-gray-400 block">الكمية: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-[#171717]">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-between">
              <span className="font-bold text-sm text-[#171717]">المبلغ الإجمالي:</span>
              <span className="font-bold text-lg text-[#171717]">{formatPrice(selectedOrder.totalAmount)}</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs py-3 rounded-xl transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
