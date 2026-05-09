// ฟังก์ชันคำนวณยอดรวมและสรุปผลสำหรับระบบบัญชีรายรับ-รายจ่าย

export interface ExpenseSummary {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  itemCount: number;
}

export interface MonthlySummary {
  month: string;
  totalExpenses: number;
  totalGrossIncome: number;
  totalGpDeduction: number;
  totalNetIncome: number;
  /** @deprecated use totalNetIncome */
  totalIncome: number;
  netAmount: number;
  expensesByCategory: ExpenseSummary[];
}

export interface ReportItem {
  categoryId: string;
  name: string;
  total: number;
}

/**
 * จัดรูปแบบทศนิยมตามมาตรฐานการเงิน
 */
export function formatDecimal(amount: number, decimals: number = 2): number {
  return Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * จัดรูปแบบตัวเลขสำหรับการแสดงผล (เพิ่มคอมม่า)
 */
export function formatNumber(amount: number, decimals: number = 2): string {
  return formatDecimal(amount, decimals).toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * สรุปยอดรายจ่ายตามหมวดหมู่
 */
export function groupExpensesByCategory(expenses: any[]): ExpenseSummary[] {
  const categoryMap = new Map<string | number, ExpenseSummary>();
  
  expenses.forEach(expense => {
    const categoryId = expense.category_id || 'uncategorized';
    const categoryName = expense.categories?.name || 'อื่นๆ / ยังไม่ระบุ';
    const amount = parseFloat(expense.total_amount);
    
    if (categoryMap.has(categoryId)) {
      const existing = categoryMap.get(categoryId)!;
      existing.totalAmount += amount;
      existing.itemCount += 1;
    } else {
      categoryMap.set(categoryId, {
        categoryId: typeof categoryId === 'number' ? categoryId : 0,
        categoryName,
        totalAmount: amount,
        itemCount: 1
      });
    }
  });
  
  return Array.from(categoryMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * สรุปยอดรายเดือนสำหรับ PDF
 */
export function calculateMonthlySummary(
  expenses: any[],
  income: any[],
  month: string
): MonthlySummary {
  // คำนวณยอดรวมรายจ่าย
  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.total_amount || 0);
  }, 0);
  
  // คำนวณยอดรวมรายรับ (gross และ net หลังหัก GP)
  const totalGrossIncome = income.reduce((sum, item) => {
    return sum + parseFloat(item.amount || 0);
  }, 0);
  const totalGpDeduction = income.reduce((sum, item) => {
    const gross = parseFloat(item.amount || 0);
    const gpRate = parseFloat(item.gp_rate || 0);
    return sum + gross * gpRate;
  }, 0);
  const totalNetIncome = totalGrossIncome - totalGpDeduction;

  // จัดกลุ่มรายจ่ายตามหมวดหมู่
  const expensesByCategory = groupExpensesByCategory(expenses);

  return {
    month,
    totalExpenses: formatDecimal(totalExpenses),
    totalGrossIncome: formatDecimal(totalGrossIncome),
    totalGpDeduction: formatDecimal(totalGpDeduction),
    totalNetIncome: formatDecimal(totalNetIncome),
    totalIncome: formatDecimal(totalNetIncome),
    netAmount: formatDecimal(totalNetIncome - totalExpenses),
    expensesByCategory: expensesByCategory.map(item => ({
      ...item,
      totalAmount: formatDecimal(item.totalAmount)
    }))
  };
}

/**
 * แปลงข้อมูลสำหรับ PDF template
 */
export function preparePDFData(
  expensesByCategory: ExpenseSummary[],
  branchName: string,
  month: string
): ReportItem[] {
  return expensesByCategory.map(item => ({
    categoryId: item.categoryId.toString(),
    name: item.categoryName,
    total: item.totalAmount
  }));
}

/**
 * คำนวณยอดรวมสุทธิจากรายการทั้งหมด
 */
export function calculateNetTotal(items: ReportItem[]): number {
  return formatDecimal(items.reduce((sum, item) => sum + item.total, 0));
}

/**
 * ตรวจสอบความถูกต้องของตัวเลข (ป้องกัน NaN, Infinity)
 */
export function validateAmount(amount: any): number {
  const num = parseFloat(amount);
  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }
  return formatDecimal(num);
}

/**
 * สรุปข้อมูลสำหรับการแสดงผลใน Dashboard
 */
export function prepareDashboardData(
  expenses: any[],
  income: any[],
  branchName: string,
  selectedMonth: string
) {
  const summary = calculateMonthlySummary(expenses, income, selectedMonth);
  
  return {
    branchName,
    selectedMonth,
    totalExpenses: summary.totalExpenses,
    totalGrossIncome: summary.totalGrossIncome,
    totalGpDeduction: summary.totalGpDeduction,
    totalNetIncome: summary.totalNetIncome,
    totalIncome: summary.totalNetIncome,
    netAmount: summary.netAmount,
    expensesByCategory: summary.expensesByCategory,
    expenseCount: expenses.length,
    incomeCount: income.length,
    topExpenseCategory: summary.expensesByCategory[0]?.categoryName || '-',
    topExpenseAmount: summary.expensesByCategory[0]?.totalAmount || 0
  };
}
