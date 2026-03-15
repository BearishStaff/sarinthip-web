export interface ParsedExpense {
  item_name: string;
  qty: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  extracted_date?: string; // e.g., "27/02/2569"
}

export function myTextParser(rawText: string): ParsedExpense[] {
  const lines = rawText.split('\n');
  const expenses: ParsedExpense[] = [];
  
  // Regex for the middle segment: Name Qty Unit UnitPrice = Total
  const detailRegex = /^(.*?)\s+([\d,.]+)\s+([^\d\s]+)\s+.*ละ\s+([\d,.]+)\s*=\s*([\d,.]+)$/;

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    
    if (parts.length >= 2) {
      const datePart = parts[0]; // "27/02/2569"
      const detailSegment = parts[1];
      const match = detailSegment.match(detailRegex);

      if (match) {
        expenses.push({
          extracted_date: datePart,
          item_name: match[1].trim(),
          qty: parseFloat(match[2].replace(/,/g, '')),
          unit: match[3].trim(),
          price_per_unit: parseFloat(match[4].replace(/,/g, '')),
          total_amount: parseFloat(match[5].replace(/,/g, ''))
        });
      }
    }
  }
  return expenses;
}