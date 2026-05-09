"use server";

import { revalidatePath } from "next/cache";
import { createBill } from "../services/billService";
import { createExpenses } from "../services/expenseService";

export interface PocExpenseItem {
  itemName: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  categoryId?: number | null;
  note?: string;
}

export async function createPocBillWithItems(
  branchId: string,
  billingDate: string,
  items: PocExpenseItem[]
) {
  try {
    if (items.length === 0) throw new Error("ไม่มีรายการ");

    const { data: bill, error: billError } = await createBill({
      branch_id: branchId,
      is_smart_input: false,
      billing_date: billingDate,
    });

    if (billError) throw new Error(billError.message);

    const expensesToInsert = items.map((item) => ({
      bill_id: bill.id,
      item_name: item.itemName,
      qty: item.qty,
      unit: item.unit,
      price_per_unit: item.pricePerUnit,
      total_amount: item.totalAmount,
      entry_date: billingDate,
      category_id: item.categoryId || null,
    }));

    const { error: expError } = await createExpenses(expensesToInsert);
    if (expError) throw new Error(expError.message);

    revalidatePath(`/branch/${branchId}`);
    revalidatePath(`/branch/${branchId}/poc`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
