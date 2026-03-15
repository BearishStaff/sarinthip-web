"use client";

import { useMonthlyReport } from "@/src/hooks/useMonthlyReport";
import { FileText, Download, Share2, ArrowLeft } from "lucide-react";
import { generateExpensePDF } from "@/src/lib/exportUtils";
import { useRouter } from "next/navigation";

type Props = {
  branchId: string;
};

export default function ExportReportContainer({ branchId }: Props) {
  const { data: report } = useMonthlyReport(branchId as string, 3, 2026);
  const router = useRouter();
  const grandTotal =
    report?.reduce((sum, item) => sum + (item.total as number), 0) || 0;

  const handleDownload = () => {
    generateExpensePDF(
      "Srinathip 1", // You can pass the real branch name here
      report || [],
      grandTotal,
      "March 2026",
    );
  };

  const handleShare = async () => {
    const shareData = {
      title: `รายงานสรุปยอดจ่าย - ${branchId}`,
      text: `สรุปยอดรายจ่ายเดือนมีนาคม: ฿${grandTotal.toLocaleString()}`,
      url: globalThis.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.text);
        alert("คัดลอกสรุปรายงานไปยัง Clipboard แล้ว!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-black mb-6 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 mr-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <FileText className="w-6 h-6 text-blue-600" />
          สรุปรายงานประจำเดือน
        </h1>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="text-center pb-6 border-b border-dashed">
            <p className="text-sm font-bold text-gray-400 uppercase">
              ยอดใช้จ่ายรวม (มีนาคม 2569)
            </p>
            <h2 className="text-4xl font-black text-gray-900 mt-1">
              ฿{grandTotal.toLocaleString()}
            </h2>
          </div>

          <div className="py-6 space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              แยกตามหมวดหมู่
            </p>
            {report?.map((item: any) => (
              <div
                key={item.name}
                className="flex justify-between items-center"
              >
                <span className="text-gray-600 font-medium">{item.name}</span>
                <span className="font-bold text-gray-900">
                  ฿{item.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={handleDownload}
              className="w-full h-14 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Download className="w-5 h-5" /> ดาวน์โหลด PDF
            </button>
            <button
              onClick={handleShare}
              className="w-full h-14 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" /> แชร์รายงาน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
