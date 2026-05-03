export interface Income {
  id: number;
  branch_id: string;
  entry_date: string;
  amount: number;
  source: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateIncomeData {
  branch_id: string;
  entry_date: string;
  amount: number;
  source: string;
  note?: string;
}

export interface UpdateIncomeData {
  entry_date?: string;
  amount?: number;
  source?: string;
  note?: string;
}
