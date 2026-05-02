import { supabase } from "@/src/lib/supabase";

export async function createIncome(data: {
  branch_id: string;
  entry_date: string;
  amount: number;
  source: string;
  note?: string;
}) {
  return supabase.from("income").insert([data]).select().single();
}

export async function getIncomeByBranchAndDateRange(
  branchId: string,
  startDate: string,
  endDate: string
) {
  return supabase
    .from("income")
    .select("*")
    .eq("branch_id", branchId)
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: true });
}

export async function updateIncomeById(
  id: number,
  data: {
    entry_date?: string;
    amount?: number;
    source?: string;
    note?: string;
  }
) {
  return supabase.from("income").update(data).eq("id", id);
}

export async function removeIncome(id: number) {
  return supabase.from("income").delete().eq("id", id);
}
