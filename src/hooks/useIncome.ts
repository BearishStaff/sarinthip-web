"use client";

import { useQuery } from '@tanstack/react-query';
import { getIncomeByBranchAndDateRange } from '../services/incomeService';

export function useIncome(branchId: string, month: number, year: number) {
  return useQuery({
    queryKey: ['income', branchId, month, year],
    queryFn: async () => {
      // Create date strings directly to avoid timezone issues
      const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`;

      const { data, error } = await getIncomeByBranchAndDateRange(
        branchId,
        startDate,
        endDate
      );

      if (error) throw error;

      // Calculate monthly income total
      const monthlyTotal = data.reduce((sum, income) => sum + Number(income.amount), 0);

      return {
        incomeRecords: data,
        monthlyTotal,
      };
    },
    enabled: !!branchId,
  });
}
