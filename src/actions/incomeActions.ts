"use server";

import { revalidatePath } from "next/cache";
import { createIncome } from "@/src/services/incomeService";
import { CreateIncomeData } from "@/src/types/income";

export async function createIncomeAction(data: CreateIncomeData) {
  try {
    const { data: result, error } = await createIncome(data);
    
    if (error) {
      console.error("Error creating income:", error);
      return { success: false, error: error.message };
    }
    
    // Revalidate the branch dashboard to show updated data
    revalidatePath(`/branch/${data.branch_id}`);
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Unexpected error creating income:", error);
    return { success: false, error: error.message };
  }
}
