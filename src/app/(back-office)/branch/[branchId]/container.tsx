"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PlusCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Zap,
  Plus,
  Tag,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useExpense } from "@/src/hooks/useExpense";
import { useIncome } from "@/src/hooks/useIncome";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";
import { thaiMonths } from "@/src/lib/utils";

type Props = {
  branchName?: string;
  branchId: string;
};

export default function BranchDashboardContainer({
  branchName = "ศรีนทิพย์ 1",
  branchId,
}: Readonly<Props>) {
  const router = useRouter();

  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');

  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => y - 10 + i);
  }, []);

  const { data: expenseData, isLoading, isError } = useExpense(
    branchId,
    month,
    year,
  );

  const { data: incomeData, isLoading: isIncomeLoading } = useIncome(
    branchId,
    month,
    year,
  );

  // Use the grandTotal from our hook, or fallback to 0 while loading
  const monthlyExpenseTotal = expenseData?.grandTotal ?? 0;
  const monthlyIncomeTotal = incomeData?.monthlyTotal ?? 0;
  const profitLoss = monthlyIncomeTotal - monthlyExpenseTotal;
  
  // Combined loading state
  const isAnyLoading = isLoading || isIncomeLoading;

  function onSelectBill(billId: string) {
    router.push(`/branch/${branchId}/bill/${billId}`);
  }

  return (
    <div className={`min-h-screen ${appColorClasses.pageBg} flex flex-col items-center p-4 md:p-6 font-sans`}>
      {/* Header Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/")}
          className={`p-2 rounded-full transition-colors hover:bg-surface border ${appColorClasses.borderSoft}`}
        >
          <ArrowLeft className={`w-6 h-6 ${appColorClasses.textSecondary}`} />
        </button>
        <h1 className={`text-xl font-bold ${appColorClasses.textPrimary}`}>{branchName}</h1>
        <div className="w-10"></div>
      </div>

      {/* Monthly Summary Card */}
      <div className={`w-full max-w-md ${appColorClasses.cardBg} rounded-3xl p-6 shadow-sm border ${appColorClasses.borderSoft} mb-8`}>
        <div className={`grid grid-cols-2 gap-4 mb-4 ${appColorClasses.textPrimary}`}>
          <div className="space-y-2">
            <label
              htmlFor="branch-dashboard-month"
              className={`text-[10px] font-black ${appColorClasses.textMuted} uppercase tracking-widest ml-1`}
            >
              เดือน
            </label>
            <select
              id="branch-dashboard-month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              disabled={isAnyLoading}
              className={`w-full p-3 bg-surface rounded-2xl border ${appColorClasses.borderSubtle} focus:ring-2 focus:ring-brand-500 text-sm font-bold appearance-none disabled:opacity-60`}
            >
              {thaiMonths.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="branch-dashboard-year"
              className={`text-[10px] font-black ${appColorClasses.textMuted} uppercase tracking-widest ml-1`}
            >
              ปี (ค.ศ.)
            </label>
            <select
              id="branch-dashboard-year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={isAnyLoading}
              className={`w-full p-3 bg-surface rounded-2xl border ${appColorClasses.borderSubtle} focus:ring-2 focus:ring-brand-500 text-sm font-bold appearance-none disabled:opacity-60`}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expenses Row */}
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <p className={`text-sm font-medium ${appColorClasses.textSecondary} uppercase tracking-wider`}>
              รายจ่ายรวมเดือนนี้
            </p>
            <h3 className={`text-2xl font-black ${appColorClasses.textPrimary} min-h-8 flex items-center`}>
              {isAnyLoading ? (
                <Loader2 className={`w-6 h-6 animate-spin ${appColorClasses.textMuted}`} />
              ) : (
                `฿${monthlyExpenseTotal.toLocaleString()}`
              )}
            </h3>
          </div>
          <div className={`${intentColorClasses.danger.bg} p-2 rounded-xl`}>
            <TrendingDown className={`w-5 h-5 ${intentColorClasses.danger.text}`} />
          </div>
        </div>

        {/* Income Row */}
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <p className={`text-sm font-medium ${appColorClasses.textSecondary} uppercase tracking-wider`}>
              รายรับรวมเดือนนี้
            </p>
            <h3 className={`text-2xl font-black ${appColorClasses.textPrimary} min-h-8 flex items-center`}>
              {isAnyLoading ? (
                <Loader2 className={`w-6 h-6 animate-spin ${appColorClasses.textMuted}`} />
              ) : (
                `฿${monthlyIncomeTotal.toLocaleString()}`
              )}
            </h3>
          </div>
          <div className={`${intentColorClasses.success.bg} p-2 rounded-xl`}>
            <TrendingUp className={`w-5 h-5 ${intentColorClasses.success.text}`} />
          </div>
        </div>

        {/* Profit/Loss Row */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className={`text-sm font-medium ${appColorClasses.textSecondary} uppercase tracking-wider`}>
              กำไร/ขาดทุน
            </p>
            <h3 className={`text-2xl font-black min-h-8 flex items-center ${
              profitLoss > 0 ? intentColorClasses.success.text : 
              profitLoss < 0 ? intentColorClasses.danger.text : 
              appColorClasses.textMuted
            }`}>
              {isAnyLoading ? (
                <Loader2 className={`w-6 h-6 animate-spin ${appColorClasses.textMuted}`} />
              ) : (
                `${profitLoss >= 0 ? '+' : ''}฿${profitLoss.toLocaleString()}`
              )}
            </h3>
          </div>
          <div className={`p-2 rounded-xl ${
            profitLoss > 0 ? intentColorClasses.success.bg : 
            profitLoss < 0 ? intentColorClasses.danger.bg : 
            appColorClasses.borderSoft
          }`}>
            {profitLoss > 0 ? (
              <TrendingUp className={`w-5 h-5 ${intentColorClasses.success.text}`} />
            ) : profitLoss < 0 ? (
              <TrendingDown className={`w-5 h-5 ${intentColorClasses.danger.text}`} />
            ) : (
              <div className={`w-5 h-5 ${appColorClasses.textMuted}`} />
            )}
          </div>
        </div>

        {isError && (
          <p className={`text-sm font-bold ${intentColorClasses.danger.text} mb-3`}>
            โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง
          </p>
        )}

        <div className={`flex items-center text-sm ${appColorClasses.textSecondary} bg-surface p-3 rounded-2xl`}>
          <Calendar className={`w-4 h-4 mr-2 ${intentColorClasses.brand.textStrong} shrink-0`} />
          <span>
            ประจำเดือน {thaiMonths[month - 1]} พ.ศ. {year + 543}
          </span>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="w-full max-w-md grid grid-cols-1 gap-4">
        <Link
          href={`/branch/${branchId}/entry`}
          className={`flex items-center justify-between bg-text-primary text-white p-5 rounded-2xl shadow-md hover:bg-foreground transition-all active:scale-95`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">บันทึกรายจ่าย</p>
              <p className="text-gray-300 text-xs">
                ก๊อปวางข้อความ หรือกรอกฟอร์ม
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </Link>

        <Link
          href={`/branch/${branchId}/income`}
          className={`flex items-center justify-between ${intentColorClasses.success.bg} ${intentColorClasses.success.text} p-5 rounded-2xl shadow-md hover:bg-green-600 hover:text-white transition-all active:scale-95`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">บันทึกรายรับ</p>
              <p className="text-xs">
                บันทึกรายรับเข้าสาขา
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Link>

        <Link
          href={`/branch/${branchId}/export`}
          className={`flex items-center justify-between ${appColorClasses.cardBg} border ${appColorClasses.borderSoft} p-5 rounded-2xl hover:border-brand-400 transition-all active:scale-95 shadow-sm`}
        >
          <div className="flex items-center gap-4">
            <div className={`${intentColorClasses.brand.bg} p-3 rounded-xl`}>
              <FileText className={`w-6 h-6 ${intentColorClasses.brand.text}`} />
            </div>
            <div className="text-left">
              <p className={`font-bold text-lg ${appColorClasses.textPrimary}`}>
                ออกใบรับรอง (Export)
              </p>
              <p className={`${appColorClasses.textSecondary} text-xs`}>
                สรุปรายเดือนแยกตามหมวดหมู่
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${appColorClasses.textMuted}`} />
        </Link>

        <Link href="/categories">
          <div className="bg-linear-to-br from-brand-500 to-brand-600 p-6 rounded-3xl text-white shadow-lg shadow-brand-100 flex justify-between items-center group cursor-pointer">
            <div>
              <h3 className="text-lg font-black">สอนคำหลัก AI</h3>
              <p className="text-brand-100 text-xs">
                ตั้งค่าหมวดหมู่และ Keyword อัตโนมัติ
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity List with Tabs */}
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
                      <span className={`font-semibold ${appColorClasses.textPrimary} text-sm group-hover:text-green-700 transition-colors`}>
                        {income.source}
                      </span>
                      <span className={`text-[10px] ${appColorClasses.textMuted}`}>
                        {new Date(income.entry_date).toLocaleDateString("th-TH")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className={`font-bold text-green-700 block`}>
                        ฿{Number(income.amount).toLocaleString()}
                      </span>
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
    </div>
  );
}

export function CategoryEntryButton() {
  return (
    <Link href="/categories" className="block w-full">
      <div className="bg-white p-5 rounded-3xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center active:translate-y-1 active:shadow-none transition-all">
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 p-3 rounded-2xl">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            {/* Using text-gray-900 for maximum darkness */}
            <span className="text-lg font-black text-gray-900 leading-tight">
              จัดการหมวดหมู่
            </span>
            <span className="text-sm font-bold text-gray-600">
              สอนคำหลักให้ AI ช่วยคัดแยก
            </span>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-900" />
      </div>
    </Link>
  );
}