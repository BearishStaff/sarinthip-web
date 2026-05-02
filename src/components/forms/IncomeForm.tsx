"use client";

import React, { useState } from "react";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

interface IncomeFormProps {
  branchId: string;
  onSubmit?: (data: IncomeFormData) => void;
}

export interface IncomeFormData {
  branch_id: string;
  entry_date: string;
  amount: number;
  source: string;
  note?: string;
}

export default function IncomeForm({ branchId, onSubmit }: IncomeFormProps) {
  const [formData, setFormData] = useState<IncomeFormData>({
    branch_id: branchId,
    entry_date: new Date().toISOString().slice(0, 10),
    amount: 0,
    source: "",
    note: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof IncomeFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Reset form
      setFormData({
        branch_id: branchId,
        entry_date: new Date().toISOString().slice(0, 10),
        amount: 0,
        source: "",
        note: ""
      });
    } catch (error) {
      console.error("Error submitting income:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${appColorClasses.cardBg} border ${appColorClasses.borderSoft} rounded-2xl p-6`}>
      <h3 className={`text-lg font-semibold ${appColorClasses.textPrimary} mb-4`}>
        บันทึกรายรับ
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
              แหล่งที่มา
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => handleInputChange("source", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} focus:outline-none focus:ring-2 focus:ring-brand-500 ${appColorClasses.textPrimary}`}
              placeholder="เช่น ขายสินค้า, ค่าบริการ"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
              วันที่
            </label>
            <input
              type="date"
              value={formData.entry_date}
              onChange={(e) => handleInputChange("entry_date", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} focus:outline-none focus:ring-2 focus:ring-brand-500 ${appColorClasses.textPrimary}`}
              required
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
            จำนวนเงิน
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", Number(e.target.value))}
            className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} focus:outline-none focus:ring-2 focus:ring-brand-500 ${appColorClasses.textPrimary}`}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
            หมายเหตุ (ถ้ามี)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} focus:outline-none focus:ring-2 focus:ring-brand-500 ${appColorClasses.textPrimary}`}
            rows={3}
            placeholder="รายละเอียดเพิ่มเติม..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${intentColorClasses.brand.bg} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "กำลังบันทึก..." : "บันทึกรายรับ"}
        </button>
      </form>
    </div>
  );
}
