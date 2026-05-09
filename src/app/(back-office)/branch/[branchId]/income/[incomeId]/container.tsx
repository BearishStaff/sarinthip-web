'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, Calendar, DollarSign, FileText, Edit2, Save, X, Trash2 } from "lucide-react";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";
import { Income } from "@/src/types/income";
import { updateIncomeAction, deleteIncomeAction } from "@/src/actions/incomeActions";
import { INCOME_CHANNELS, calcNetAmount, calcGpDeduction } from "@/src/lib/incomeChannels";

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
    channel: income.channel ?? 'Cash',
    gp_rate: Number(income.gp_rate ?? 0),
    note: income.note || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ch = INCOME_CHANNELS.find(c => c.name === e.target.value) ?? INCOME_CHANNELS[0];
    setFormData(prev => ({ ...prev, channel: ch.name, gp_rate: ch.gpRate }));
  };

  const handleSave = async () => {
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
      channel: income.channel ?? 'Cash',
      gp_rate: Number(income.gp_rate ?? 0),
      note: income.note || ''
    });
    setIsEditing(false);
  };

  const gpDeduction = calcGpDeduction(formData.amount, formData.gp_rate);
  const netAmount = calcNetAmount(formData.amount, formData.gp_rate);
  const hasGp = formData.gp_rate > 0;

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

          {/* Channel Field */}
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
              <TrendingUp className="inline w-4 h-4 mr-1" />
              ช่องทางรายรับ
            </label>
            {isEditing ? (
              <select
                value={formData.channel}
                onChange={handleChannelChange}
                className={`w-full px-4 py-2 border ${appColorClasses.borderSoft} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${appColorClasses.textPrimary} bg-white`}
              >
                {INCOME_CHANNELS.map(ch => (
                  <option key={ch.name} value={ch.name}>
                    {ch.name}{ch.gpRate > 0 ? ` (GP ${ch.gpRate * 100}%)` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <p className={`text-lg font-semibold ${appColorClasses.textPrimary}`}>
                {formData.channel}
                {hasGp && (
                  <span className="ml-2 text-sm font-normal text-amber-600">
                    GP {formData.gp_rate * 100}%
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label className={`block text-sm font-medium ${appColorClasses.textSecondary} mb-2`}>
              <DollarSign className="inline w-4 h-4 mr-1" />
              ยอดรายรับ (ก่อนหัก GP)
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
              <div>
                {hasGp ? (
                  <div className="space-y-1">
                    <p className={`text-sm ${appColorClasses.textSecondary} line-through`}>
                      ฿{formData.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-[11px] text-amber-600`}>
                      หัก GP {formData.gp_rate * 100}% = −฿{gpDeduction.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-2xl font-bold ${intentColorClasses.success.text}`}>
                      ฿{netAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ) : (
                  <p className={`text-2xl font-bold ${intentColorClasses.success.text}`}>
                    ฿{formData.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* GP preview while editing */}
          {isEditing && hasGp && formData.amount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className={appColorClasses.textSecondary}>ยอดรวม</span>
                <span className={appColorClasses.textPrimary}>฿{formData.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">หัก GP {formData.gp_rate * 100}%</span>
                <span className="text-amber-700">−฿{gpDeduction.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className={`flex justify-between font-bold border-t border-amber-200 pt-1 ${intentColorClasses.success.text}`}>
                <span>รายรับสุทธิ</span>
                <span>฿{netAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}

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
