export interface ParsedExpense {
  item_name: string;
  amount: number;
}

export function myTextParser(rawText: string): ParsedExpense[] {
  // Split text by new lines
  const lines = rawText.split('\n');
  const expenses: ParsedExpense[] = [];

  // This regex looks for: 
  // 1. Any text at the start (the item name)
  // 2. A number at the end (the price)
  const regex = /^(.*?)\s+(\d+(?:\.\d+)?)$/;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const match = trimmedLine.match(regex);
    if (match) {
      const name = match[1].trim();
      const price = parseFloat(match[2]);

      if (name && !isNaN(price)) {
        expenses.push({
          item_name: name,
          amount: price,
        });
      }
    }
  }

  return expenses;
}