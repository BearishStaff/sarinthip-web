"use client";

import { IBranch, jsonToIBranchList } from "@/src/types/branch"
import { useQuery } from '@tanstack/react-query'

export function useBranch() {
  
  // 1. The Fetcher Function
  const getBranches = async (): Promise<IBranch[]> => {
    // Note: Use the full URL for local dev if not using a proxy
    const BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL
    const response = await fetch(`${BASE_URL}/api/v1/branches`)

    if (!response.ok) {
      // This triggers the 'isError' state in useQuery
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
    }

    // Go Gin returns the array directly: [{}, {}]
    const data = await response.json()
    
    // Use your utility to transform/validate the JSON into IBranch objects
    return jsonToIBranchList(data)
  }

  // 2. The React Query Hook
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