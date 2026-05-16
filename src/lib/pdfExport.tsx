import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ExpenseReportPDF } from '../components/pdf/ExpenseReportPDF';
import { ReportItem } from './calculations';

export interface DetailedExpenseItem {
  id: string;
  item_name: string;
  qty: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  entry_date: string;
  billing_date?: string;
  category_name: string;
}

export interface PDFExportConfig {
  title: string;
  branchName: string;
  month: string;
  categoryName?: string;
  reportItems: ReportItem[];
  totalExpenses: number;
  totalIncome?: number;
  netAmount?: number;
  detailedExpenses?: DetailedExpenseItem[];
}

export const exportToPDF = async (config: PDFExportConfig): Promise<void> => {
  try {
    const doc = React.createElement(ExpenseReportPDF, config);
    const asPdf = pdf(doc as any);
    
    // สร้าง blob และดาวน์โหลด
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    
    // สร้าง link สำหรับดาวน์โหลด
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.title}.pdf`;
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
    const doc = React.createElement(ExpenseReportPDF, config);
    const asPdf = pdf(doc as any);
    return await asPdf.toBlob();
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw new Error('ไม่สามารถสร้างไฟล์ PDF ได้');
  }
};
