import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatDecimal,
  formatNumber,
  groupExpensesByCategory,
  calculateMonthlySummary,
  preparePDFData,
  calculateNetTotal,
  validateAmount,
  prepareDashboardData,
  type ExpenseSummary,
  type MonthlySummary,
  type ReportItem
} from './calculations';

describe('formatDecimal', () => {
  it('should format decimal with default 2 places', () => {
    expect(formatDecimal(123.456)).toBe(123.46);
    expect(formatDecimal(123.454)).toBe(123.45);
  });

  it('should format decimal with custom places', () => {
    expect(formatDecimal(123.456, 1)).toBe(123.5);
    expect(formatDecimal(123.456, 3)).toBe(123.456);
  });

  it('should handle zero', () => {
    expect(formatDecimal(0)).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(formatDecimal(-123.456)).toBe(-123.46);
  });

  it('should handle very small numbers', () => {
    expect(formatDecimal(0.001)).toBe(0);
    expect(formatDecimal(0.009)).toBe(0.01);
  });
});

describe('formatNumber', () => {
  it('should format number with Thai locale', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
    expect(formatNumber(1000000)).toBe('1,000,000.00');
  });

  it('should format with custom decimals', () => {
    expect(formatNumber(1234.567, 1)).toBe('1,234.6');
    expect(formatNumber(1234.567, 3)).toBe('1,234.567');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234.56)).toBe('-1,234.56');
  });
});

describe('groupExpensesByCategory', () => {
  const mockExpenses = [
    {
      category_id: 1,
      categories: { name: 'อาหาร' },
      total_amount: '100.50'
    },
    {
      category_id: 2,
      categories: { name: 'ค่าน้ำมัน' },
      total_amount: '200.00'
    },
    {
      category_id: 1,
      categories: { name: 'อาหาร' },
      total_amount: '150.75'
    },
    {
      category_id: 3,
      categories: null,
      total_amount: '50.00'
    }
  ];

  it('should group expenses by category', () => {
    const result = groupExpensesByCategory(mockExpenses);
    
    expect(result).toHaveLength(3);
    expect(result[0].categoryId).toBe(1); // Highest amount first (251.25 > 200)
    expect(result[0].totalAmount).toBe(251.25);
    expect(result[0].itemCount).toBe(2);
    
    expect(result[1].categoryId).toBe(2);
    expect(result[1].totalAmount).toBe(200);
    expect(result[1].itemCount).toBe(1);
    
    expect(result[2].categoryId).toBe(3);
    expect(result[2].categoryName).toBe('อื่นๆ / ยังไม่ระบุ');
    expect(result[2].totalAmount).toBe(50);
    expect(result[2].itemCount).toBe(1);
  });

  it('should handle empty array', () => {
    const result = groupExpensesByCategory([]);
    expect(result).toEqual([]);
  });

  it('should handle expenses without categories', () => {
    const expensesWithoutCategories = [
      {
        category_id: 1,
        total_amount: '100.00'
      }
    ];
    
    const result = groupExpensesByCategory(expensesWithoutCategories);
    expect(result[0].categoryName).toBe('อื่นๆ / ยังไม่ระบุ');
  });
});

describe('calculateMonthlySummary', () => {
  const mockExpenses = [
    {
      category_id: 1,
      categories: { name: 'อาหาร' },
      total_amount: '100.50'
    },
    {
      category_id: 2,
      categories: { name: 'ค่าน้ำมัน' },
      total_amount: '200.00'
    }
  ];

  const mockIncome = [
    { amount: '1000.00' },
    { amount: '500.50' }
  ];

  it('should calculate monthly summary correctly', () => {
    const result = calculateMonthlySummary(mockExpenses, mockIncome, 'มกราคม 2026');
    
    expect(result.month).toBe('มกราคม 2026');
    expect(result.totalExpenses).toBe(300.5);
    expect(result.totalIncome).toBe(1500.5);
    expect(result.netAmount).toBe(1200);
    expect(result.expensesByCategory).toHaveLength(2);
  });

  it('should handle empty arrays', () => {
    const result = calculateMonthlySummary([], [], 'มกราคม 2026');
    
    expect(result.totalExpenses).toBe(0);
    expect(result.totalIncome).toBe(0);
    expect(result.netAmount).toBe(0);
    expect(result.expensesByCategory).toEqual([]);
  });

  it('should handle missing amounts', () => {
    const expensesWithMissing = [
      { total_amount: null },
      { total_amount: '100.00' }
    ];
    
    const incomeWithMissing = [
      { amount: undefined },
      { amount: '200.00' }
    ];
    
    const result = calculateMonthlySummary(expensesWithMissing, incomeWithMissing, 'มกราคม 2026');
    
    expect(result.totalExpenses).toBe(100);
    expect(result.totalIncome).toBe(200);
  });
});

