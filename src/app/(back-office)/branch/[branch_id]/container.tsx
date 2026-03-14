"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  PlusCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  Calendar,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useExpense } from "@/src/hooks/useExpense";

type Props = {
  branchName?: string;
  branchID: string;
};

export default function BranchDashboardContainer({
  branchName = "ศรีนทิพย์ 1",
  branchID,
}: Readonly<Props>) {
  const params = useParams();
  const router = useRouter();
  const branchId = params.id;

  // Fetch real data using the hook
  const { data: expenseData, isLoading } = useExpense(branchID);

  // Use the grandTotal from our hook, or fallback to 0 while loading
  const monthlyTotal = expenseData?.grandTotal ?? 0;
  
  function onSelectBill(billId: string) {
    router.push(`/branch/${branchId}/bill/${billId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-6 font-sans">
      {/* Header Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/")}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{branchName}</h1>
        <div className="w-10"></div>
      </div>

      {/* Monthly Summary Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              รายจ่ายรวมเดือนนี้
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {isLoading ? "..." : `฿${monthlyTotal.toLocaleString()}`}
            </h2>
          </div>
          <div className="bg-green-100 p-2 rounded-xl">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-2xl">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
          <span>ประจำเดือน มีนาคม 2569</span>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="w-full max-w-md grid grid-cols-1 gap-4">
        <Link
          href={`/branch/${branchId}/entry`}
          className="flex items-center justify-between bg-gray-900 text-white p-5 rounded-2xl shadow-lg hover:bg-black transition-all active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">บันทึกรายจ่าย</p>
              <p className="text-gray-400 text-xs">
                ก๊อปวางข้อความ หรือกรอกฟอร์ม
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </Link>

        <Link
          href={`/branch/${branchId}/export`}
          className="flex items-center justify-between bg-white border border-gray-200 p-5 rounded-2xl hover:border-blue-500 transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg text-gray-800">
                ออกใบรับรอง (Export)
              </p>
              <p className="text-gray-500 text-xs">
                สรุปรายเดือนแยกตามหมวดหมู่
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </Link>
      </div>

      {/* Recent Activity List */}
      <div className="w-full max-w-md mt-10">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase">
            รายการล่าสุด
          </h3>
          {isLoading && (
            <span className="text-xs text-gray-400 animate-pulse">
              กำลังโหลด...
            </span>
          )}
        </div>

        <div className="space-y-3">
          {expenseData?.bills?.map((bill) => (
            <div
              key={bill.id}
              onClick={() => onSelectBill(bill.id)} // 👈 Updated routing
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm 
                 flex justify-between items-center cursor-pointer 
                 hover:bg-gray-50 hover:border-blue-100 hover:shadow-md 
                 active:scale-[0.98] transition-all group"
            >
              <div className="flex gap-3 items-center">
                {/* Added group-hover to the icon background for extra polish */}
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    bill.is_smart_input
                      ? "bg-purple-50 group-hover:bg-purple-100"
                      : "bg-gray-50 group-hover:bg-blue-50"
                  }`}
                >
                  {bill.is_smart_input ? (
                    <Zap className="w-4 h-4 text-purple-500" />
                  ) : (
                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                    {bill.expenses[0]?.item_name || "ไม่มีรายการ"}
                    {bill.expenses.length > 1 &&
                      ` และอีก ${bill.expenses.length - 1} รายการ`}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(bill.billing_date).toLocaleDateString("th-TH")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="font-bold text-gray-900 block">
                    ฿{bill.bill_total.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                    {bill.expenses.length} Items
                  </span>
                </div>
                {/* Optional: Add a small chevron to signal clickability */}
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
