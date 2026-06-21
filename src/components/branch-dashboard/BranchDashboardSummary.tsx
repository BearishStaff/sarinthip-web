"use client";

import React from "react";
import { TrendingUp, TrendingDown, Calendar, Loader2 } from "lucide-react";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";
import { thaiMonths } from "@/src/lib/utils";

type BranchDashboardSummaryProps = {
  month: number;
  setMonth: (month: number) => void;
  year: number;
  setYear: (year: number) => void;
  yearOptions: number[];
  monthlyExpenseTotal: number;
  monthlyGrossIncome: number;
  monthlyGpDeduction: number;
  monthlyNetIncome: number;
  profitLoss: number;
  isAnyLoading: boolean;
  isError: boolean;
};

export function BranchDashboardSummary({
  month,
  setMonth,
  year,
  setYear,
  yearOptions,
  monthlyExpenseTotal,
  monthlyGrossIncome,
  monthlyGpDeduction,
  monthlyNetIncome,
  profitLoss,
  isAnyLoading,
  isError,
}: BranchDashboardSummaryProps) {
  return (
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

      {/* Income Rows */}
      <div className="mb-3 space-y-2">
        {/* Gross income */}
        <div className="flex justify-between items-center">
          <p className={`text-sm font-medium ${appColorClasses.textSecondary} uppercase tracking-wider`}>
            รายรับรวม (Gross)
          </p>
          <span className={`text-lg font-bold ${appColorClasses.textPrimary}`}>
            {isAnyLoading ? (
              <Loader2 className={`w-5 h-5 animate-spin ${appColorClasses.textMuted}`} />
            ) : (
              `฿${monthlyGrossIncome.toLocaleString()}`
            )}
          </span>
        </div>
        {/* GP deduction — only shown when non-zero */}
        {(!isAnyLoading && monthlyGpDeduction > 0) && (
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">
              หัก GP
            </p>
            <span className="text-base font-semibold text-amber-600">
              −฿{monthlyGpDeduction.toLocaleString()}
            </span>
          </div>
        )}
        {/* Net income */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <p className={`text-sm font-medium ${appColorClasses.textSecondary} uppercase tracking-wider`}>
              รายรับสุทธิ (Net)
            </p>
            <h3 className={`text-2xl font-black ${intentColorClasses.success.text} min-h-8 flex items-center`}>
              {isAnyLoading ? (
                <Loader2 className={`w-6 h-6 animate-spin ${appColorClasses.textMuted}`} />
              ) : (
                `฿${monthlyNetIncome.toLocaleString()}`
              )}
            </h3>
          </div>
          <div className={`${intentColorClasses.success.bg} p-2 rounded-xl`}>
            <TrendingUp className={`w-5 h-5 ${intentColorClasses.success.text}`} />
          </div>
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
  );
}
