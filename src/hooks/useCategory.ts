import { useQuery } from '@tanstack/react-query';
import { listCategoryOptions } from "@/src/repository/categoryRepository";

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await listCategoryOptions();
      if (error) throw error;
      return data;
    }
  });
}