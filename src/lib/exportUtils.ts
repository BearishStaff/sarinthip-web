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
    title: 'ใบรับรองแทนใบเสร็จ',
    description: `สาขา ${branchName} - รายงานค่าใช้จ่ายประจำเดือน ${monthYear} - ยอดรวม ${grandTotal} บาท`,
    columns: branchColumns,
    data: branchData
  });
};

interface ExportConfig {
  title: string;
  description?: string;
  columns: { header: string; dataKey: string }[];
  data: any[];
}

export const exportToPDF = ({ title, description, columns, data }: ExportConfig) => {
  const doc = new jsPDF();

  // 1. ลงทะเบียนฟอนต์
  addSarabunFont(doc);

  // ตั้งค่า Font หลักให้กับตัวเอกสาร
  doc.setFont("Sarabun", "normal");

  // --- ส่วนของ Header (Title & Description) ---
  let currentY = 15; // จุดเริ่มแนวตั้ง

  // วาด Title (ตัวใหญ่หน่อย)
  doc.setFontSize(18);
  doc.text(title, 14, currentY);

  // ถ้ามีการส่ง description มา ให้วาดเพิ่มใต้ Title
  if (description) {
    currentY += 10; // ขยับลงมา 10 หน่วย
    doc.setFontSize(12); // ปรับขนาดตัวอักษรเล็กลงสำหรับบรรยาย
    doc.setTextColor(100); // ปรับสีเป็นสีเทา (Optional)

    // ใช้ splitTextToSize กรณีที่ description ยาวเกินหน้ากระดาษ
    const splitDesc = doc.splitTextToSize(description, 180);
    doc.text(splitDesc, 14, currentY);

    // คำนวณตำแหน่ง Y ใหม่ตามจำนวนบรรทัดของ description
    currentY += (splitDesc.length * 7);
  }

  // กลับมาตั้งค่าสีตัวอักษรเป็นสีดำก่อนวาดตาราง
  doc.setTextColor(0);
  // 3. Render ตาราง
  autoTable(doc, {
    startY: currentY + 5,
    head: [columns.map((col) => col.header)],
    body: data.map((row) =>
      columns.map((col) => row[col.dataKey] ?? '-')
    ),
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

function fixThaiScript(arg0: any): any {
  throw new Error('Function not implemented.');
}
