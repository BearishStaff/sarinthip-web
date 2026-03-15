import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const doc = new jsPDF();

  // Header Section
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41);
  doc.text("Expense Summary", 14, 20);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Branch: ${branchName}`, 14, 30);
  doc.text(`Period: ${monthYear}`, 14, 35);
  doc.text(`Total: THB ${grandTotal.toLocaleString()}`, 14, 40);

  // Table Body logic
  const body = reportData.map(item => [
    item.name, 
    `THB ${item.total.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Category', 'Amount']],
    body: body,
    foot: [['GRAND TOTAL', `THB ${grandTotal.toLocaleString()}`]],
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
  });

  // Save the PDF
  doc.save(`Report_${branchName}_${monthYear.replace(' ', '_')}.pdf`);
};