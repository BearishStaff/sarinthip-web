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
    .from("expenses")
    .select(`
      total_amount,
      category_id,
      categories (name)
    `)
    .eq("branch_id", branchId)
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("category_id", { ascending: true });
}

export async function getExpensesByCategoryInRange(
  branchId: string,
  categoryId: string,
  startDate: string,
  endDate: string
) {
  const query = supabase
    .from("expenses")
    .select(`
      id,
      item_name,
      qty,
      unit,
      price_per_unit,
      total_amount,
      entry_date,
      category_id,
      categories (name)
    `)
    .eq("branch_id", branchId)
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: true });

  if (categoryId === 'uncategorized') {
    return query.is("category_id", null);
  } else {
    return query.eq("category_id", categoryId);
  }
}
