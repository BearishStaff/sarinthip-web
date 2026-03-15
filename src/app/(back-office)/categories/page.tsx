import { supabase } from "@/src/lib/supabase";
import CategoryManager from "./container"; // Import your container

export default async function CategoriesPage() {
  // Fetch categories from Supabase on the server
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Pass the server data to the client container */}
      <CategoryManager initialCategories={categories || []} />
    </div>
  );
}