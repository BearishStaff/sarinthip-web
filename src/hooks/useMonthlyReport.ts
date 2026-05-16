import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { thaiMonths } from "../lib/utils";
import { getExpensesByCategoryInRange, getExpenseSummaryByCategory } from "../services/expenseService";
import { exportToPDF, DetailedExpenseItem } from "../lib/pdfExport";
import { ReportItem } from "../lib/calculations";

export function useMonthlyReport(branchId: string) {

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { data: summaryByCategoryReportData, isLoading: isReportLoading, isError: isReportError } = useQuery<ReportItem[]>({
    queryKey: ['report', branchId, month, year],
    queryFn: async () => {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

      const { data, error } = await getExpenseSummaryByCategory(
        branchId,
        startDate,
        endDate
      );

      if (error) throw error;

      // Flatten bills → expenses and group by category
      const report = (data as any[]).reduce((acc: Record<string, ReportItem>, bill: any) => {
        (bill.expenses || []).forEach((curr: any) => {
          const catName = curr.categories?.name || 'อื่นๆ / ยังไม่ระบุ';
          const catId = curr.category_id || 'uncategorized';

          if (!acc[catId]) {
            acc[catId] = { categoryId: catId, name: catName, total: 0 };
          }
          acc[catId].total += curr.total_amount;
        });
        return acc;
      }, {});

      return Object.values(report);
    }
  });

  const getExpenseByCategory = async (categoryId: string) => {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

    const { data, error } = await getExpensesByCategoryInRange(
      branchId,
      categoryId,
      startDate,
      endDate
    );

    if (error) throw error;

    // Flatten bills → expenses; billing_date comes from the parent bill
    const formattedData = (data as any[]).flatMap((bill: any) =>
      (bill.expenses || []).map((exp: any) => ({
        id: exp.id,
        item_name: exp.item_name,
        qty: exp.qty,
        unit: exp.unit,
        price_per_unit: exp.price_per_unit,
        total_amount: exp.total_amount,
        entry_date: exp.entry_date,
        billing_date: bill.billing_date,
        category_name: exp.categories?.name || 'อื่นๆ / ยังไม่ระบุ',
      }))
    );

    const categoryTotal = formattedData.reduce(
      (sum, exp) => sum + Number(exp.total_amount), 0
    );

    return {
      expenses: formattedData,
      categoryTotal,
    };
  };


  const grandTotal =
    summaryByCategoryReportData?.reduce((sum, item) => sum + (item.total as number), 0) || 0;


  const generateExpensePDF = async (
    categoryId: string
  ) => {
    try {
      const res = await getExpenseByCategory(categoryId);
      const categoryName = res.expenses[0]?.category_name || 'อื่นๆ / ยังไม่ระบุ';

      // Transform expense data to ReportItem format for the PDF
      const reportItems: ReportItem[] = [{
        categoryId: categoryId,
        name: categoryName,
        total: res.categoryTotal
      }];

      // Transform individual expense records to DetailedExpenseItem format
      const detailedExpenses: DetailedExpenseItem[] = res.expenses.map(exp => ({
        id: exp.id,
        item_name: exp.item_name,
        qty: exp.qty,
        unit: exp.unit,
        price_per_unit: exp.price_per_unit,
        total_amount: exp.total_amount,
        entry_date: exp.entry_date,
        billing_date: exp.billing_date,
        category_name: exp.category_name
      }));

      const branchName = "Srinathip 1"; // You can pass the real branch name here
      const monthName = thaiMonths[month - 1];
      const monthYearString = `${monthName} ${year}`;

      await exportToPDF({
        title: `ใบรับรองแทนใบเสร็จ-${categoryName}-${monthName}-${year}`,
        branchName: branchName,
        month: monthYearString,
        reportItems: reportItems,
        totalExpenses: res.categoryTotal,
        detailedExpenses: detailedExpenses, // Pass individual expense records
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('ไม่สามารถสร้าง PDF ได้: ' + (error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'));
      throw error;
    }
  };

  return {
    // For UI
    month,
    setMonth,
    year,
    setYear,

    reportData: summaryByCategoryReportData,
    isReportLoading,
    isReportError,
    grandTotal,
    generateExpensePDF,
  };
}
