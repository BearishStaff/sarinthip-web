"use client";

import React, { useState } from "react";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

interface ExpenseFormProps {
  branchId: string;
  onSubmit?: (data: ExpenseFormData) => void;
}

export interface ExpenseFormData {
  bill_id: string;
  item_name: string;
  qty: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  entry_date: string;
  category_id?: number | null;
}

export default function ExpenseForm({ branchId, onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    bill_id: "",
    item_name: "",
    qty: 1,
    unit: "ชิ้น",
    price_per_unit: 0,
    total_amount: 0,
    entry_date: new Date().toISOString().slice(0, 10),
    category_id: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ExpenseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto calculate total amount when qty or price changes
    if (field === "qty" || field === "price_per_unit") {
      const qty = field === "qty" ? Number(value) : formData.qty;
      const price = field === "price_per_unit" ? Number(value) : formData.price_per_unit;
      setFormData(prev => ({
        ...prev,
        total_amount: qty * price
      }));
    }
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
        bill_id: "",
        item_name: "",
        qty: 1,
        unit: "ชิ้น",
        price_per_unit: 0,
        total_amount: 0,
        entry_date: new Date().toISOString().slice(0, 10),
        category_id: null
      });
    } catch (error) {
      console.error("Error submitting expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${appColorClasses.cardBg} border ${appColorClasses.borderSoft} rounded-2xl p-6`}>
      <h3 className={`text-lg font-semibold ${appColorClasses.textPrimary} mb-4`}>
        บันทึกรายจ่าย
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
              ชื่อรายการ
            </label>
            <input
              type="text"
              value={formData.item_name}
              onChange={(e) => handleInputChange("item_name", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} focus:outline-none focus:ring-2 focus:ring-brand-500 ${appColorClasses.textPrimary}`}
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

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
              จำนวน
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={formData.qty}
              onChange={(e) => handleInputChange("qty", Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} focus:outline-none focus:ring-2 focus:ring-brand-500 ${appColorClasses.textPrimary}`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
              หน่วย
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => handleInputChange("unit", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} focus:outline-none focus:ring-2 focus:ring-brand-500 ${appColorClasses.textPrimary}`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
              ราคาต่อหน่วย
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price_per_unit}
              onChange={(e) => handleInputChange("price_per_unit", Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} focus:outline-none focus:ring-2 focus:ring-brand-500 ${appColorClasses.textPrimary}`}
              required
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-1`}>
            จำนวนเงิน (คำนวณอัตโนมัติ)
          </label>
          <input
            type="number"
            value={formData.total_amount}
            readOnly
            className={`w-full px-3 py-2 rounded-lg border ${appColorClasses.borderSoft} bg-gray-50 ${appColorClasses.textPrimary}`}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${intentColorClasses.brand.bg} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "กำลังบันทึก..." : "บันทึกรายจ่าย"}
        </button>
      </form>
    </div>
  );
}
