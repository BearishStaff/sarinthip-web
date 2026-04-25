import { useQuery } from "@tanstack/react-query";
import { exportToPDF, ReportItem } from "../lib/exportUtils";
import { useState } from "react";
import { thaiMonths } from "../lib/utils";
import {
  getExpenseSummaryByCategory,
  getExpensesByCategoryInRange,
} from "../repository/expenseRepository";

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

      // Grouping logic
      const report = data.reduce((acc: Record<string, ReportItem>, curr: any) => {
        const catName = curr.categories?.name || 'อื่นๆ / ยังไม่ระบุ';
        const catId = curr.category_id || 'uncategorized';

        if (!acc[catId]) {
          acc[catId] = { categoryId: catId, name: catName, total: 0 };
        }
        acc[catId].total += curr.total_amount;
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

    const formattedData = data.map((exp: any) => ({
      id: exp.id,
      item_name: exp.item_name,
      qty: exp.qty,
      unit: exp.unit,
      price_per_unit: exp.price_per_unit,
      total_amount: exp.total_amount,
      entry_date: exp.entry_date,
      billing_date: exp.bills?.billing_date,
      category_name: exp.categories?.name || 'อื่นๆ / ยังไม่ระบุ',
    }));

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

    const res = await getExpenseByCategory(categoryId);
    const categoryName = res.expenses[0]?.category_name || 'อื่นๆ / ยังไม่ระบุ';

    const data = res.expenses.map((exp) => ({
      date: new Date(exp.entry_date).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      item: exp.item_name,
      qty: `${exp.qty} ${exp.unit}`,
      price_per_unit: exp.price_per_unit.toLocaleString(),
      total_amount: exp.total_amount.toLocaleString(),
    }));

    const totalAmount = data.reduce((sum, item) => sum + Number(item.total_amount.replaceAll(',', '')), 0);
    const report = [...data, { item: 'รวม', total_amount: totalAmount.toLocaleString() }];

    const branchName = "Srinathip 1"; // You can pass the real branch name here

    const branchColumns = [
      { header: 'วันที่', dataKey: 'date' },
      { header: 'รายการ', dataKey: 'item' },
      { header: 'จำนวน', dataKey: 'qty' },
      { header: 'ราคาต่อหน่วย(บาท)', dataKey: 'price_per_unit' },
      { header: 'ราคารวม(บาท)', dataKey: 'total_amount' },
    ];

    const monthName = thaiMonths[month - 1];

    exportToPDF({
      title: `ใบรับรองแทนใบเสร็จ-${categoryName}-${monthName}-${year}`,
      description: `สาขา ${branchName} - รายงานค่าใช้จ่ายประจำเดือน ${monthName} - ยอดรวม ${totalAmount} บาท`,
      columns: branchColumns,
      data: report,
      keepGroupTogetherBy: 'date',
    });
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
