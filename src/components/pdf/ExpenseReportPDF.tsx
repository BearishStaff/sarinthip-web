import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font
} from '@react-pdf/renderer';
import { ReportItem } from '@/src/lib/calculations';
import { DetailedExpenseItem } from '@/src/lib/pdfExport';

// Constants for page layout calculations
const PAGE_HEIGHT = 842; // A4 height in points
const PAGE_MARGIN = 60; // Top + bottom margins
const HEADER_HEIGHT = 120; // Approximate header height
const FOOTER_HEIGHT = 50; // Approximate footer height
const TABLE_HEADER_HEIGHT = 40; // Table header height
const DATE_HEADER_HEIGHT = 30; // Date header height
const ROW_HEIGHT = 25; // Approximate row height
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_MARGIN - HEADER_HEIGHT - FOOTER_HEIGHT;

// ลงทะเบียนฟอนต์ภาษาไทย
Font.register({
  family: 'Sarabun',
  src: '/font/Sarabun/Sarabun-Regular.ttf'
});

Font.register({
  family: 'Sarabun-Bold',
  src: '/font/Sarabun/Sarabun-Regular.ttf' // Use regular font for bold since bold version doesn't exist
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Sarabun',
    fontSize: 12,
    padding: 30,
    lineHeight: 1.5
  },
  title: {
    fontFamily: 'Sarabun-Bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666'
  },
  section: {
    marginBottom: 20
  },
  tableHeader: {
    fontFamily: 'Sarabun-Bold',
    backgroundColor: '#f0f0f0',
    padding: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#ddd'
  },
  categoryName: {
    flex: 3
  },
  amountCell: {
    flex: 2,
    textAlign: 'right'
  },
  dateCell: {
    flex: 2
  },
  itemNameCell: {
    flex: 4
  },
  qtyCell: {
    flex: 1,
    textAlign: 'center'
  },
  unitCell: {
    flex: 2,
    textAlign: 'center'
  },
  priceCell: {
    flex: 2,
    textAlign: 'right'
  },
  totalCell: {
    flex: 2,
    textAlign: 'right'
  },
  dateHeader: {
    fontFamily: 'Sarabun-Bold',
    backgroundColor: '#f8f8f8',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 15,
    marginBottom: 5
  },
  summaryRow: {
    fontFamily: 'Sarabun-Bold',
    backgroundColor: '#f9f9f9',
    borderTopWidth: 2,
    borderTopColor: '#333'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666'
  }
});

interface ExpenseReportPDFProps {
  branchName: string;
  month: string;
  reportItems: ReportItem[];
  totalExpenses: number;
  totalIncome?: number;
  netAmount?: number;
  detailedExpenses?: DetailedExpenseItem[];
}

