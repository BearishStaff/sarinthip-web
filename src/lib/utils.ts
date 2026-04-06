export function convertThaiDateToISO(thaiDateStr: string): string {
  // Handles "27/02/2569" or "27/02/2026"
  const parts = thaiDateStr.split('/');
  if (parts.length !== 3) return new Date().toISOString().split("T")[0];

  const day = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10) - 1; // JS months are 0-11
  let year = Number.parseInt(parts[2], 10);

  // Smart Detection:
  // If year is 2569, it's BE -> convert to 2026
  // If year is 2026, it's already AD -> keep as is
  if (year > 2400) {
    year -= 543;
  }

  const date = new Date(year, month, day);

  // Basic validation: if date is invalid, fallback to today's date (YYYY-MM-DD)
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return new Date().toISOString().split("T")[0];
  }

  const monthStr = String(date.getMonth() + 1).padStart(2, "0");
  const dayStr = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${monthStr}-${dayStr}`;
}

export const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];