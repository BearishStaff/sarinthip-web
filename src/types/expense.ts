export interface IExpenseAPI {
  id: string
  branch_id: string
  bill_id: string
  category: string
  entry_date: string
  item_name: string
  qty: number
  unit: string
  price_per_unit: number
  total_amount: number
  created_at: string
}

export interface IExpense {
  id: string
  item_name: string
  qty: number
  unit: string
  price_per_unit: number
  total_amount: number
  created_at: string
}

export function jsonToIExpenseList(json: IExpenseAPI[]): IExpense[] {
  return json.map(jsonToIExpense)
}

export function jsonToIExpense(json: IExpenseAPI): IExpense {
  return {
    id: json.id,
    item_name: json.item_name,
    qty: json.qty,
    unit: json.unit,
    price_per_unit: json.price_per_unit,
    total_amount: json.total_amount,
    created_at: json.created_at,}
}