"use client";

import { useQuery } from '@tanstack/react-query';
import {
  getBillDetail,
  getBillsWithExpensesByBranchAndDateRange,
} from "@/src/repository/billRepository";
import { removeExpense } from "@/src/repository/expenseRepository";

export function useExpense(branchId: string, month: number, year: number) {
  return useQuery({
    queryKey: ['expenses', branchId, month, year],
    queryFn: async () => {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

      // We fetch bills and join the categories into the expenses
      const { data, error } = await getBillsWithExpensesByBranchAndDateRange(
        branchId,
        startDate,
        endDate
      );

      if (error) throw error;

      // Transform the data to be easy to use in your UI
      const formattedBills = data.map(bill => ({
        ...bill,
        // Map category name to a flatter structure
        expenses: bill.expenses.map((exp: any) => ({
          ...exp,
          category_name: exp.categories?.name || 'Uncategorized'
        })),
        bill_total: bill.expenses.reduce((sum: number, e: any) => sum + Number(e.total_amount), 0)
      }));

      const grandTotal = formattedBills.reduce((sum, b) => sum + b.bill_total, 0);

      return {
        bills: formattedBills,
        grandTotal,
        // Helpful if you want a simple list of all items across all bills
        allExpenses: formattedBills.flatMap(b => b.expenses)
      };
    },
    enabled: !!branchId,
  });
}

export function useBillDetail(billId: string) {
  return useQuery({
    queryKey: ['bill-detail', billId],
    queryFn: async () => {
      const { data, error } = await getBillDetail(billId);

      if (error) throw error;
      return data;
    },
    enabled: !!billId,
  });
}

export async function deleteExpense(id: number) { // Add branchId here
  try {
    const { error } = await removeExpense(id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}