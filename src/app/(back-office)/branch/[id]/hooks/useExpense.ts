"use client";

import { IExpense, jsonToIExpenseList } from '@/src/types/expense';
import { useQuery } from '@tanstack/react-query'

export function useExpense(branchID: string) {
  
  const getExpense = async (branchID: string): Promise<IExpense[]> => {
    const BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL
    const response = await fetch(`${BASE_URL}/api/v1/expense/${branchID}`)

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    return jsonToIExpenseList(data)
  }

  const queryList = useQuery({
    queryKey: ['expense', branchID], 
    queryFn: () => getExpense(branchID),   
    retry: false, 
  })

  return {
    expenseData: queryList.data || [],
    isLoading: queryList.isLoading,    
    isError: queryList.isError,        
    error: queryList.error,            
    refetchExpense: queryList.refetch,
  }
}