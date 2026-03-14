"use client";

import { supabase } from "@/src/lib/supabase";
import { useQuery } from '@tanstack/react-query';

export function useExpense(branchId: string) {
  return useQuery({
    queryKey: ['expenses', branchId],
    queryFn: async () => {
      // We fetch bills and join the categories into the expenses
      const { data, error } = await supabase
        .from('bills')
        .select(`
          id,
          billing_date,
          is_smart_input,
          expenses (
            id,
            item_name,
            qty,
            unit,
            price_per_unit,
            total_amount,
            entry_date,
            categories (
              name
            )
          )
        `)
        .eq('branch_id', branchId)
        .order('billing_date', { ascending: false });

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
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          branches (name),
          expenses (
            id,
            item_name,
            qty,
            unit,
            price_per_unit,
            total_amount,
            category_id,
            categories (name)
          )
        `)
        .eq('id', billId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!billId,
  });
}