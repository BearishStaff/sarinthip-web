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

export async function createManualExpense(formData: {
  branchId: string;
  itemName: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
  billingDate: string;
  categoryId?: number | null;
}) {
  try {
    // 1. Create the Bill (Manual entries are still wrapped in a Bill)
    const { data: bill, error: billError } = await supabase
      .from('bills')
      .insert([
        { 
          branch_id: formData.branchId, 
          is_smart_input: false, // Flag as manual
          billing_date: formData.billingDate 
        }
      ])
      .select()
      .single();

    if (billError) throw new Error(billError.message);

    // 2. Create the Expense
    const { error: expError } = await supabase
      .from('expenses')
      .insert([{
        bill_id: bill.id,
        item_name: formData.itemName,
        qty: formData.qty,
        unit: formData.unit,
        price_per_unit: formData.pricePerUnit,
        total_amount: formData.qty * formData.pricePerUnit,
        entry_date: formData.billingDate,
        category_id: formData.categoryId || null
      }]);

    if (expError) throw new Error(expError.message);

    revalidatePath(`/branch/${formData.branchId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 3. DELETE BILL: Removes a bill and all associated expenses (via Cascade)
 */
export async function deleteBill(billId: string, branchId: string) {
  try {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', billId);

    if (error) throw error;

    // Refresh the dashboard and the specific branch view
    revalidatePath(`/branch/${branchId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}