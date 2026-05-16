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

const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 60;
const HEADER_HEIGHT = 110;
const TABLE_HEADER_HEIGHT = 30;
const DATE_HEADER_HEIGHT = 25;
const ROW_HEIGHT = 22;
const SIGNATURE_HEIGHT = 70;
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_MARGIN - HEADER_HEIGHT - TABLE_HEADER_HEIGHT - SIGNATURE_HEIGHT;

Font.register({
  family: 'Sarabun',
  src: '/font/Sarabun/Sarabun-Regular.ttf'
});

Font.register({
  family: 'Sarabun-Bold',
  src: '/font/Sarabun/Sarabun-Regular.ttf'
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Sarabun',
    fontSize: 12,
    padding: 30,
    lineHeight: 1.4
  },
  // Header
  header: {
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 8,
    marginBottom: 10
  },
  branchName: {
    fontFamily: 'Sarabun-Bold',
    fontSize: 17,
    color: '#1a1714'
  },
  receiptTitle: {
    fontFamily: 'Sarabun-Bold',
    fontSize: 14,
    marginTop: 3
  },
  headerSub: {
    fontSize: 11,
    color: '#666',
    marginTop: 2
  },
  pageNumber: {
    fontSize: 10,
    color: '#999',
    marginTop: 2
  },
  // Table wrapper — provides left + top outer border
  tableWrapper: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#000'
  },
  tableRow: {
    flexDirection: 'row'
  },
  // Each cell provides right + bottom border
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: '5 8',
    fontSize: 12
  },
  headerCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: '5 8',
    fontSize: 11,
    fontFamily: 'Sarabun-Bold',
    backgroundColor: '#f5f5f5',
    textAlign: 'center'
  },
  // Column widths
  colItem: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colUnit: { flex: 2, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },
  // Date spanning row (flex: 1 takes full width)
  dateRow: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: '5 8',
    backgroundColor: '#f8f8f8',
    fontSize: 11,
    fontFamily: 'Sarabun-Bold'
  },
  // Summary row
  summaryLabel: {
    flex: 9,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    borderTopWidth: 2,
    borderTopColor: '#333',
    padding: '5 8',
    fontFamily: 'Sarabun-Bold',
    textAlign: 'right',
    backgroundColor: '#f0f0f0'
  },
  summaryAmount: {
    flex: 2,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    borderTopWidth: 2,
    borderTopColor: '#333',
    padding: '5 8',
    fontFamily: 'Sarabun-Bold',
    textAlign: 'right',
    backgroundColor: '#f0f0f0'
  },
  // Signature
  signatureRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 28
  },
  signatureBlock: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 6,
    alignItems: 'center'
  },
  signatureSpace: {
    fontSize: 12,
    marginBottom: 20
  },
  signatureLabel: {
    fontSize: 12
  }
});

interface ExpenseReportPDFProps {
  branchName: string;
  month: string;
  categoryName?: string;
  reportItems: ReportItem[];
  totalExpenses: number;
  totalIncome?: number;
  netAmount?: number;
  detailedExpenses?: DetailedExpenseItem[];
}

