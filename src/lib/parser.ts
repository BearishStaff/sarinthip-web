export interface ParsedExpense {
  item_name: string;
  qty: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
}

export function myTextParser(rawText: string): ParsedExpense[] {
  const lines = rawText.split('\n');
  const expenses: ParsedExpense[] = [];

  // Updated Regex:
  // ^(.*?)\s+          -> Group 1: Item Name
  // ([\d,.]+)\s+       -> Group 2: Quantity
  // ([^\d\s]+)\s+      -> Group 3: Unit (any non-digit, non-space chars)
  // ([\d,.]+)$         -> Group 4: Total Price
  const complexRegex = /^(.*?)\s+([\d,.]+)\s+([^\d\s]+)\s+([\d,.]+)$/;
  
  // Fallback Regex (Name + Total Price only)
  const simpleRegex = /^(.*?)\s+([\d,.]+)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const complexMatch = trimmed.match(complexRegex);
    
    if (complexMatch) {
      const name = complexMatch[1].trim();
      const qty = parseFloat(complexMatch[2].replace(/,/g, ''));
      const unit = complexMatch[3].trim();
      const total = parseFloat(complexMatch[4].replace(/,/g, ''));
      
      expenses.push({
        item_name: name,
        qty: qty,
        unit: unit,
        price_per_unit: total / qty, // Calculate unit price
        total_amount: total
      });
    } else {
      // Try simple match if complex fails
      const simpleMatch = trimmed.match(simpleRegex);
      if (simpleMatch) {
        const name = simpleMatch[1].trim();
        const total = parseFloat(simpleMatch[2].replace(/,/g, ''));
        expenses.push({
          item_name: name,
          qty: 1,
          unit: "รายการ", // Fallback for your NOT NULL constraint
          price_per_unit: total,
          total_amount: total
        });
      }
    }
  }
  return expenses;
}