import { supabase } from "@/src/lib/supabase";

export async function listBranches() {
  return supabase.from("branches").select("*").is("deleted_at", null).order("name", { ascending: true });
}

export async function getBranchById(branchId: string) {
  return supabase.from("branches").select("name").eq("id", branchId).single();
}

export async function createBranch(name: string) {
  return supabase.from("branches").insert([{ name }]).select();
}

export async function softDeleteBranch(branchId: string) {
  return supabase.from("branches").update({ deleted_at: new Date().toISOString() }).eq("id", branchId);
}

export async function cascadeDeleteBranchData(branchId: string) {
  // Delete all expenses for this branch
  const { error: expensesError } = await supabase.from("expenses").delete().eq("branch_id", branchId);
  if (expensesError) return { error: expensesError };

  // Delete all income for this branch
  const { error: incomeError } = await supabase.from("income").delete().eq("branch_id", branchId);
  if (incomeError) return { error: incomeError };

  // Delete all bills for this branch
  const { error: billsError } = await supabase.from("bills").delete().eq("branch_id", branchId);
  if (billsError) return { error: billsError };

  // Finally soft delete the branch
  return softDeleteBranch(branchId);
}

export async function checkBranchHasData(branchId: string) {
  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select("id")
    .eq("branch_id", branchId)
    .limit(1);

  if (expensesError) return { error: expensesError, hasData: false };

  const { data: income, error: incomeError } = await supabase
    .from("income")
    .select("id")
    .eq("branch_id", branchId)
    .limit(1);

  if (incomeError) return { error: incomeError, hasData: false };

  const { data: bills, error: billsError } = await supabase
    .from("bills")
    .select("id")
    .eq("branch_id", branchId)
    .limit(1);

  if (billsError) return { error: billsError, hasData: false };

  const hasData = (expenses && expenses.length > 0) || 
                  (income && income.length > 0) || 
                  (bills && bills.length > 0);

  return { hasData };
}
