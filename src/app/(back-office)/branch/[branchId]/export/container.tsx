"use client";

import { useMonthlyReport } from "@/src/hooks/useMonthlyReport";
import { thaiMonths } from "@/src/lib/utils";
import { FileText, Download, Share2, ArrowLeft, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

type Props = {
  branchId: string;
};

export default function ExportReportContainer({
  branchId,
}: Readonly<Props>) {
  const {
    reportData,
    generateExpensePDF,
    grandTotal,
    month,
    year,
    setMonth,
    setYear,
    isReportLoading,
    isReportError,
  } = useMonthlyReport(branchId);

  const router = useRouter();

  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => y - 10 + i);
  }, []);

  const actionsDisabled = isReportLoading;

  const handleDownload = () => {
    if (actionsDisabled) return;
    generateExpensePDF(branchId);
  };

  const handleDownloadByCategory = (categoryId: string) => {
    if (actionsDisabled) return;
    generateExpensePDF(categoryId);
  };

  const handleShare = async () => {
    if (actionsDisabled) return;
    const shareData = {
      title: `รายงานสรุปยอดจ่าย - ${branchId}`,
      text: `สรุปยอดรายจ่ายเดือน ${thaiMonths[month - 1]} ${year}: ฿${grandTotal.toLocaleString()}`,
      url: globalThis.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.text);
        alert("คัดลอกสรุปรายงานไปยัง Clipboard แล้ว!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-black mb-6 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 mr-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <FileText className="w-6 h-6 text-blue-600" />
          สรุปรายงานประจำเดือน
        </h1>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-dashed">
            <div className="space-y-2">
              <label
                htmlFor="export-report-month"
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
              >
                เดือน
              </label>
              <select
                id="export-report-month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                disabled={isReportLoading}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none disabled:opacity-60"
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
                htmlFor="export-report-year"
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
              >
                ปี (ค.ศ.)
              </label>
              <select
                id="export-report-year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                disabled={isReportLoading}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none disabled:opacity-60"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isReportError && (
            <p className="text-sm font-bold text-red-600 mb-4">
              โหลดรายงานไม่สำเร็จ ลองใหม่อีกครั้ง
            </p>
          )}

          <div className="text-center pb-6 border-b border-dashed">
            <p className="text-sm font-bold text-gray-400 uppercase">
              ยอดใช้จ่ายรวม {thaiMonths[month - 1]} {year}
            </p>
            <h2 className="text-4xl font-black text-gray-900 mt-1 flex items-center justify-center gap-2 min-h-10">
              {isReportLoading ? (
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
              ) : (
                <>฿{grandTotal.toLocaleString()}</>
              )}
            </h2>
          </div>

          <div className="py-6 space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              แยกตามหมวดหมู่
            </p>
            {reportData?.map((item: any) => (
              <div
                key={item.categoryId}
                className="flex justify-between items-center gap-2"
              >
                <span className="text-gray-600 font-medium truncate min-w-0">
                  {item.name}
                </span>
                <span className="font-bold text-gray-900 shrink-0">
                  ฿{item.total.toLocaleString()}
                </span>
                <button
                  type="button"
                  disabled={actionsDisabled}
                  onClick={() => handleDownloadByCategory(item.categoryId)}
                  className="h-12 w-12 shrink-0 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  aria-label={`ดาวน์โหลด PDF ${item.name}`}
                >
                  {isReportLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="button"
              disabled={actionsDisabled}
              onClick={handleDownload}
              className="w-full h-14 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isReportLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              ดาวน์โหลด PDF
            </button>
            <button
              type="button"
              disabled={actionsDisabled}
              onClick={handleShare}
              className="w-full h-14 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isReportLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
              แชร์รายงาน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