describe('preparePDFData', () => {
  const mockExpensesByCategory: ExpenseSummary[] = [
    {
      categoryId: 1,
      categoryName: 'อาหาร',
      totalAmount: 100.50,
      itemCount: 2
    },
    {
      categoryId: 2,
      categoryName: 'ค่าน้ำมัน',
      totalAmount: 200.00,
      itemCount: 1
    }
  ];

  it('should prepare PDF data correctly', () => {
    const result = preparePDFData(mockExpensesByCategory, 'สาขากลาง', 'มกราคม 2026');
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      categoryId: '1',
      name: 'อาหาร',
      total: 100.50
    });
    expect(result[1]).toEqual({
      categoryId: '2',
      name: 'ค่าน้ำมัน',
      total: 200
    });
  });

  it('should handle empty expenses', () => {
    const result = preparePDFData([], 'สาขากลาง', 'มกราคม 2026');
    expect(result).toEqual([]);
  });
});

describe('calculateNetTotal', () => {
  const mockItems: ReportItem[] = [
    { categoryId: '1', name: 'อาหาร', total: 100.50 },
    { categoryId: '2', name: 'ค่าน้ำมัน', total: 200.00 },
    { categoryId: '3', name: 'ค่าเช่า', total: 150.75 }
  ];

  it('should calculate net total correctly', () => {
    const result = calculateNetTotal(mockItems);
    expect(result).toBe(451.25);
  });

  it('should handle empty array', () => {
    const result = calculateNetTotal([]);
    expect(result).toBe(0);
  });

  it('should format decimal correctly', () => {
    const itemsWithDecimal: ReportItem[] = [
      { categoryId: '1', name: 'อาหาร', total: 100.567 }
    ];
    const result = calculateNetTotal(itemsWithDecimal);
    expect(result).toBe(100.57);
  });
});

describe('validateAmount', () => {
  it('should validate valid numbers', () => {
    expect(validateAmount('123.45')).toBe(123.45);
    expect(validateAmount(123.45)).toBe(123.45);
    expect(validateAmount('100')).toBe(100);
  });

  it('should handle invalid values', () => {
    expect(validateAmount('')).toBe(0);
    expect(validateAmount('abc')).toBe(0);
    expect(validateAmount(null)).toBe(0);
    expect(validateAmount(undefined)).toBe(0);
    expect(validateAmount(NaN)).toBe(0);
    expect(validateAmount(Infinity)).toBe(0);
    expect(validateAmount(-Infinity)).toBe(0);
  });

  it('should format decimal correctly', () => {
    expect(validateAmount('123.456')).toBe(123.46);
    expect(validateAmount('123.454')).toBe(123.45);
  });
});

describe('prepareDashboardData', () => {
  const mockExpenses = [
    {
      category_id: 1,
      categories: { name: 'อาหาร' },
      total_amount: '100.50'
    },
    {
      category_id: 2,
      categories: { name: 'ค่าน้ำมัน' },
      total_amount: '200.00'
    }
  ];

  const mockIncome = [
    { amount: '1000.00' },
    { amount: '500.50' }
  ];

  it('should prepare dashboard data correctly', () => {
    const result = prepareDashboardData(mockExpenses, mockIncome, 'สาขากลาง', 'มกราคม 2026');
    
    expect(result.branchName).toBe('สาขากลาง');
    expect(result.selectedMonth).toBe('มกราคม 2026');
    expect(result.totalExpenses).toBe(300.5);
    expect(result.totalIncome).toBe(1500.5);
    expect(result.netAmount).toBe(1200);
    expect(result.expenseCount).toBe(2);
    expect(result.incomeCount).toBe(2);
    expect(result.topExpenseCategory).toBe('ค่าน้ำมัน');
    expect(result.topExpenseAmount).toBe(200);
  });

  it('should handle empty data', () => {
    const result = prepareDashboardData([], [], 'สาขากลาง', 'มกราคม 2026');
    
    expect(result.totalExpenses).toBe(0);
    expect(result.totalIncome).toBe(0);
    expect(result.netAmount).toBe(0);
    expect(result.expenseCount).toBe(0);
    expect(result.incomeCount).toBe(0);
    expect(result.topExpenseCategory).toBe('-');
    expect(result.topExpenseAmount).toBe(0);
  });
});
