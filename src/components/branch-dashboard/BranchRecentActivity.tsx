"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FileText, ChevronRight, TrendingUp, Zap } from "lucide-react";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

type BranchRecentActivityProps = {
  branchId: string;
  activeTab: 'expenses' | 'income';
  setActiveTab: (tab: 'expenses' | 'income') => void;
  isLoading: boolean;
  isIncomeLoading: boolean;
  expenseData: any;
  incomeData: any;
  onSelectBill: (billId: string) => void;
};

export function BranchRecentActivity({
  branchId,
  activeTab,
  setActiveTab,
  isLoading,
  isIncomeLoading,
  expenseData,
  incomeData,
  onSelectBill,
}: BranchRecentActivityProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-md mt-10">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 px-2">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'expenses'
              ? `${intentColorClasses.brand.bg} ${intentColorClasses.brand.text}`
              : `${appColorClasses.cardBg} ${appColorClasses.textSecondary} border ${appColorClasses.borderSoft}`
          }`}
        >
          รายจ่าย
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'income'
              ? `${intentColorClasses.success.bg} ${intentColorClasses.success.text}`
              : `${appColorClasses.cardBg} ${appColorClasses.textSecondary} border ${appColorClasses.borderSoft}`
          }`}
        >
          รายรับ
        </button>
        <div className="flex-1"></div>
        {(isLoading || isIncomeLoading) && (
          <span className={`text-xs ${appColorClasses.textMuted} animate-pulse self-center`}>
            กำลังโหลด...
          </span>
        )}
      </div>

      {/* Content based on active tab */}
      <div className="space-y-3">
        {activeTab === 'expenses' && (
          <>
            {!isLoading && expenseData?.bills?.length === 0 && (
              <p className={`text-center text-sm ${appColorClasses.textSecondary} py-8 px-4 ${appColorClasses.cardBg} rounded-2xl border ${appColorClasses.borderSoft}`}>
                ไม่มีบิลในเดือนที่เลือก
              </p>
            )}
            {expenseData?.bills?.map((bill: any) => (
              <div
                key={bill.id}
                onClick={() => onSelectBill(bill.id)}
                className={`${appColorClasses.cardBg} p-4 rounded-2xl border ${appColorClasses.borderSoft} shadow-sm 
                   flex justify-between items-center cursor-pointer 
                   hover:bg-surface hover:border-brand-100 hover:shadow-md 
                   active:scale-[0.98] transition-all group`}
              >
                <div className="flex gap-3 items-center">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      bill.is_smart_input
                        ? "bg-purple-50 group-hover:bg-purple-100"
                        : "bg-surface group-hover:bg-brand-50"
                    }`}
                  >
                    {bill.is_smart_input ? (
                      <Zap className="w-4 h-4 text-purple-500" />
                    ) : (
                      <FileText className={`w-4 h-4 ${appColorClasses.textMuted} group-hover:text-brand-500`} />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className={`font-semibold ${appColorClasses.textPrimary} text-sm group-hover:text-brand-600 transition-colors`}>
                      {bill.expenses[0]?.item_name || "ไม่มีรายการ"}
                      {bill.expenses.length > 1 &&
                        ` และอีก ${bill.expenses.length - 1} รายการ`}
                    </span>
                    <span className={`text-[10px] ${appColorClasses.textMuted}`}>
                      {new Date(bill.billing_date).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className={`font-bold ${appColorClasses.textPrimary} block`}>
                      ฿{bill.bill_total.toLocaleString()}
                    </span>
                    <span className={`text-[10px] ${appColorClasses.textMuted} uppercase tracking-tighter`}>
                      {bill.expenses.length} Items
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${appColorClasses.textMuted} group-hover:text-brand-400 transition-colors`} />
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'income' && (
          <>
            {!isIncomeLoading && incomeData?.incomeRecords?.length === 0 && (
              <p className={`text-center text-sm ${appColorClasses.textSecondary} py-8 px-4 ${appColorClasses.cardBg} rounded-2xl border ${appColorClasses.borderSoft}`}>
                ไม่มีรายรับในเดือนที่เลือก
              </p>
            )}
            {incomeData?.incomeRecords?.map((income: any) => (
              <div
                key={income.id}
                onClick={() => router.push(`/branch/${branchId}/income/${income.id}`)}
                className={`${appColorClasses.cardBg} p-4 rounded-2xl border ${appColorClasses.borderSoft} shadow-sm 
                   flex justify-between items-center cursor-pointer 
                   hover:bg-green-50 hover:border-green-200 hover:shadow-md 
                   active:scale-[0.98] transition-all group`}
              >
                <div className="flex gap-3 items-center">
                  <div className="bg-green-50 group-hover:bg-green-100 p-2 rounded-lg transition-colors">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold ${appColorClasses.textPrimary} text-sm group-hover:text-green-700 transition-colors`}>
                        {income.channel ?? income.source ?? '-'}
                      </span>
                      {Number(income.gp_rate) > 0 && (
                        <span className="text-[9px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                          GP {Number(income.gp_rate) * 100}%
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] ${appColorClasses.textMuted}`}>
                      {new Date(income.entry_date).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    {Number(income.gp_rate) > 0 ? (
                      <>
                        <span className={`font-bold text-green-700 block`}>
                          ฿{(Number(income.amount) * (1 - Number(income.gp_rate))).toLocaleString()}
                        </span>
                        <span className={`text-[10px] ${appColorClasses.textMuted} line-through`}>
                          ฿{Number(income.amount).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className={`font-bold text-green-700 block`}>
                        ฿{Number(income.amount).toLocaleString()}
                      </span>
                    )}
                    <span className={`text-[10px] ${appColorClasses.textMuted} uppercase tracking-tighter`}>
                      {income.note ? 'มีหมายเหตุ' : ''}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${appColorClasses.textMuted} group-hover:text-green-600 transition-colors`} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
