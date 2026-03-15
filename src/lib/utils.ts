export function convertThaiDateToISO(thaiDateStr: string): string {
  // Handles "27/02/2569" or "27/02/2026"
  const parts = thaiDateStr.split('/');
  if (parts.length !== 3) return new Date().toISOString();

  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // JS Months are 0-11
  let year = parseInt(parts[2]);

  // Smart Detection:
  // If year is 2569, it's BE -> convert to 2026
  // If year is 2026, it's already AD -> keep as is
  if (year > 2400) {
    year -= 543;
  }

  const date = new Date(year, month, day);
  
  // Basic validation: if date is invalid, fallback to now
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}