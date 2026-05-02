"use server";

import { myTextParser } from "@/src/lib/parser";
import { revalidatePath } from "next/cache";
import { convertThaiDateToISO } from "../lib/utils";
import { suggestCategory } from "../lib/categorizer";
import { listAllCategories } from "../services/categoryService";
import { createBill, removeBill } from "../services/billService";
import { createExpenses, updateExpenseById } from "../services/expenseService";

export async function createBillWithExpenses(branchId: string, rawText: string) {
  try {
    const parsedItems = myTextParser(rawText);
    if (parsedItems.length === 0) throw new Error("ไม่พบรายการ");

    // Use the date from the first item as the Bill's date
    const firstDate = parsedItems[0].extracted_date;
    const dbDate = firstDate ? convertThaiDateToISO(firstDate) : new Date().toISOString().split("T")[0];

    const { data: allCategories } = await listAllCategories();

    // 1. Create Bill
    const { data: bill, error: billError } = await createBill({
      branch_id: branchId,
      is_smart_input: true,
      billing_date: dbDate,
    });

    if (billError) throw billError;

    // 2. Map Expenses
    const expensesToInsert = parsedItems.map(item => ({
      bill_id: bill.id,
      item_name: item.item_name,
      qty: item.qty,
      unit: item.unit,
      price_per_unit: item.price_per_unit,
      total_amount: item.total_amount,
      entry_date: item.extracted_date ? convertThaiDateToISO(item.extracted_date) : dbDate, // 👈 And here
      category_id: suggestCategory(item.item_name, allCategories || [])
    }));

    const { error: expError } = await createExpenses(expensesToInsert);
    if (expError) throw expError;

    revalidatePath(`/branch/${branchId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
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
    const { data: bill, error: billError } = await createBill({
      branch_id: formData.branchId,
      is_smart_input: false,
      billing_date: formData.billingDate,
    });

    if (billError) throw new Error(billError.message);

    // 2. Create the Expense
    const { error: expError } = await createExpenses([{
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
    const { error } = await removeBill(billId);

    if (error) throw error;

    // Refresh the dashboard and the specific branch view
    revalidatePath(`/branch/${branchId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateExpense(id: number, data: {
  item_name?: string;
  qty?: number;
  unit?: string;
  price_per_unit?: number;
  total_amount?: number;
  category_id?: number | null;
}) {
  try {
    const { error } = await updateExpenseById(id, data);

    if (error) throw error;

    revalidatePath('/branch/[id]');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}