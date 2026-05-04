"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteBranch, deleteBranchWithAllData } from "../actions/branchActions";
import { appColorClasses } from "@/src/lib/colors";

interface DeleteBranchDialogProps {
  branchId: string;
  branchName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteBranchDialog({ 
  branchId, 
  branchName, 
  isOpen, 
  onClose, 
  onSuccess 
}: DeleteBranchDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSoftDelete() {
    setIsLoading(true);
    setMessage("");

    const result = await deleteBranch(branchId);
    
    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage("✅ ลบสาขาเรียบร้อยแล้ว");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }
    
    setIsLoading(false);
  }

  async function handleCascadeDelete() {
    setIsLoading(true);
    setMessage("");

    const result = await deleteBranchWithAllData(branchId);
    
    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage("✅ ลบสาขาและข้อมูลทั้งหมดเรียบร้อยแล้ว");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }
    
    setIsLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            ยืนยันการลบสาขา
          </h2>
          
          <p className="text-gray-600">
            คุณต้องการลบสาขา <span className="font-semibold">"{branchName}"</span> หรือไม่?
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">เลือกวิธีการลบ:</p>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>ลบเฉพาะสาขา:</strong> ข้อมูลธุรกรรมจะถูกเก็บไว้แต่ไม่สามารถเข้าถึงได้</li>
                  <li>• <strong>ลบข้อมูลทั้งหมด:</strong> ลบสาขาและข้อมูลธุรกรรมทั้งหมด (รายรับ, รายจ่าย, บิล)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSoftDelete}
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "กำลังดำเนินการ..." : "ลบเฉพาะสาขา"}
            </button>
            
            <button
              onClick={handleCascadeDelete}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "กำลังดำเนินการ..." : "ลบข้อมูลทั้งหมด"}
            </button>
            
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ยกเลิก
            </button>
          </div>
        </div>

        {message && (
          <p className={`text-sm text-center ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
