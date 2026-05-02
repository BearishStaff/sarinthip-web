"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PlusCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  Calendar,
  Zap,
  Plus,
  Tag,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useExpense } from "@/src/hooks/useExpense";
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

  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => y - 10 + i);
  }, []);

  const { data: expenseData, isLoading, isError } = useExpense(
    branchId,
    month,
    year,
  );

  // Use the grandTotal from our hook, or fallback to 0 while loading
  const monthlyTotal = expenseData?.grandTotal ?? 0;

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
              disabled={isLoading}
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
              disabled={isLoading}
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

        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className={`text-sm font-medium ${appColorClasses.textSecondary} uppercase tracking-wider`}>
              รายจ่ายรวมเดือนนี้
            </p>
            <h2 className={`text-3xl font-black ${appColorClasses.textPrimary} min-h-9 flex items-center`}>
              {isLoading ? (
                <Loader2 className={`w-8 h-8 animate-spin ${appColorClasses.textMuted}`} />
              ) : (
                `฿${monthlyTotal.toLocaleString()}`
              )}
            </h2>
          </div>
          <div className={`${intentColorClasses.success.bg} p-2 rounded-xl`}>
            <TrendingUp className={`w-5 h-5 ${intentColorClasses.success.text}`} />
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

      {/* Recent Activity List */}
      <div className="w-full max-w-md mt-10">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className={`text-sm font-bold ${appColorClasses.textMuted} uppercase`}>
            รายการล่าสุด
          </h3>
          {isLoading && (
            <span className={`text-xs ${appColorClasses.textMuted} animate-pulse`}>
              กำลังโหลด...
            </span>
          )}
        </div>

        <div className="space-y-3">
          {!isLoading && expenseData?.bills?.length === 0 && (
              <p className={`text-center text-sm ${appColorClasses.textSecondary} py-8 px-4 ${appColorClasses.cardBg} rounded-2xl border ${appColorClasses.borderSoft}`}>
                ไม่มีบิลในเดือนที่เลือก
              </p>
            )}
          {expenseData?.bills?.map((bill: any) => (
            <div
              key={bill.id}
              onClick={() => onSelectBill(bill.id)} // 👈 Updated routing
              className={`${appColorClasses.cardBg} p-4 rounded-2xl border ${appColorClasses.borderSoft} shadow-sm 
                 flex justify-between items-center cursor-pointer 
                 hover:bg-surface hover:border-brand-100 hover:shadow-md 
                 active:scale-[0.98] transition-all group`}
            >
              <div className="flex gap-3 items-center">
                {/* Added group-hover to the icon background for extra polish */}
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
                {/* Optional: Add a small chevron to signal clickability */}
                <ChevronRight className={`w-4 h-4 ${appColorClasses.textMuted} group-hover:text-brand-400 transition-colors`} />
              </div>
            </div>
          ))}
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