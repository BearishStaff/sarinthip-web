"use client";

import { useQuery } from '@tanstack/react-query';
import { getIncomeByBranchAndDateRange } from '../services/incomeService';

export function useIncome(branchId: string, month: number, year: number) {
  return useQuery({
    queryKey: ['income', branchId, month, year],
    queryFn: async () => {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`;

      const { data, error } = await getIncomeByBranchAndDateRange(
        branchId,
        startDate,
        endDate
      );

      if (error) throw error;

      const monthlyGrossTotal = data.reduce((sum, item) => sum + Number(item.amount), 0);
      const monthlyGpDeduction = data.reduce((sum, item) => {
        return sum + Number(item.amount) * Number(item.gp_rate ?? 0);
      }, 0);
      const monthlyNetTotal = monthlyGrossTotal - monthlyGpDeduction;

      return {
        incomeRecords: data,
        monthlyGrossTotal,
        monthlyGpDeduction,
        monthlyNetTotal,
        monthlyTotal: monthlyNetTotal,
      };
    },
    enabled: !!branchId,
  });
}
