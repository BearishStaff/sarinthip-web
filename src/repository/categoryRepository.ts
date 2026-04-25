import { supabase } from "@/src/lib/supabase";

export type UpsertCategoryInput = {
  id?: number;
  name: string;
  keywords: string[];
};

export async function listCategories() {
  return supabase.from("categories").select("*").order("name", { ascending: true });
}

export async function listCategoryOptions() {
  return supabase.from("categories").select("id, name").order("name");
}

export async function listAllCategories() {
  return supabase.from("categories").select("*");
}

export async function upsertCategoryByInput(data: UpsertCategoryInput) {
  return supabase.from("categories").upsert({
    id: data.id,
    name: data.name,
    keywords: data.keywords,
  });
}

export async function removeCategory(id: number) {
  return supabase.from("categories").delete().eq("id", id);
}
