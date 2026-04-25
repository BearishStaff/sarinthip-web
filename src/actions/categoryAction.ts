"use server";

import {
  removeCategory,
  upsertCategoryByInput,
} from "@/src/repository/categoryRepository";
import { revalidatePath } from "next/cache";

export async function upsertCategory(data: {
  id?: number;
  name: string;
  keywords: string[];
}) {
  try {
    const { error } = await upsertCategoryByInput(data);

    if (error) throw error;

    revalidatePath('/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: number) {
  try {
    const { error } = await removeCategory(id);

    if (error) throw error;

    revalidatePath('/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}