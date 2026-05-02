"use client";

import { IBranch } from "@/src/types/branch"
import { useQuery } from '@tanstack/react-query'
import { listBranches } from "@/src/services/branchService";

export function useBranch() {
  const getBranches = async (): Promise<IBranch[]> => {
    const { data, error } = await listBranches();

    if (error) throw new Error(error.message)
    return data as IBranch[]
  }

 const queryList = useQuery({
    queryKey: ['branches'], // Unique key for caching
    queryFn: getBranches,    // The function that does the work
  })

  // 3. Return object for the Component to use
  return {
    branchesData: queryList.data || [], // Fallback to empty array to prevent .map() errors
    isLoading: queryList.isLoading,     // True while the first fetch is happening
    isError: queryList.isError,         // True if the fetcher throws an error
    error: queryList.error,             // The actual error message
    refetchBranches: queryList.refetch, // Function to manually refresh the list
  }
}