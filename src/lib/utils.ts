export function convertThaiDateToISO(thaiDateStr: string): string {
  // Handles "27/02/2569" or "27/02/2026"
  const parts = thaiDateStr.split('/');
  if (parts.length !== 3) return new Date().toISOString().split("T")[0];

  const day = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10);
  let year = Number.parseInt(parts[2], 10);

  // Check for invalid values
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return new Date().toISOString().split("T")[0];
  }

  // Convert Thai BE year to AD if needed (but not for years < 2400)
  if (year > 2400) {
    year -= 543;
  }

  // Basic validation
  if (month < 1 || month > 12 || day < 1 || day > 31 || year === 0) {
    return new Date().toISOString().split("T")[0];
  }

  // Check for valid days in month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Check leap year for February
  if (month === 2) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (day > (isLeapYear ? 29 : 28)) {
      return new Date().toISOString().split("T")[0];
    }
  } else if (day > daysInMonth[month - 1]) {
    return new Date().toISOString().split("T")[0];
  }

  // Create ISO string directly (no timezone conversion)
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${year}-${monthStr}-${dayStr}`;
}

export const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];