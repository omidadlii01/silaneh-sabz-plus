import React, { useState } from 'react';
import {
  ClipboardList,
  RotateCcw,
  History,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Package,
  Calendar,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, toPersianDigits } from '../utils';
import { Order } from '../types';

export const MyOrdersView: React.FC = () => {
  const { orders, currentCustomer, reorder, selectedOrder } = useApp();

  const customerOrders = orders.filter((o) => o.customerId === currentCustomer.id);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    selectedOrder ? selectedOrder.id : customerOrders[0]?.id || null
  );
  const mostRecentOrder = customerOrders[0];

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pb-20 pt-3 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* Quick repeat of the most recent order (moved here from Home) */}
      {mostRecentOrder && (
        <div className="bg-emerald-50 rounded-xl px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-800" />
            <span className="text-[11px] font-bold text-emerald-950">تکرار سفارش قبلی</span>
          </div>
          <button
            onClick={() => reorder(mostRecentOrder)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg active:scale-95 transition-all flex items-center gap-1"
          >
            <span>ثبت مجدد ({toPersianDigits(mostRecentOrder.items.length)} کالا)</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Title Header */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900">سوابق سفارش‌های عمده</h2>
        <p className="text-[11px] text-slate-500">
          لیست سفارشات ثبت شده برای {currentCustomer.storeName}
        </p>
      </div>

      {customerOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">هیچ سفارشی یافت نشد</h3>
          <p className="text-xs text-slate-400">تا کنون سفارشی از طرف حساب شما ثبت نشده است.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customerOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-emerald-600 shadow-md ring-1 ring-emerald-500/20'
                    : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Order Summary Header Card */}
                <div
                  onClick={() => toggleOrderExpand(order.id)}
                  className="p-3.5 cursor-pointer flex items-center justify-between bg-white select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {order.orderNumber}
                      </span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {order.orderDate}
                      </span>
                      <span>•</span>
                      <span>{toPersianDigits(order.items.length)} قلم کالا</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-left">
                    <div>
                      <span className="text-xs font-black text-emerald-800 block">
                        {formatCurrency(order.finalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {isExpanded ? 'بستن جزئیات' : 'مشاهده فاکتور'}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-3.5 space-y-3">
                    <div className="space-y-2">
                      <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-emerald-700" />
                        اقلام خریداری شده:
                      </span>

                      <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100 text-xs">
                        {order.items.map((item) => (
                          <div key={item.id} className="p-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-800 block">
                                {item.productName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                برند: {item.brand} | {toPersianDigits(item.cartonQuantity)} عدد در کارتن
                              </span>
                            </div>

                            <div className="text-left flex-none mr-2">
                              <span className="font-bold text-slate-900 block">
                                {toPersianDigits(item.quantity)} کارتن
                              </span>
                              <span className="text-[11px] text-emerald-800 font-bold">
                                {formatCurrency(item.totalPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer or Admin Notes */}
                    {order.customerNote && (
                      <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800 block mb-0.5">یادداشت شما:</span>
                        <p>{order.customerNote}</p>
                      </div>
                    )}

                    {order.adminNote && (
                      <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <span className="font-bold text-amber-950 block mb-0.5 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                          پاسخ انبار / واحد فروش:
                        </span>
                        <p>{order.adminNote}</p>
                      </div>
                    )}

                    {/* Action Reorder Button */}
                    <div className="pt-1 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        مبلغ تخفیف: <span className="font-bold">{formatCurrency(order.discount)}</span>
                      </div>

                      <button
                        onClick={() => reorder(order)}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>تکرار دقیق این سفارش</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
