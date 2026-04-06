import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';
import { addSarabunFont } from '../font/Sarabun-Regular-normal.js';

export interface ReportItem {
  categoryId: string;
  name: string;
  total: number;
}

interface ExportConfig {
  title: string;
  description?: string;
  columns: { header: string; dataKey: string }[];
  data: any[];
  keepGroupTogetherBy?: string;
}

export const exportToPDF = ({ title, description, columns, data, keepGroupTogetherBy }: ExportConfig) => {
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
  const tableHead = [columns.map((col) => col.header)];
  const commonTableConfig: Pick<UserOptions, 'head' | 'styles' | 'headStyles' | 'footStyles'> = {
    head: tableHead,
    // ตั้งค่า Font สำหรับทุกส่วนของตาราง
    styles: {
      font: "Sarabun",
      fontStyle: "normal" as const, // ป้องกันการไปเรียก 'bold' ที่เราอาจไม่ได้ลงทะเบียนไว้
      fontSize: 12,
    },
    // เน้นย้ำตรงนี้: ต้องระบุ font ใน headStyles ด้วย
    headStyles: {
      font: "Sarabun",
      fontStyle: "normal" as const, // ถ้าไม่มีไฟล์ Sarabun-Bold ให้ใช้ normal แทน
      fillColor: [0, 0, 0], // ลองใส่สีเข้มดูว่าตัวหนังสือสีขาว (Default) ขึ้นไหม
      textColor: [255, 255, 255],
    },
    // ถ้ามี footer ก็ต้องใส่ด้วย
    footStyles: {
      font: "Sarabun",
      fontStyle: "normal" as const,
    },
  };

  const mapBody = (rows: any[]) => rows.map((row) =>
    columns.map((col) => row[col.dataKey] ?? '-')
  );

  let cursorY = currentY + 5;

  if (keepGroupTogetherBy) {
    const pageHeight = doc.internal.pageSize.getHeight();
    const topMargin = 14;
    const bottomMargin = 14;
    const estimatedRowHeight = 8;
    const maxRowsOnFreshPage = Math.max(
      1,
      Math.floor((pageHeight - topMargin - bottomMargin) / estimatedRowHeight) - 1
    );

    const groupedRows = new Map<string, any[]>();
    const summaryRows: any[] = [];
    const detailRows = [...data];

    while (detailRows.length > 0) {
      const lastRow = detailRows.at(-1);
      const lastGroupValue = lastRow?.[keepGroupTogetherBy];
      if (lastGroupValue !== undefined && lastGroupValue !== null && lastGroupValue !== '') break;
      summaryRows.unshift(detailRows.pop());
    }

    for (const row of detailRows) {
      const groupValue = row[keepGroupTogetherBy];
      if (groupValue === undefined || groupValue === null || groupValue === '') {
        continue;
      }
      const key = String(groupValue);
      if (!groupedRows.has(key)) groupedRows.set(key, []);
      groupedRows.get(key)!.push(row);
    }

    const pagesWithHeader = new Set<number>();

    const renderChunk = (rows: any[]) => {
      const currentPage = doc.getCurrentPageInfo().pageNumber;
      const shouldShowHead = !pagesWithHeader.has(currentPage);

      autoTable(doc, {
        ...commonTableConfig,
        startY: cursorY,
        body: mapBody(rows),
        showHead: shouldShowHead ? "everyPage" : "never",
      });
      cursorY = (doc as any).lastAutoTable.finalY + 2;

      const endPage = doc.getCurrentPageInfo().pageNumber;
      if (shouldShowHead) {
        for (let page = currentPage; page <= endPage; page += 1) {
          pagesWithHeader.add(page);
        }
      } else {
        pagesWithHeader.add(currentPage);
      }
    };

    let isFirstGroup = true;
    for (const rows of groupedRows.values()) {
      const rowsNeededToKeepTogether = Math.min(rows.length, maxRowsOnFreshPage);
      const requiredHeight = (rowsNeededToKeepTogether + 1) * estimatedRowHeight; // +1 for table head
      const remainingHeight = pageHeight - bottomMargin - cursorY;

      if (!isFirstGroup && requiredHeight > remainingHeight) {
        doc.addPage();
        cursorY = topMargin;
      }

      renderChunk(rows);
      isFirstGroup = false;
    }

    if (summaryRows.length > 0) {
      const summaryRequiredHeight = (summaryRows.length + 1) * estimatedRowHeight; // +1 for table head
      const remainingHeight = pageHeight - bottomMargin - cursorY;
      if (summaryRequiredHeight > remainingHeight) {
        doc.addPage();
        cursorY = topMargin;
      }
      renderChunk(summaryRows);
    }
  } else {
    autoTable(doc, {
      ...commonTableConfig,
      startY: cursorY,
      body: mapBody(data),
    });
  }

  doc.save(`${title}.pdf`);
};
