export interface Income {
  id: string;
  branch_id: string;
  entry_date: string;
  amount: number;
  channel: string;
  gp_rate: number;
  note?: string;
  created_at?: string;
}

export interface CreateIncomeData {
  branch_id: string;
  entry_date: string;
  amount: number;
  channel: string;
  gp_rate: number;
  note?: string;
}

export interface UpdateIncomeData {
  entry_date?: string;
  amount?: number;
  channel?: string;
  gp_rate?: number;
  note?: string;
}
