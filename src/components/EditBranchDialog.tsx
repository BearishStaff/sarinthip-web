"use client";

import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { updateBranchName } from "../actions/branchActions";
import { appColorClasses } from "@/src/lib/colors";

interface EditBranchDialogProps {
  branchId: string;
  branchName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBranchDialog({ 
  branchId, 
  branchName, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditBranchDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ name: branchName });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const form = new FormData();
    form.append("name", formData.name);

    const result = await updateBranchName(branchId, form);
    
    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage("✅ แก้ไขชื่อสาขาเรียบร้อยแล้ว");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }
    
    setIsLoading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ name: e.target.value });
    setMessage("");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Edit className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            แก้ไขชื่อสาขา
          </h2>
          
          <p className="text-gray-600">
            แก้ไขชื่อสาขา <span className="font-semibold">"{branchName}"</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อสาขาใหม่
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="ระบุชื่อสาขาใหม่"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg text-black"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading || formData.name.trim() === ""}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              ยกเลิก
            </button>
          </div>
        </form>

        {message && (
          <p className={`text-sm text-center ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
