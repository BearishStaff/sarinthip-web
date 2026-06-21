"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useExpense } from "@/src/hooks/useExpense";
import { useIncome } from "@/src/hooks/useIncome";
import { appColorClasses } from "@/src/lib/colors";
import { BranchDashboardSummary } from "@/src/components/branch-dashboard/BranchDashboardSummary";
import { BranchActionButtons } from "@/src/components/branch-dashboard/BranchActionButtons";
import { BranchRecentActivity } from "@/src/components/branch-dashboard/BranchRecentActivity";

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
  const monthlyGrossIncome = incomeData?.monthlyGrossTotal ?? 0;
  const monthlyGpDeduction = incomeData?.monthlyGpDeduction ?? 0;
  const monthlyNetIncome = incomeData?.monthlyNetTotal ?? 0;
  const profitLoss = monthlyNetIncome - monthlyExpenseTotal;
  
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

      <BranchDashboardSummary 
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        yearOptions={yearOptions}
        monthlyExpenseTotal={monthlyExpenseTotal}
        monthlyGrossIncome={monthlyGrossIncome}
        monthlyGpDeduction={monthlyGpDeduction}
        monthlyNetIncome={monthlyNetIncome}
        profitLoss={profitLoss}
        isAnyLoading={isAnyLoading}
        isError={isError}
      />

      <BranchActionButtons branchId={branchId} />

      <BranchRecentActivity 
        branchId={branchId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        isIncomeLoading={isIncomeLoading}
        expenseData={expenseData}
        incomeData={incomeData}
        onSelectBill={onSelectBill}
      />
    </div>
  );
}