export const ExpenseReportPDF: React.FC<ExpenseReportPDFProps> = ({
  branchName,
  month,
  reportItems,
  totalExpenses,
  totalIncome = 0,
  netAmount = 0,
  detailedExpenses = []
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' บาท';
  };

  const formatDate = (dateString: string) => {
    // The month string is already in the correct format (e.g., "มกราคม 2026")
    // No need to parse it as a Date, just return it directly
    return dateString;
  };

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Group expenses by date
  const groupExpensesByDate = (expenses: DetailedExpenseItem[]) => {
    const grouped = expenses.reduce((acc, expense) => {
      const date = expense.entry_date.split('T')[0]; // Get date part only
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(expense);
      return acc;
    }, {} as Record<string, DetailedExpenseItem[]>);

    // Sort dates and return as array
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => a.item_name.localeCompare(b.item_name))
      }));
  };

  // Split date groups into pages
  const splitIntoPages = (dateGroups: { date: string; items: DetailedExpenseItem[] }[]) => {
    const pages: { dateGroups: { date: string; items: DetailedExpenseItem[] }[] }[] = [];
    let currentPage: { dateGroups: { date: string; items: DetailedExpenseItem[] }[] } = { dateGroups: [] };
    let currentHeight = TABLE_HEADER_HEIGHT;

    for (const dateGroup of dateGroups) {
      const dateGroupHeight = DATE_HEADER_HEIGHT + (dateGroup.items.length * ROW_HEIGHT);
      
      // If this date group doesn't fit on current page, start a new page
      if (currentHeight + dateGroupHeight > AVAILABLE_HEIGHT && currentPage.dateGroups.length > 0) {
        pages.push(currentPage);
        currentPage = { dateGroups: [dateGroup] };
        currentHeight = TABLE_HEADER_HEIGHT + dateGroupHeight;
      } else {
        currentPage.dateGroups.push(dateGroup);
        currentHeight += dateGroupHeight;
      }
    }

    // Add the last page if it has content
    if (currentPage.dateGroups.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  // Split data into pages
  const dateGroups = detailedExpenses && detailedExpenses.length > 0 
    ? groupExpensesByDate(detailedExpenses) 
    : [];
  const pages = splitIntoPages(dateGroups);

  return (
    <Document>
      {detailedExpenses && detailedExpenses.length > 0 ? (
        // Multiple pages for detailed expenses
        pages.map((page, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.section}>
              <Text style={styles.title}>รายงานสรุปค่าใช้จ่ายรายเดือน</Text>
              <Text style={styles.subtitle}>สาขา: {branchName}</Text>
              <Text style={styles.subtitle}>ประจำเดือน {formatDate(month)}</Text>
              {pages.length > 1 && (
                <Text style={styles.subtitle}>หน้า {pageIndex + 1} จาก {pages.length}</Text>
              )}
            </View>

            {/* Detailed Expense Breakdown */}
            <View style={styles.section}>
              <Text style={{ fontFamily: 'Sarabun-Bold', marginBottom: 10 }}>
                รายละเอียดค่าใช้จ่ายแยกตามวัน
              </Text>
              
              {/* Detailed Table Header */}
              <View style={styles.tableHeader}>
                <View style={[styles.tableCell, styles.dateCell]}>
                  <Text>วันที่</Text>
                </View>
                <View style={[styles.tableCell, styles.itemNameCell]}>
                  <Text>รายการ</Text>
                </View>
                <View style={[styles.tableCell, styles.qtyCell]}>
                  <Text>จำนวน</Text>
                </View>
                <View style={[styles.tableCell, styles.unitCell]}>
                  <Text>หน่วย</Text>
                </View>
                <View style={[styles.tableCell, styles.priceCell]}>
                  <Text>ราคา/หน่วย</Text>
                </View>
                <View style={[styles.tableCell, styles.totalCell]}>
                  <Text>จำนวนเงิน</Text>
                </View>
              </View>
              
              {/* Group expenses by date for this page */}
              {page.dateGroups.map((dateGroup, dateIndex) => (
                <View key={dateIndex}>
                  {/* Date Header */}
                  <View style={styles.dateHeader}>
                    <Text>{formatThaiDate(dateGroup.date)}</Text>
                  </View>
                  
                  {/* Expense items for this date */}
                  {dateGroup.items.map((expense, itemIndex) => (
                    <View key={expense.id} style={styles.tableRow}>
                      <View style={[styles.tableCell, styles.dateCell]}>
                        <Text></Text>
                      </View>
                      <View style={[styles.tableCell, styles.itemNameCell]}>
                        <Text>{expense.item_name}</Text>
                      </View>
                      <View style={[styles.tableCell, styles.qtyCell]}>
                        <Text>{expense.qty}</Text>
                      </View>
                      <View style={[styles.tableCell, styles.unitCell]}>
                        <Text>{expense.unit}</Text>
                      </View>
                      <View style={[styles.tableCell, styles.priceCell]}>
                        <Text>{formatCurrency(expense.price_per_unit)}</Text>
                      </View>
                      <View style={[styles.tableCell, styles.totalCell]}>
                        <Text>{formatCurrency(expense.total_amount)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
              
              {/* Grand Total - only on last page */}
              {pageIndex === pages.length - 1 && (
                <View style={[styles.tableRow, styles.summaryRow]}>
                  <View style={[styles.tableCell, styles.dateCell]}>
                    <Text>รวมทั้งหมด</Text>
                  </View>
                  <View style={[styles.tableCell, styles.itemNameCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, styles.qtyCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, styles.unitCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, styles.priceCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, styles.totalCell]}>
                    <Text>{formatCurrency(totalExpenses)}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Income Summary (if available) - only on last page */}
            {totalIncome > 0 && pageIndex === pages.length - 1 && (
              <View style={styles.section}>
                <Text style={{ fontFamily: 'Sarabun-Bold', marginBottom: 10 }}>
                  สรุปรายรับ
                </Text>
                <View style={[styles.tableRow, styles.summaryRow]}>
                  <View style={[styles.tableCell, styles.categoryName]}>
                    <Text>รวมรายรับทั้งหมด</Text>
                  </View>
                  <View style={[styles.tableCell, styles.amountCell]}>
                    <Text>{formatCurrency(totalIncome)}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Footer */}
            <Text style={styles.footer}>
              รายงานนี้จัดทำเมื่อ {new Date().toLocaleDateString('th-TH')} | 
              ระบบบัญชีรายรับ-รายจ่ายแยกสาขา
            </Text>
          </Page>
        ))
      ) : (
        // Single page for summary view
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.section}>
            <Text style={styles.title}>รายงานสรุปค่าใช้จ่ายรายเดือน</Text>
            <Text style={styles.subtitle}>สาขา: {branchName}</Text>
            <Text style={styles.subtitle}>ประจำเดือน {formatDate(month)}</Text>
          </View>

          {/* Fallback: Show simple summary if no detailed data */}
          <View style={styles.section}>
            <Text style={{ fontFamily: 'Sarabun-Bold', marginBottom: 10 }}>
              สรุปค่าใช้จ่ายแยกตามหมวดหมู่
            </Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={[styles.tableCell, styles.categoryName]}>
                <Text>หมวดหมู่</Text>
              </View>
              <View style={[styles.tableCell, styles.amountCell]}>
                <Text>จำนวนเงิน</Text>
              </View>
            </View>
            
            {/* Table Body */}
            {reportItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.categoryName]}>
                  <Text>{item.name}</Text>
                </View>
                <View style={[styles.tableCell, styles.amountCell]}>
                  <Text>{formatCurrency(item.total)}</Text>
                </View>
              </View>
            ))}
            
            {/* Summary Row */}
            <View style={[styles.tableRow, styles.summaryRow]}>
              <View style={[styles.tableCell, styles.categoryName]}>
                <Text>รวมค่าใช้จ่ายทั้งหมด</Text>
              </View>
              <View style={[styles.tableCell, styles.amountCell]}>
                <Text>{formatCurrency(totalExpenses)}</Text>
              </View>
            </View>
          </View>

          {/* Income Summary (if available) */}
          {totalIncome > 0 && (
            <View style={styles.section}>
              <Text style={{ fontFamily: 'Sarabun-Bold', marginBottom: 10 }}>
                สรุปรายรับ
              </Text>
              <View style={[styles.tableRow, styles.summaryRow]}>
                <View style={[styles.tableCell, styles.categoryName]}>
                  <Text>รวมรายรับทั้งหมด</Text>
                </View>
                <View style={[styles.tableCell, styles.amountCell]}>
                  <Text>{formatCurrency(totalIncome)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Footer */}
          <Text style={styles.footer}>
            รายงานนี้จัดทำเมื่อ {new Date().toLocaleDateString('th-TH')} | 
            ระบบบัญชีรายรับ-รายจ่ายแยกสาขา
          </Text>
        </Page>
      )}
    </Document>
  );
};