export const ExpenseReportPDF: React.FC<ExpenseReportPDFProps> = ({
  branchName,
  month,
  categoryName,
  totalExpenses,
  detailedExpenses = []
}) => {
  const fmt = (n: number) =>
    n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const groupExpensesByDate = (expenses: DetailedExpenseItem[]) => {
    const grouped = expenses.reduce((acc, expense) => {
      const date = expense.entry_date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(expense);
      return acc;
    }, {} as Record<string, DetailedExpenseItem[]>);

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, items]) => ({ date, items }));
  };

  const splitIntoPages = (dateGroups: { date: string; items: DetailedExpenseItem[] }[]) => {
    const pages: { dateGroups: { date: string; items: DetailedExpenseItem[] }[] }[] = [];
    let currentPage: { dateGroups: { date: string; items: DetailedExpenseItem[] }[] } = { dateGroups: [] };
    let currentHeight = 0;

    for (const dateGroup of dateGroups) {
      const dateGroupHeight = DATE_HEADER_HEIGHT + dateGroup.items.length * ROW_HEIGHT;
      if (currentHeight + dateGroupHeight > AVAILABLE_HEIGHT && currentPage.dateGroups.length > 0) {
        pages.push(currentPage);
        currentPage = { dateGroups: [dateGroup] };
        currentHeight = dateGroupHeight;
      } else {
        currentPage.dateGroups.push(dateGroup);
        currentHeight += dateGroupHeight;
      }
    }

    if (currentPage.dateGroups.length > 0) pages.push(currentPage);
    return pages;
  };

  const dateGroups = detailedExpenses.length > 0 ? groupExpensesByDate(detailedExpenses) : [];
  const pages = dateGroups.length > 0 ? splitIntoPages(dateGroups) : [{ dateGroups: [] }];
  const totalPages = pages.length;

  const headerSub = [categoryName, month].filter(Boolean).join(' · ');

  return (
    <Document>
      {pages.map((page, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.branchName}>{branchName}</Text>
            <Text style={styles.receiptTitle}>ใบแทนใบเสร็จรับเงิน</Text>
            {headerSub ? <Text style={styles.headerSub}>{headerSub}</Text> : null}
            {totalPages > 1 && (
              <Text style={styles.pageNumber}>หน้า {pageIndex + 1} จาก {totalPages}</Text>
            )}
          </View>

          {/* Table */}
          <View style={styles.tableWrapper}>
            {/* Table header row */}
            <View style={styles.tableRow}>
              <View style={[styles.headerCell, styles.colItem]}><Text>รายการ</Text></View>
              <View style={[styles.headerCell, styles.colQty]}><Text>จำนวน</Text></View>
              <View style={[styles.headerCell, styles.colUnit]}><Text>หน่วย</Text></View>
              <View style={[styles.headerCell, styles.colPrice]}><Text>ราคา/หน่วย</Text></View>
              <View style={[styles.headerCell, styles.colTotal]}><Text>ยอดรวม</Text></View>
            </View>

            {/* Date groups */}
            {page.dateGroups.map((dateGroup, di) => (
              <View key={di}>
                {/* Date spanning row */}
                <View style={styles.tableRow}>
                  <View style={styles.dateRow}>
                    <Text>{formatThaiDate(dateGroup.date)}</Text>
                  </View>
                </View>

                {/* Expense items */}
                {dateGroup.items.map((expense) => (
                  <View key={expense.id} style={styles.tableRow}>
                    <View style={[styles.cell, styles.colItem]}><Text>{expense.item_name}</Text></View>
                    <View style={[styles.cell, styles.colQty]}><Text>{expense.qty}</Text></View>
                    <View style={[styles.cell, styles.colUnit]}><Text>{expense.unit}</Text></View>
                    <View style={[styles.cell, styles.colPrice]}><Text>{fmt(expense.price_per_unit)}</Text></View>
                    <View style={[styles.cell, styles.colTotal]}><Text>{fmt(expense.total_amount)}</Text></View>
                  </View>
                ))}
              </View>
            ))}

            {/* Summary row — last page only */}
            {pageIndex === totalPages - 1 && (
              <View style={styles.tableRow}>
                <View style={styles.summaryLabel}><Text>ยอดรวมทั้งหมด</Text></View>
                <View style={styles.summaryAmount}><Text>{fmt(totalExpenses)}</Text></View>
              </View>
            )}
          </View>

          {/* Signature section — last page only */}
          {pageIndex === totalPages - 1 && (
            <View style={styles.signatureRow}>
              {['ผู้จัดทำ', 'ผู้อนุมัติ'].map((label) => (
                <View key={label} style={styles.signatureBlock}>
                  <Text style={styles.signatureSpace}> </Text>
                  <Text style={styles.signatureLabel}>{label}</Text>
                </View>
              ))}
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};
