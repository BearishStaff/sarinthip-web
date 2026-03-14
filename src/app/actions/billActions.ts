"use server";

import { supabase } from "@/src/lib/supabase";
import { myTextParser } from "@/src/lib/parser";

export async function createBillWithExpenses(branchId: string, rawText: string) {
  // 1. Parse the text
  const expenses = myTextParser(rawText);
  if (expenses.length === 0) {
    throw new Error("No valid items found in text.");
  }

  // 2. Start the "Transaction" (Insert Bill first)
  const { data: bill, error: billError } = await supabase
    .from('bills')
    .insert([{ branch_id: branchId }])
    .select()
    .single();

  if (billError) throw new Error("Failed to create bill: " + billError.message);

  // 3. Insert Expenses linked to that Bill ID
  const expensesToInsert = expenses.map(exp => ({
    bill_id: bill.id,
    item_name: exp.item_name,
    amount: exp.amount
  }));

  const { error: expError } = await supabase
    .from('expenses')
    .insert(expensesToInsert);

  if (expError) {
    // Note: In a real app, you'd want to delete the Bill if Expenses fail
    throw new Error("Failed to save expenses: " + expError.message);
  }

  return { success: true, count: expenses.length };
}