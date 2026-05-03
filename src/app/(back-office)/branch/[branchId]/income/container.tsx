'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, Calendar, DollarSign, FileText } from "lucide-react";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";
import { CreateIncomeData } from "@/src/types/income";
import { createIncomeAction } from "@/src/actions/incomeActions";

interface Props {
  branchId: string;
}

export default function InsertIncomeContainer({ branchId }: Readonly<Props>) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateIncomeData>({
    branch_id: branchId,
    entry_date: new Date().toISOString().split('T')[0],
    amount: 0,
    source: '',
    note: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.source.trim()) {
      alert('กรุณาระบุแหล่งที่มาของรายรับ');
      return;
    }
    
    if (formData.amount <= 0) {
      alert('กรุณาระบุจำนวนเงินที่ถูกต้อง');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createIncomeAction(formData);
      
      if (result.success) {
        router.push(`/branch/${branchId}`);
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${appColorClasses.pageBg} flex flex-col items-center p-4 md:p-6 font-sans`}>
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className={`p-2 mr-2 rounded-full transition-colors hover:bg-surface border ${appColorClasses.borderSoft}`}
        >
          <ArrowLeft className={`w-6 h-6 ${appColorClasses.textSecondary}`} />
        </button>
        <h1 className={`text-xl font-bold ${appColorClasses.textPrimary}`}>บันทึกรายรับ</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {/* Date Field */}
        <div>
          <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
            <Calendar className="inline w-4 h-4 mr-1" />
            วันที่
          </label>
          <input
            type="date"
            name="entry_date"
            value={formData.entry_date}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${appColorClasses.textPrimary}`}
            required
          />
        </div>

        {/* Amount Field */}
        <div>
          <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
            <DollarSign className="inline w-4 h-4 mr-1" />
            จำนวนเงิน
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${appColorClasses.textPrimary}`}
            required
          />
        </div>

        {/* Source Field */}
        <div>
          <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
            <TrendingUp className="inline w-4 h-4 mr-1" />
            แหล่งที่มา
          </label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            placeholder="เช่น ขายสินค้า, ค่าบริการ, ดอกเบี้ย"
            className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${appColorClasses.textPrimary}`}
            required
          />
        </div>

        {/* Note Field */}
        <div>
          <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
            <FileText className="inline w-4 h-4 mr-1" />
            หมายเหตุ (ไม่ระบุก็ได้)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="รายละเอียดเพิ่มเติม..."
            rows={3}
            className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none ${appColorClasses.textPrimary}`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : `${intentColorClasses.brand.bg} ${intentColorClasses.brand.text} hover:bg-blue-600`
          }`}
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกรายรับ'}
        </button>
      </form>
    </div>
  );
}
