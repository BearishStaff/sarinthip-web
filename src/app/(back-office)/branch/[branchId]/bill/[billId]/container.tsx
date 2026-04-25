"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Trash2,
  ReceiptText,
  Edit2,
  X,
} from "lucide-react";
import {  deleteExpense, useBillDetail } from "@/src/hooks/useExpense";
import { deleteBill, updateExpense } from "@/src/actions/billActions";
import { useState } from "react";
import { useCategories } from "@/src/hooks/useCategory";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

export default function BillDetailContainer() {
  const { billId } = useParams();
  const router = useRouter();
  const { data: allCategories = [] } = useCategories();
  const { data: bill, isLoading } = useBillDetail(billId as string);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  if (isLoading) return <div className="p-10 text-center">กำลังโหลด...</div>;
  if (!bill) return <div className="p-10 text-center">ไม่พบข้อมูลบิล</div>;

  const totalAmount = bill.expenses.reduce(
    (sum: number, exp: any) => sum + exp.total_amount,
    0,
  );

  const handleDelete = async () => {
    if (!globalThis.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) return;

    const result = await deleteBill(bill.id, bill.branch_id);

    if (result.success) {
      router.push(`/branch/${bill.branch_id}`);
      router.refresh();
    } else {
      alert("ไม่สามารถลบได้: " + result.error);
    }
  };

  return (
    <div className={`min-h-screen ${appColorClasses.pageBg} p-4 md:p-8`}>
      <div className="max-w-md mx-auto">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className={`mb-6 flex items-center ${appColorClasses.textSecondary} font-medium`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> ย้อนกลับ
        </button>

        {/* Receipt Card */}
        <div className={`${appColorClasses.cardBg} rounded-3xl shadow-sm border ${appColorClasses.borderSoft} overflow-hidden`}>
          <div className={`p-6 border-b border-dashed ${appColorClasses.borderSoft} bg-surface`}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-text-primary p-3 rounded-2xl">
                <ReceiptText className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={handleDelete}
                className={`${intentColorClasses.danger.text} p-2 ${intentColorClasses.danger.bg} rounded-xl transition-colors`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <h1 className={`text-xl font-black ${appColorClasses.textPrimary}`}>รายละเอียดบิล</h1>
            <p className={`text-sm ${appColorClasses.textSecondary} uppercase tracking-tighter`}>
              ID: {bill.id.slice(0, 13)}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Meta Info */}
            <div className="flex gap-4">
              <div className={`flex-1 ${appColorClasses.textPrimary}`}>
                <p className={`text-[10px] font-bold ${appColorClasses.textMuted} uppercase`}>
                  วันที่บันทึก
                </p>
                <div className="flex items-center mt-1 text-sm font-semibold">
                  <Calendar className={`w-4 h-4 mr-2 ${intentColorClasses.brand.textStrong}`} />
                  {new Date(bill.billing_date).toLocaleDateString("th-TH")}
                </div>
              </div>
              <div className={`flex-1 text-right ${appColorClasses.textPrimary}`}>
                <p className={`text-[10px] font-bold ${appColorClasses.textMuted} uppercase`}>
                  สาขา
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {bill.branches?.name}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {/* List of Expenses */}
              {bill.expenses.map((expense: any) => (
                <div
                  key={expense.id}
                  className={`p-5 ${appColorClasses.cardBg} border ${appColorClasses.borderSoft} rounded-2xl shadow-sm active:scale-[0.99] transition-all`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Item Name - Very Bold */}
                      <h4 className={`text-xl font-black ${appColorClasses.textPrimary} leading-tight mb-1`}>
                        {expense?.item_name}
                      </h4>

                      {/* Category Badge */}
                      <span className={`inline-block px-3 py-1 ${intentColorClasses.brand.bg} border ${appColorClasses.borderSoft} rounded-xl text-[10px] font-black ${appColorClasses.textPrimary} uppercase mb-3`}>
                        {expense?.categories?.name || "ยังไม่ระบุหมวดหมู่"}
                      </span>

                      {/* New Grid for Details (Qty, Unit, Price) */}
                      <div className={`grid grid-cols-2 gap-y-2 border-t border-dashed ${appColorClasses.borderSoft} pt-3`}>
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-black ${appColorClasses.textMuted} uppercase tracking-widest`}>
                            จำนวน
                          </span>
                          <span className={`text-lg font-black ${appColorClasses.textPrimary}`}>
                            {expense?.qty} {expense?.unit}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className={`text-[10px] font-black ${appColorClasses.textMuted} uppercase tracking-widest`}>
                            ราคา/หน่วย
                          </span>
                          <span className={`text-lg font-black ${appColorClasses.textPrimary}`}>
                            ฿{expense?.price_per_unit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Column */}
                    <div className="ml-4 flex flex-col items-end justify-between h-full space-y-8">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className={`p-3 ${intentColorClasses.warning.bg} border ${appColorClasses.borderSoft} rounded-2xl shadow-sm`}
                      >
                        <Edit2 className={`w-5 h-5 ${appColorClasses.textPrimary}`} />
                      </button>

                      <div className="text-right">
                        <span className={`text-[10px] font-black ${appColorClasses.textMuted} uppercase tracking-widest block`}>
                          รวมทั้งหมด
                        </span>
                        <span className={`text-2xl font-black ${appColorClasses.textPrimary} leading-none`}>
                          ฿{expense?.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* --- EDIT MODAL --- */}
              {editingExpense && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className={`${appColorClasses.cardBg} w-full max-w-lg rounded-3xl border ${appColorClasses.borderSoft} p-6 space-y-5 shadow-2xl`}>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h3 className={`text-2xl font-black ${appColorClasses.textPrimary} tracking-tighter`}>
                        แก้ไขข้อมูล
                      </h3>
                      <button
                        onClick={() => setEditingExpense(null)}
                        className="p-2 bg-surface rounded-full"
                      >
                        <X className={`w-6 h-6 ${appColorClasses.textPrimary}`} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Name Input */}
                      <div>
                        <label htmlFor="edit_name" className={`text-xs font-black ${appColorClasses.textSecondary} ml-1`}>
                          ชื่อรายการ
                        </label>
                        <input
                          id="edit_name"
                          defaultValue={editingExpense.item_name}
                          className={`w-full p-4 bg-surface border ${appColorClasses.borderSoft} rounded-2xl font-black ${appColorClasses.textPrimary} text-lg`}
                        />
                      </div>

                      {/* Qty & Price Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="edit_qty" className={`text-xs font-black ${appColorClasses.textSecondary} ml-1`}>
                            จำนวน
                          </label>
                          <input
                            id="edit_qty"
                            type="number"
                            inputMode="decimal"
                            defaultValue={editingExpense.qty}
                            className={`w-full p-4 bg-surface border ${appColorClasses.borderSoft} rounded-2xl font-black ${appColorClasses.textPrimary} text-lg`}
                          />
                        </div>
                        <div>
                          <label htmlFor="edit_unit" className={`text-xs font-black ${appColorClasses.textSecondary} ml-1`}>
                            หน่วย
                          </label>
                          <input
                            id="edit_unit"
                            defaultValue={editingExpense.unit}
                            className={`w-full p-4 bg-surface border ${appColorClasses.borderSoft} rounded-2xl font-black ${appColorClasses.textPrimary} text-lg`}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="edit_price" className={`text-xs font-black ${appColorClasses.textSecondary} ml-1`}>
                          ราคาต่อหน่วย
                        </label>
                        <input
                          id="edit_price"
                          type="number"
                          inputMode="decimal"
                          defaultValue={editingExpense.price_per_unit}
                          className={`w-full p-4 bg-surface border ${appColorClasses.borderSoft} rounded-2xl font-black ${appColorClasses.textPrimary} text-lg`}
                        />
                      </div>

                      {/* Category Select */}
                      <div>
                        <label htmlFor="edit_cat" className={`text-xs font-black ${appColorClasses.textSecondary} ml-1`}>
                          หมวดหมู่
                        </label>
                        <select
                          id="edit_cat"
                          defaultValue={editingExpense.category_id}
                          className={`w-full p-4 bg-surface border ${appColorClasses.borderSoft} rounded-2xl font-black ${appColorClasses.textPrimary} text-lg appearance-none`}
                        >
                          <option value="">-- เลือก --</option>
                          {allCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={async () => {
                          const name = (
                            document.getElementById(
                              "edit_name",
                            ) as HTMLInputElement
                          ).value;
                          const qty = Number.parseFloat(
                            (
                              document.getElementById(
                                "edit_qty",
                              ) as HTMLInputElement
                            ).value,
                          );
                          const unit = (
                            document.getElementById(
                              "edit_unit",
                            ) as HTMLInputElement
                          ).value;
                          const price = Number.parseFloat(
                            (
                              document.getElementById(
                                "edit_price",
                              ) as HTMLInputElement
                            ).value,
                          );
                          const catId = (
                            document.getElementById(
                              "edit_cat",
                            ) as HTMLSelectElement
                          ).value;

                          // Notice we calculate the total here on the fly
                          await updateExpense(editingExpense.id, {
                            item_name: name,
                            qty: qty,
                            unit: unit,
                            price_per_unit: price,
                            total_amount: qty * price,
                            category_id: catId ? Number.parseInt(catId, 10) : null,
                          });
                          setEditingExpense(null);
                        }}
                        className="w-full h-16 bg-text-primary text-white rounded-2xl font-black text-xl active:scale-95 transition-all hover:bg-foreground"
                      >
                        อัปเดตข้อมูล
                      </button>
                      <div className={`pt-4 border-t border-dashed ${appColorClasses.borderSoft} mt-6`}>
                        <button
                          onClick={async () => {
                            if (
                              confirm(
                                `ยืนยันการลบ "${editingExpense.item_name}"?`,
                              )
                            ) {
                              const result = await deleteExpense(
                                editingExpense.id
                              );
                              if (result.success) {
                                setEditingExpense(null);
                                router.refresh();
                              } else {
                                alert("ไม่สามารถลบได้: " + result.error);
                              }
                            }
                          }}
                          className={`w-full h-14 bg-white border ${intentColorClasses.danger.text.replace("text-", "border-")} ${intentColorClasses.danger.text} rounded-2xl font-black text-lg ${intentColorClasses.danger.bg} active:scale-95 transition-all flex items-center justify-center gap-2`}
                        >
                          <Trash2 className="w-5 h-5" /> ลบรายการนี้
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Footer */}
            <div className={`pt-6 border-t ${appColorClasses.borderSoft}`}>
              <div className="flex justify-between items-center">
                <span className={`text-lg font-bold ${appColorClasses.textPrimary}`}>
                  ยอดรวมทั้งสิ้น
                </span>
                <span className={`text-2xl font-black ${intentColorClasses.brand.text}`}>
                  ฿{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tagging Info (Category) */}
        <div className={`mt-4 flex items-center justify-center gap-2 text-xs ${appColorClasses.textMuted}`}>
          <Tag className="w-3 h-3" />
          <span>
            หมวดหมู่หลัก: {bill.expenses[0]?.categories?.name || "ทั่วไป"}
          </span>
        </div>
      </div>
    </div>
  );
}
