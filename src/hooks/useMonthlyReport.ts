import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { ReportItem } from "../lib/exportUtils";

export function useMonthlyReport(branchId: string, month: number, year: number) {
  return useQuery<ReportItem[]>({
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
      const report = data.reduce((acc: any, curr: any) => {
        const catName = curr.categories?.name || 'อื่นๆ / ยังไม่ระบุ';
        if (!acc[catName]) acc[catName] = 0;
        acc[catName] += curr.total_amount;
        return acc;
      }, {});

      return Object.entries(report).map(([name, total]) => ({ name, total: total as number}));
    }
  });
}