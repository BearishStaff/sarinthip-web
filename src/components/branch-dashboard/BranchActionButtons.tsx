"use client";

import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  Tag,
  Zap,
} from "lucide-react";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

type BranchActionButtonsProps = {
  branchId: string;
};

export function BranchActionButtons({ branchId }: BranchActionButtonsProps) {
  return (
    <div className="w-full max-w-md grid grid-cols-1 gap-4">
      <Link
        href={`/branch/${branchId}/entry`}
        className={`flex items-center justify-between bg-text-primary text-white p-5 rounded-2xl shadow-md hover:bg-foreground transition-all active:scale-95`}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">บันทึกรายจ่าย</p>
            <p className="text-gray-300 text-xs">
              ก๊อปวางข้อความ หรือกรอกฟอร์ม
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </Link>

      <Link
        href={`/branch/${branchId}/income`}
        className={`flex items-center justify-between ${intentColorClasses.success.bg} ${intentColorClasses.success.text} p-5 rounded-2xl shadow-md hover:bg-green-600 hover:text-white transition-all active:scale-95`}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">บันทึกรายรับ</p>
            <p className="text-xs">
              บันทึกรายรับเข้าสาขา
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5" />
      </Link>

      <Link
        href={`/branch/${branchId}/export`}
        className={`flex items-center justify-between ${appColorClasses.cardBg} border ${appColorClasses.borderSoft} p-5 rounded-2xl hover:border-brand-400 transition-all active:scale-95 shadow-sm`}
      >
        <div className="flex items-center gap-4">
          <div className={`${intentColorClasses.brand.bg} p-3 rounded-xl`}>
            <FileText className={`w-6 h-6 ${intentColorClasses.brand.text}`} />
          </div>
          <div className="text-left">
            <p className={`font-bold text-lg ${appColorClasses.textPrimary}`}>
              ออกใบรับรอง (Export)
            </p>
            <p className={`${appColorClasses.textSecondary} text-xs`}>
              สรุปรายเดือนแยกตามหมวดหมู่
            </p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 ${appColorClasses.textMuted}`} />
      </Link>

      <Link href="/categories">
        <div className="bg-linear-to-br from-brand-500 to-brand-600 p-6 rounded-3xl text-white shadow-lg shadow-brand-100 flex justify-between items-center group cursor-pointer">
          <div>
            <h3 className="text-lg font-black">สอนคำหลัก AI</h3>
            <p className="text-brand-100 text-xs">
              ตั้งค่าหมวดหมู่และ Keyword อัตโนมัติ
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
            <Tag className="w-6 h-6 text-white" />
          </div>
        </div>
      </Link>
    </div>
  );
}
