'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  PlusCircle, 
  FileText, 
  ChevronRight, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function BranchDashboard() {
  const params = useParams();
  const router = useRouter();
  const branchId = params.id;

  // ในอนาคตดึงชื่อสาขาและยอดรวมจาก Golang API
  const branchName = "ศรีนทิพย์ 1"; 
  const monthlyTotal = 35420;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-6 font-sans">
      
      {/* Header Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button 
          onClick={() => router.push('/')}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{branchName}</h1>
        <div className="w-10"></div> {/* Spacer balance */}
      </div>

      {/* Monthly Summary Card (ตามภาพที่ 2 ใน Wireframe) */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">รายจ่ายรวมเดือนนี้</p>
            <h2 className="text-3xl font-black text-gray-900">
              ฿{monthlyTotal.toLocaleString()}
            </h2>
          </div>
          <div className="bg-green-100 p-2 rounded-xl">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-2xl">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
          <span>ประจำเดือน มีนาคม 2569</span>
        </div>
      </div>

      {/* Main Actions Grid (ปุ่ม บันทึก และ Export) */}
      <div className="w-full max-w-md grid grid-cols-1 gap-4">
        
        {/* ปุ่มบันทึก (ไปยังหน้า Smart Input/Form) */}
        <Link
          href={`/branch/${branchId}/entry`}
          className="flex items-center justify-between bg-gray-900 text-white p-5 rounded-2xl shadow-lg hover:bg-black transition-all active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">บันทึกรายจ่าย</p>
              <p className="text-gray-400 text-xs">ก๊อปวางข้อความ หรือกรอกฟอร์ม</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </Link>

        {/* ปุ่ม Export (ไปยังหน้าออกรายงาน PDF) */}
        <Link
          href={`/branch/${branchId}/export`}
          className="flex items-center justify-between bg-white border border-gray-200 p-5 rounded-2xl hover:border-blue-500 transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg text-gray-800">ออกใบรับรอง (Export)</p>
              <p className="text-gray-500 text-xs">สรุปรายเดือนแยกตามหมวดหมู่</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </Link>

      </div>

      {/* Recent Activity (Optional - เพื่อความครบถ้วน) */}
      <div className="w-full max-w-md mt-10">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 px-2">รายการล่าสุด</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 text-sm">ลูกชิ้นเนื้อ 3 กก.</span>
                <span className="text-xs text-gray-400">27/02/2569</span>
              </div>
              <span className="font-bold text-gray-900">฿660</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}