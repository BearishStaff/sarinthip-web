"use server";

import { supabase } from "@/src/lib/supabase";
import { myTextParser } from "@/src/lib/parser";
import { revalidatePath } from "next/cache";

export async function createBillWithExpenses(branchId: string, rawText: string) {
  try {
    // 1. Parse the text into an array of objects
    const parsedItems = myTextParser(rawText);

    if (parsedItems.length === 0) {
      throw new Error("ไม่พบรายการที่สามารถประมวลผลได้ กรุณาตรวจสอบรูปแบบข้อความ");
    }

    // 2. Create the Bill record first
    // We set is_smart_input to true so we know this came from the parser
    const { data: bill, error: billError } = await supabase
      .from('bills')
      .insert([
        {
          branch_id: branchId,
          is_smart_input: true,
          billing_date: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (billError) throw new Error("ไม่สามารถสร้างบิลได้: " + billError.message);

    // 3. Prepare the expenses with the new Bill ID
    // Note: We use 1 as default category_id or you can logic-match it later
    const expensesToInsert = parsedItems.map(item => ({
      bill_id: bill.id,
      branch_id: branchId,
      item_name: item.item_name,
      qty: item.qty,
      unit: item.unit || "รายการ", // Default string if parser fails
      price_per_unit: item.price_per_unit,
      total_amount: item.total_amount,
      entry_date: new Date().toISOString(),
      category_id: null // 👈 Change this to null
    }));

    const { error: expError } = await supabase
      .from('expenses')
      .insert(expensesToInsert);

    if (expError) {
      // Cleanup: if expenses fail, delete the empty bill (Rollback)
      await supabase.from('bills').delete().eq('id', bill.id);
      throw new Error("ไม่สามารถบันทึกรายการรายจ่ายได้: " + expError.message);
    }

    // 5. Clear the cache so the dashboard shows new data
    revalidatePath(`/branch/${branchId}`);

    return { success: true, count: parsedItems.length };

  } catch (error: any) {
    console.error("Server Action Error:", error);
    throw new Error(error.message || "Internal Server Error");
  }
}