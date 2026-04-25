import { supabase } from "@/src/lib/supabase";

export async function listBranches() {
  return supabase.from("branches").select("*").order("name", { ascending: true });
}

export async function getBranchById(branchId: string) {
  return supabase.from("branches").select("name").eq("id", branchId).single();
}

export async function createBranch(name: string) {
  return supabase.from("branches").insert([{ name }]).select();
}
