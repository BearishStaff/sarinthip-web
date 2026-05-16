import { supabase } from "@/src/lib/supabase";

export async function createExpenses(
  expenses: Array<{
    bill_id: string;
    item_name: string;
    qty: number;
    unit: string;
    price_per_unit: number;
    total_amount: number;
    entry_date: string;
    category_id?: number | null;
  }>
) {
  return supabase.from("expenses").insert(expenses);
}

export async function updateExpenseById(
  id: number,
  data: {
    item_name?: string;
    qty?: number;
    unit?: string;
    price_per_unit?: number;
    total_amount?: number;
    category_id?: number | null;
  }
) {
  return supabase.from("expenses").update(data).eq("id", id);
}

export async function removeExpense(id: number) {
  return supabase.from("expenses").delete().eq("id", id);
}

export async function getExpenseSummaryByCategory(
  branchId: string,
  startDate: string,
  endDate: string
) {
  return supabase
    .from("bills")
    .select(`
      expenses (
        total_amount,
        category_id,
        categories (name)
      )
    `)
    .eq("branch_id", branchId)
    .gte("billing_date", startDate)
    .lte("billing_date", endDate);
}

export async function getExpensesByCategoryInRange(
  branchId: string,
  categoryId: string,
  startDate: string,
  endDate: string
) {
  const baseQuery = supabase
    .from("bills")
    .select(`
      billing_date,
      expenses!inner (
        id,
        item_name,
        qty,
        unit,
        price_per_unit,
        total_amount,
        entry_date,
        category_id,
        categories (name)
      )
    `)
    .eq("branch_id", branchId)
    .gte("billing_date", startDate)
    .lte("billing_date", endDate)
    .order("billing_date", { ascending: true });

  if (categoryId === 'uncategorized') {
    return baseQuery.is("expenses.category_id", null);
  } else {
    return baseQuery.eq("expenses.category_id", categoryId);
  }
}
