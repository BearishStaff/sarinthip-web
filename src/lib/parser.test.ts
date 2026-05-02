import { describe, it, expect } from 'vitest';
import { myTextParser, type ParsedExpense } from './parser';

describe('myTextParser', () => {
  it('should parse valid expense text format', () => {
    const rawText = `27/02/2569|ข้าวผัด 2 จาน ละ 50.00 = 100.00
27/02/2569|น้ำดื่ม 3 ขวด ละ 10.50 = 31.50`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      extracted_date: '27/02/2569',
      item_name: 'ข้าวผัด',
      qty: 2,
      unit: 'จาน',
      price_per_unit: 50.00,
      total_amount: 100.00
    });
    expect(result[1]).toEqual({
      extracted_date: '27/02/2569',
      item_name: 'น้ำดื่ม',
      qty: 3,
      unit: 'ขวด',
      price_per_unit: 10.50,
      total_amount: 31.50
    });
  });

  it('should handle text with commas in numbers', () => {
    const rawText = `27/02/2569|สินค้าแพง 1 ชิ้น ละ 1,500.00 = 1,500.00`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].price_per_unit).toBe(1500.00);
    expect(result[0].total_amount).toBe(1500.00);
  });

  it('should handle single line input', () => {
    const rawText = `27/02/2569|ข้าวผัด 1 จาน ละ 50.00 = 50.00`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('ข้าวผัด');
    expect(result[0].total_amount).toBe(50.00);
  });

  it('should handle empty input', () => {
    const result = myTextParser('');
    expect(result).toEqual([]);
  });

  it('should handle invalid format lines', () => {
    const rawText = `27/02/2569|ข้าวผัด 2 จาน ละ 50.00 = 100.00
invalid line without pipe
27/02/2569|another invalid format`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('ข้าวผัด');
  });

  it('should handle lines without proper regex match', () => {
    const rawText = `27/02/2569|ข้าวผัด
27/02/2569|some random text
27/02/2569|valid line 2 ชิ้น ละ 30.00 = 60.00`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('valid line');
    expect(result[0].total_amount).toBe(60.00);
  });

  it('should handle different date formats', () => {
    const rawText = `15/01/2026|ข้าวผัด 1 จาน ละ 45.00 = 45.00
01/12/2568|น้ำดื่ม 2 ขวด ละ 8.50 = 17.00`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(2);
    expect(result[0].extracted_date).toBe('15/01/2026');
    expect(result[1].extracted_date).toBe('01/12/2568');
  });

  it('should handle decimal numbers correctly', () => {
    const rawText = `27/02/2569|สินค้า 1.5 กิโลกรัม ละ 120.50 = 180.75`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(1.5);
    expect(result[0].price_per_unit).toBe(120.50);
    expect(result[0].total_amount).toBe(180.75);
  });

  it('should handle item names with spaces', () => {
    const rawText = `27/02/2569|ข้าวผัดหมูปิ้งพิเศษ 1 จาน ละ 80.00 = 80.00`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('ข้าวผัดหมูปิ้งพิเศษ');
  });

  it('should handle unit with spaces', () => {
    const rawText = `27/02/2569|สินค้า 2 ห่อ ใหญ่ ละ 25.00 = 50.00`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].unit).toBe('ห่อ');
    expect(result[0].total_amount).toBe(50.00);
  });

  it('should handle lines with extra whitespace', () => {
    const rawText = `  27/02/2569  |  ข้าวผัด  2  จาน  ละ  50.00  =  100.00  `;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('ข้าวผัด');
    expect(result[0].total_amount).toBe(100.00);
  });

  it('should handle mixed valid and invalid lines', () => {
    const rawText = `27/02/2569|ข้าวผัด 2 จาน ละ 50.00 = 100.00
27/02/2569|invalid format
27/02/2569|น้ำดื่ม 1 ขวด ละ 15.00 = 15.00
just random text`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(2);
    expect(result[0].item_name).toBe('ข้าวผัด');
    expect(result[1].item_name).toBe('น้ำดื่ม');
  });

  it('should handle zero values', () => {
    const rawText = `27/02/2569|สินค้า 0 ชิ้น ละ 50.00 = 0.00`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(0);
    expect(result[0].total_amount).toBe(0);
  });

  it('should handle very large numbers', () => {
    const rawText = `27/02/2569|สินค้า 1 ชิ้น ละ 999999.99 = 999999.99`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(1);
    expect(result[0].price_per_unit).toBe(999999.99);
    expect(result[0].total_amount).toBe(999999.99);
  });

  it('should handle negative numbers (if they appear)', () => {
    // The current regex doesn't handle negative numbers, so this test should reflect the actual behavior
    const rawText = `27/02/2569|ส่วนลด 1 ครั้ง ละ -50.00 = -50.00`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(0); // Current parser doesn't handle negative numbers
  });

  it('should preserve extracted_date field', () => {
    const rawText = `27/02/2569|ข้าวผัด 1 จาน ละ 50.00 = 50.00`;

    const result = myTextParser(rawText);

    expect(result[0]).toHaveProperty('extracted_date', '27/02/2569');
  });

  it('should handle real expense data with varied dates', () => {
    const rawText = `27/02/2569 | ลูกชิ้นเนื้อ 3 กก. กก.ละ 220 = 660 | 660
28/02/2569 | ลูกชิ้นหมู 3 กก. กก.ละ 220 = 660 | 660
01/03/2569 | เส้นเล็ก 10 ถุง ถุงละ 34 = 340 | 340
02/03/2569 | บะหมี่กลม 5 ถุง ถุงละ 34 = 170 | 170
03/03/2569 | บะหมี่แบน 8 ถุง ถุงละ 34 = 272 | 272
04/03/2569 | เส้นหมี่ขาว 10 ถุง ถุงละ 18 = 180 | 180
05/03/2569 | เส้นใหญ่ 1 ถุง ถุงละ 30 = 30 | 30
06/03/2569 | มาม่า 1 ถุง ถุงละ 75 = 75 | 75
07/03/2569 | ผักบุ้ง 4 ถุง ถุงละ 100 = 400 | 400
08/03/2569 | ผักชีฝรั่ง 2 โล โลละ 100 = 200 | 200`;

    const result = myTextParser(rawText);

    expect(result).toHaveLength(10);
    
    // Check first item
    expect(result[0]).toEqual({
      extracted_date: '27/02/2569',
      item_name: 'ลูกชิ้นเนื้อ',
      qty: 3,
      unit: 'กก.',
      price_per_unit: 220,
      total_amount: 660
    });
    
    // Check some other items
    expect(result[2]).toEqual({
      extracted_date: '01/03/2569',
      item_name: 'เส้นเล็ก',
      qty: 10,
      unit: 'ถุง',
      price_per_unit: 34,
      total_amount: 340
    });
    
    expect(result[9]).toEqual({
      extracted_date: '08/03/2569',
      item_name: 'ผักชีฝรั่ง',
      qty: 2,
      unit: 'โล',
      price_per_unit: 100,
      total_amount: 200
    });
    
    // Verify all dates are different
    const dates = result.map(item => item.extracted_date);
    const uniqueDates = [...new Set(dates)];
    expect(uniqueDates).toHaveLength(10);
  });
});
