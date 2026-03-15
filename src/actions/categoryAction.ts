"use server";

import { supabase } from "@/src/lib/supabase";
import { revalidatePath } from "next/cache";

export async function upsertCategory(data: {
  id?: number;
  name: string;
  keywords: string[];
}) {
  try {
    const { error } = await supabase
      .from('categories')
      .upsert({
        id: data.id, // If ID exists, it updates; if not, it inserts
        name: data.name,
        keywords: data.keywords
      });

    if (error) throw error;

    revalidatePath('/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: number) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}