"use server";

import { createBranch } from "@/src/services/branchService";
import { revalidatePath } from "next/cache";

export async function addBranch(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    return { error: "Branch name is required" };
  }

  // Insert into Supabase
  const { data, error } = await createBranch(name);

  if (error) {
    console.error("Supabase Error:", error);
    return { error: error.message };
  }

  // ⚡ This tells Next.js to refresh the page data (the branch list)
  revalidatePath("/branches"); 

  return { success: true, data };
}