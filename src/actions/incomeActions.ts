"use server";

import { revalidatePath } from "next/cache";
import { createIncome, updateIncomeById, removeIncome } from "@/src/services/incomeService";
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

export async function updateIncomeAction(id: string, data: CreateIncomeData) {
  try {
    const { data: result, error } = await updateIncomeById(id, {
      entry_date: data.entry_date,
      amount: data.amount,
      source: data.source,
      note: data.note
    });
    
    if (error) {
      console.error("Error updating income:", error);
      return { success: false, error: error.message };
    }
    
    // Revalidate the branch dashboard and income detail page
    revalidatePath(`/branch/${data.branch_id}`);
    revalidatePath(`/branch/${data.branch_id}/income/${id}`);
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Unexpected error updating income:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteIncomeAction(id: string) {
  try {
    const { error } = await removeIncome(id);
    
    if (error) {
      console.error("Error deleting income:", error);
      return { success: false, error: error.message };
    }
    
    // Revalidate the branch dashboard
    revalidatePath(`/branch`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error deleting income:", error);
    return { success: false, error: error.message };
  }
}
