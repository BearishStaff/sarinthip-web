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

// ลงทะเบียนฟอนต์ภาษาไทย (ต้องมีไฟล์ฟอนต์)
Font.register({
  family: 'Sarabun',
  src: '/fonts/Sarabun-Regular.ttf'
});

Font.register({
  family: 'Sarabun-Bold',
  src: '/fonts/Sarabun-Bold.ttf'
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
    flex: 1
  },
  tableCell: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  textRight: {
    textAlign: 'right'
  },
  summaryRow: {
    fontFamily: 'Sarabun-Bold',
    backgroundColor: '#f9f9f9'
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

interface MonthlyReportPDFProps {
  branchName: string;
  month: string;
  reportItems: ReportItem[];
  totalExpenses: number;
  totalIncome?: number;
  netAmount?: number;
}

export const MonthlyReportPDF: React.FC<MonthlyReportPDFProps> = ({
  branchName,
  month,
  reportItems,
  totalExpenses,
  totalIncome = 0,
  netAmount = 0
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' บาท';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.title}>รายงานสรุปค่าใช้จ่ายรายเดือน</Text>
          <Text style={styles.subtitle}>สาขา: {branchName}</Text>
          <Text style={styles.subtitle}>ประจำเดือน {formatDate(month)}</Text>
        </View>

        {/* Expense Summary Table */}
        <View style={styles.section}>
          <Text style={{ fontFamily: 'Sarabun-Bold', marginBottom: 10 }}>
            สรุปค่าใช้จ่ายแยกตามหมวดหมู่
          </Text>
          
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>หมวดหมู่</Text>
              <Text style={[styles.tableHeader, styles.textRight]}>จำนวนเงิน</Text>
            </View>
            {reportItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {item.name}
                </Text>
                <Text style={[styles.tableCell, styles.textRight]}>
                  {formatCurrency(item.total)}
                </Text>
              </View>
            ))}
            <View style={[styles.tableRow, styles.summaryRow]}>
              <Text style={[styles.tableCell, { fontFamily: 'Sarabun-Bold' }]}>
                รวมค่าใช้จ่ายทั้งหมด
              </Text>
              <Text style={[styles.tableCell, styles.textRight, { fontFamily: 'Sarabun-Bold' }]}>
                {formatCurrency(totalExpenses)}
              </Text>
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
              <Text style={[styles.tableCell, { fontFamily: 'Sarabun-Bold' }]}>
                รวมรายรับทั้งหมด
              </Text>
              <Text style={[styles.tableCell, styles.textRight, { fontFamily: 'Sarabun-Bold' }]}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
          </View>
        )}

        {/* Net Summary */}
        <View style={styles.section}>
          <Text style={{ fontFamily: 'Sarabun-Bold', marginBottom: 10 }}>
            สรุปยอดสุทธิ
          </Text>
          <View style={[styles.tableRow, styles.summaryRow]}>
            <Text style={[styles.tableCell, { fontFamily: 'Sarabun-Bold' }]}>
              รายรับสุทธิ (รายรับ - รายจ่าย)
            </Text>
            <Text 
              style={[
                styles.tableCell, 
                styles.textRight,
                { fontFamily: 'Sarabun-Bold', color: netAmount >= 0 ? '#2e7d32' : '#c62828' }
              ]}
            >
              {formatCurrency(netAmount)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          รายงานนี้จัดทำเมื่อ {new Date().toLocaleDateString('th-TH')} | 
          ระบบบัญชีรายรับ-รายจ่ายแยกสาขา
        </Text>
      </Page>
    </Document>
  );
};
