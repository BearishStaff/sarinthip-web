"use client";

import { useQuery } from '@tanstack/react-query';
import { getIncomeByBranchAndDateRange } from '../services/incomeService';

export function useIncome(branchId: string, month: number, year: number) {
  return useQuery({
    queryKey: ['income', branchId, month, year],
    queryFn: async () => {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

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
