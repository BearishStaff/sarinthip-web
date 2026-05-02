import { pdf } from '@react-pdf/renderer';
import { ExpenseReportPDF } from '@/src/components/pdf/ExpenseReportPDF';
import { ReportItem } from '@/src/lib/calculations';

export interface PDFExportConfig {
  branchName: string;
  month: string;
  reportItems: ReportItem[];
  totalExpenses: number;
  totalIncome?: number;
  netAmount?: number;
}

export const exportToPDF = async (config: PDFExportConfig): Promise<void> => {
  try {
    const doc = <ExpenseReportPDF {...config} />;
    const asPdf = pdf(doc);
    
    // สร้าง blob และดาวน์โหลด
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    
    // สร้าง link สำหรับดาวน์โหลด
    const link = document.createElement('a');
    link.href = url;
    link.download = `รายงานค่าใช้จ่าย_${config.branchName}_${config.month}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // ล้าง URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('ไม่สามารถสร้างไฟล์ PDF ได้');
  }
};

export const generatePDFBlob = async (config: PDFExportConfig): Promise<Blob> => {
  try {
    const doc = <ExpenseReportPDF {...config} />;
    const asPdf = pdf(doc);
    return await asPdf.toBlob();
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw new Error('ไม่สามารถสร้างไฟล์ PDF ได้');
  }
};
