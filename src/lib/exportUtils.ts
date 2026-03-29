import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addSarabunFont } from '../font/Sarabun-Regular-normal.js';

export interface ReportItem {
  name: string;
  total: number;
}

export const generateExpensePDF = (
  branchName: string,
  reportData: ReportItem[],
  grandTotal: number,
  monthYear: string
) => {
  const branchData = [
    { date: "26/03/2026", item: 'เนื้อสับ', amount: '150' },
    { date: "26/03/2026", item: 'ลูกชิ้นเนื้อ', amount: '200' },
    { date: "27/03/2026", item: 'ลูกชิ้นเนื้อ', amount: '200' },
    { date: "28/03/2026", item: 'ลูกชิ้นเนื้อ', amount: '200' },
  ];

  const branchColumns = [
    { header: 'วันที่', dataKey: 'date' },
    { header: 'รายการ', dataKey: 'item' },
    { header: 'ราคา (บาท)', dataKey: 'amount' },
  ];
  exportToPDF({
    title: 'รายงานสาขาทั้งหมด',
    columns: branchColumns,
    data: branchData
  });
};

interface ExportConfig {
  title: string;
  columns: { header: string; dataKey: string }[];
  data: any[];
}

export const exportToPDF = ({ title, columns, data }: ExportConfig) => {
  const doc = new jsPDF();

  // 1. ลงทะเบียนฟอนต์
  addSarabunFont(doc);
  
  // ตั้งค่า Font หลักให้กับตัวเอกสาร
  doc.setFont("Sarabun", "normal");

  // 2. แสดงหัวข้อ (ใส่ฟอนต์ให้ชัวร์ก่อนสั่งเขียน text)
  doc.text(title, 14, 15);

  // 3. Render ตาราง
  autoTable(doc, {
    startY: 20,
    head: [columns.map((col) => col.header)],
    body: data.map((row) => columns.map((col) => row[col.dataKey])),
    
    // ตั้งค่า Font สำหรับทุกส่วนของตาราง
    styles: {
      font: "Sarabun",
      fontStyle: "normal", // ป้องกันการไปเรียก 'bold' ที่เราอาจไม่ได้ลงทะเบียนไว้
      fontSize: 12,
    },
    
    // เน้นย้ำตรงนี้: ต้องระบุ font ใน headStyles ด้วย
    headStyles: { 
      font: "Sarabun", 
      fontStyle: "normal", // ถ้าไม่มีไฟล์ Sarabun-Bold ให้ใช้ normal แทน
      fillColor: [0, 0, 0], // ลองใส่สีเข้มดูว่าตัวหนังสือสีขาว (Default) ขึ้นไหม
      textColor: [255, 255, 255]
    },
    
    // ถ้ามี footer ก็ต้องใส่ด้วย
    footStyles: {
      font: "Sarabun",
      fontStyle: "normal",
    }
  });

  doc.save(`${title}.pdf`);
};