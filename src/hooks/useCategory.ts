import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });
}