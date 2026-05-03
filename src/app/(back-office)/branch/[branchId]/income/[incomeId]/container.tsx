'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, Calendar, DollarSign, FileText, Edit2, Save, X, Trash2 } from "lucide-react";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";
import { Income } from "@/src/types/income";
import { updateIncomeAction, deleteIncomeAction } from "@/src/actions/incomeActions";

interface Props {
  branchId: string;
  income: Income;
}

export default function IncomeDetailContainer({ branchId, income }: Readonly<Props>) {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    entry_date: income.entry_date,
    amount: Number(income.amount),
    source: income.source,
    note: income.note || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async () => {
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
      const result = await updateIncomeAction(income.id, {
        ...formData,
        branch_id: branchId
      });
      
      if (result.success) {
        setIsEditing(false);
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

  const handleDelete = async () => {
    if (!confirm('คุณต้องการลบรายการรายรับนี้ใช่หรือไม่?')) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await deleteIncomeAction(income.id);
      
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

  const handleCancel = () => {
    setFormData({
      entry_date: income.entry_date,
      amount: Number(income.amount),
      source: income.source,
      note: income.note || ''
    });
    setIsEditing(false);
  };

  return (
    <div className={`min-h-screen ${appColorClasses.pageBg} flex flex-col items-center p-4 md:p-6 font-sans`}>
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/branch/${branchId}`)}
          className={`p-2 rounded-full transition-colors hover:bg-surface border ${appColorClasses.borderSoft}`}
        >
          <ArrowLeft className={`w-6 h-6 ${appColorClasses.textSecondary}`} />
        </button>
        <h1 className={`text-xl font-bold ${appColorClasses.textPrimary}`}>รายละเอียดรายรับ</h1>
        <div className="w-10"></div>
      </div>

      {/* Main Card */}
      <div className={`w-full max-w-md ${appColorClasses.cardBg} rounded-3xl p-6 shadow-sm border ${appColorClasses.borderSoft}`}>
        {/* Card Header with Actions */}
        <div className="flex justify-between items-start mb-6">
          <div className={`${intentColorClasses.success.bg} p-3 rounded-xl`}>
            <TrendingUp className={`w-6 h-6 ${intentColorClasses.success.text}`} />
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`p-2 rounded-lg transition-colors ${intentColorClasses.brand.bg} ${intentColorClasses.brand.text} hover:bg-blue-600`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className={`p-2 rounded-lg transition-colors ${intentColorClasses.danger.bg} ${intentColorClasses.danger.text} hover:bg-red-600 disabled:opacity-60`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className={`p-2 rounded-lg transition-colors ${intentColorClasses.success.bg} ${intentColorClasses.success.text} hover:bg-green-600 disabled:opacity-60`}
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className={`p-2 rounded-lg transition-colors ${appColorClasses.borderSoft} ${appColorClasses.textSecondary} hover:bg-gray-100 disabled:opacity-60`}
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Date Field */}
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
              <Calendar className="inline w-4 h-4 mr-1" />
              วันที่
            </label>
            {isEditing ? (
              <input
                type="date"
                name="entry_date"
                value={formData.entry_date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${appColorClasses.textPrimary} cursor-pointer`}
                required
                onClick={(e) => e.currentTarget.showPicker?.()}
              />
            ) : (
              <p className={`text-lg font-semibold ${appColorClasses.textPrimary}`}>
                {new Date(formData.entry_date).toLocaleDateString('th-TH')}
              </p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
              <DollarSign className="inline w-4 h-4 mr-1" />
              จำนวนเงิน
            </label>
            {isEditing ? (
              <input
                type="number"
                name="amount"
                value={formData.amount === 0 ? '' : formData.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '0' || value === '0.') {
                    handleInputChange(e);
                  } else {
                    const regex = /^\d*\.?\d{0,2}$/;
                    if (regex.test(value) && parseFloat(value) >= 0) {
                      handleInputChange(e);
                    }
                  }
                }}
                placeholder="0.00"
                className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${appColorClasses.textPrimary}`}
                required
              />
            ) : (
              <p className={`text-2xl font-bold ${intentColorClasses.success.text}`}>
                ฿{formData.amount.toLocaleString()}
              </p>
            )}
          </div>

          {/* Source Field */}
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
              <TrendingUp className="inline w-4 h-4 mr-1" />
              แหล่งที่มา
            </label>
            {isEditing ? (
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                placeholder="เช่น ขายสินค้า, ค่าบริการ, ดอกเบี้ย"
                className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${appColorClasses.textPrimary}`}
                required
              />
            ) : (
              <p className={`text-lg font-semibold ${appColorClasses.textPrimary}`}>
                {formData.source}
              </p>
            )}
          </div>

          {/* Note Field */}
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
              <FileText className="inline w-4 h-4 mr-1" />
              หมายเหตุ
            </label>
            {isEditing ? (
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="รายละเอียดเพิ่มเติม..."
                rows={3}
                className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none ${appColorClasses.textPrimary}`}
              />
            ) : (
              <p className={`${appColorClasses.textPrimary}`}>
                {formData.note || '-'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
