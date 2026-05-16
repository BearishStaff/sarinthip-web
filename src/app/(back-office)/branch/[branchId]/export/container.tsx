"use client";

import { useMonthlyReport } from "@/src/hooks/useMonthlyReport";
import { thaiMonths } from "@/src/lib/utils";
import { FileText, Download, Share2, ArrowLeft, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

type Props = {
  branchId: string;
  branchName: string;
};

function isLineApp() {
  return /Line/i.test(navigator.userAgent);
}

export default function ExportReportContainer({ branchId, branchName }: Readonly<Props>) {
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

  const handleDownloadByCategory = (categoryId: string) => {
    if (actionsDisabled) return;
    if (isLineApp()) {
      // Show instruction to open in external browser
      alert(
        'Please tap the "..." menu and select "Open in Browser" to download the PDF',
      );
      // Or redirect to open in external browser
      globalThis.location.href =
        "intent://your-app-url#Intent;scheme=https;end";
    } else {
      generateExpensePDF(categoryId, branchName);
    }
  };

  return (
    <div
      className={`min-h-screen ${appColorClasses.textPrimary} ${appColorClasses.pageBg} p-4 md:p-8`}
    >
      <div className="max-w-md mx-auto">
        <h1
          className={`text-2xl font-black mb-6 flex items-center gap-2 ${appColorClasses.textPrimary}`}
        >
          <button
            onClick={() => router.back()}
            className={`p-2 mr-2 rounded-full transition-colors hover:bg-surface border ${appColorClasses.borderSoft}`}
          >
            <ArrowLeft className={`w-6 h-6 ${appColorClasses.textSecondary}`} />
          </button>
          <FileText className={`w-6 h-6 ${intentColorClasses.brand.text}`} />
          สรุปรายงานประจำเดือน
        </h1>

        <div
          className={`${appColorClasses.cardBg} rounded-3xl p-6 shadow-sm border ${appColorClasses.borderSoft} mb-6`}
        >
          <div
            className={`grid grid-cols-2 gap-4 pb-6 border-b border-dashed ${appColorClasses.borderSoft}`}
          >
            <div className="space-y-2">
              <label
                htmlFor="export-report-month"
                className={`text-[10px] font-black ${appColorClasses.textMuted} uppercase tracking-widest ml-1`}
              >
                เดือน
              </label>
              <select
                id="export-report-month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                disabled={isReportLoading}
                className={`w-full p-4 bg-surface rounded-2xl border ${appColorClasses.borderSubtle} focus:ring-2 focus:ring-brand-500 text-sm font-bold appearance-none disabled:opacity-60`}
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
                className={`text-[10px] font-black ${appColorClasses.textMuted} uppercase tracking-widest ml-1`}
              >
                ปี (ค.ศ.)
              </label>
              <select
                id="export-report-year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                disabled={isReportLoading}
                className={`w-full p-4 bg-surface rounded-2xl border ${appColorClasses.borderSubtle} focus:ring-2 focus:ring-brand-500 text-sm font-bold appearance-none disabled:opacity-60`}
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
            <p
              className={`text-sm font-bold ${intentColorClasses.danger.text} mb-4`}
            >
              โหลดรายงานไม่สำเร็จ ลองใหม่อีกครั้ง
            </p>
          )}

          <div
            className={`text-center pb-6 border-b border-dashed ${appColorClasses.borderSoft}`}
          >
            <p
              className={`text-sm font-bold ${appColorClasses.textMuted} uppercase`}
            >
              ยอดใช้จ่ายรวม {thaiMonths[month - 1]} {year}
            </p>
            <h2
              className={`text-4xl font-black ${appColorClasses.textPrimary} mt-1 flex items-center justify-center gap-2 min-h-10`}
            >
              {isReportLoading ? (
                <Loader2
                  className={`w-10 h-10 animate-spin ${appColorClasses.textMuted}`}
                />
              ) : (
                <>฿{grandTotal.toLocaleString()}</>
              )}
            </h2>
          </div>

          <div className="py-6 space-y-4">
            <p
              className={`text-[10px] font-bold ${appColorClasses.textMuted} uppercase tracking-widest`}
            >
              แยกตามหมวดหมู่
            </p>
            {reportData?.map((item: any) => (
              <div
                key={item.categoryId}
                className="flex justify-between items-center gap-2"
              >
                <span
                  className={`${appColorClasses.textSecondary} font-medium truncate min-w-0`}
                >
                  {item.name}
                </span>
                <span
                  className={`font-bold ${appColorClasses.textPrimary} shrink-0`}
                >
                  ฿{item.total.toLocaleString()}
                </span>
                <button
                  type="button"
                  disabled={actionsDisabled}
                  onClick={() => handleDownloadByCategory(item.categoryId)}
                  className="h-12 w-12 shrink-0 bg-text-primary text-white rounded-2xl font-bold flex items-center justify-center active:scale-95 transition-all hover:bg-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
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
        </div>
      </div>
    </div>
  );
}
