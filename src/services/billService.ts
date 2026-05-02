import { supabase } from "@/src/lib/supabase";

export async function createBill(data: {
  branch_id: string;
  is_smart_input: boolean;
  billing_date: string;
}) {
  return supabase.from("bills").insert([data]).select().single();
}

export async function removeBill(billId: string) {
  return supabase.from("bills").delete().eq("id", billId);
}

export async function getBillsWithExpensesByBranchAndDateRange(
  branchId: string,
  startDate: string,
  endDate: string
) {
  return supabase
    .from("bills")
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
    .eq("branch_id", branchId)
    .gte("billing_date", startDate)
    .lte("billing_date", endDate)
    .order("billing_date", { ascending: false });
}

export async function getBillDetail(billId: string) {
  return supabase
    .from("bills")
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
    .eq("id", billId)
    .single();
}
