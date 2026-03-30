import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { exportToPDF, ReportItem } from "../lib/exportUtils";
import { useState } from "react";

export function useMonthlyReport(branchId: string) {

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { data: summaryByCategoryReportData, isLoading: isReportLoading, isError: isReportError } = useQuery<ReportItem[]>({
    queryKey: ['report', branchId, month, year],
    queryFn: async () => {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('expenses')
        .select(`
          total_amount,
          category_id,
          categories (name),
          bills!inner (branch_id, billing_date)
        `)
        .eq('bills.branch_id', branchId)
        .gte('bills.billing_date', startDate)
        .lte('bills.billing_date', endDate);

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

    const { data, error } = await supabase
      .from('expenses')
      .select(`
      id,
      item_name,
      qty,
      unit,
      price_per_unit,
      total_amount,
      entry_date,
      category_id,
      bills!inner (
        id,
        billing_date,
        branch_id
      ),
      categories (name)
    `)
      .eq('bills.branch_id', branchId)
      .eq('category_id', categoryId)
      .gte('bills.billing_date', startDate)
      .lte('bills.billing_date', endDate)
      .order('entry_date', { ascending: true });

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


  const generateExpensePDF = (
    categoryId: string
  ) => {

    console.log("getExpenseData: ", getExpenseByCategory(categoryId))

    const branchName = "Srinathip 1"; // You can pass the real branch name here

    const branchData = [
      { date: "26/03/2026", item: 'เนื้อสับ', amount: '150' },
      { date: "26/03/2026", item: 'ลูกชิ้นเนื้อ', amount: '200' },
      { date: "27/03/2026", item: 'ลูกชิ้นเนื้อ', amount: '200' },
      { date: "28/03/2026", item: 'ลูกชิ้นเนื้อ', amount: '200' },
      { date: "", item: 'รวม', amount: '750' },
    ];

    const branchColumns = [
      { header: 'วันที่', dataKey: 'date' },
      { header: 'รายการ', dataKey: 'item' },
      { header: 'ราคา (บาท)', dataKey: 'amount' },
    ];

    // exportToPDF({
    //   title: 'ใบรับรองแทนใบเสร็จ',
    //   description: `สาขา ${branchName} - รายงานค่าใช้จ่ายประจำเดือน ${monthYear} - ยอดรวม ${grandTotal} บาท`,
    //   columns: branchColumns,
    //   data: branchData
    // });
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
