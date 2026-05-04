"use server";

import { createBranch, updateBranch, softDeleteBranch, cascadeDeleteBranchData, checkBranchHasData, checkBranchNameExists } from "@/src/services/branchService";
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

export async function deleteBranch(branchId: string) {
  if (!branchId) {
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: "Branch ID is required" };
  }

  // Check if branch has related data
  const { hasData, error: checkError } = await checkBranchHasData(branchId);
  
  if (checkError) {
    console.error("Supabase Error:", checkError);
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: checkError.message };
  }

  if (hasData) {
    // Always refresh even on error
    revalidatePath("/branches");
    return { 
      error: "ไม่สามารถลบสาขานี้ได้เนื่องจากมีข้อมูลธุรกรรมที่เกี่ยวข้อง กรุณาใช้ตัวเลือก 'ลบข้อมูลทั้งหมด' แทน",
      hasData: true 
    };
  }

  // Soft delete the branch
  const { data, error } = await softDeleteBranch(branchId);

  if (error) {
    console.error("Supabase Error:", error);
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: error.message };
  }

  // Refresh the page data
  revalidatePath("/branches");

  return { success: true, data };
}

export async function deleteBranchWithAllData(branchId: string) {
  if (!branchId) {
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: "Branch ID is required" };
  }

  // Cascade delete all related data and soft delete the branch
  const result = await cascadeDeleteBranchData(branchId);

  if (result.error) {
    console.error("Supabase Error:", result.error);
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: result.error.message };
  }

  // Refresh the page data
  revalidatePath("/branches");

  return { success: true, data: result.data };
}

export async function updateBranchName(branchId: string, formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: "ชื่อสาขาจำเป็นต้องระบุ" };
  }

  if (!branchId) {
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: "Branch ID is required" };
  }

  // Check if branch name already exists (excluding current branch)
  const { exists, error: checkError } = await checkBranchNameExists(name, branchId);
  
  if (checkError) {
    console.error("Supabase Error:", checkError);
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: checkError.message };
  }

  if (exists) {
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: "ชื่อสาขานี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น" };
  }

  // Update the branch
  const { data, error } = await updateBranch(branchId, name);

  if (error) {
    console.error("Supabase Error:", error);
    // Always refresh even on error
    revalidatePath("/branches");
    return { error: error.message };
  }

  // Refresh the page data
  revalidatePath("/branches");

  return { success: true, data };
}