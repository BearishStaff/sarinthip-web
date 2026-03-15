"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Tag, Trash2, ReceiptText } from 'lucide-react';
import { useBillDetail } from '@/src/hooks/useExpense';
import { deleteBill } from '@/src/actions/billActions';

export default function BillDetailPage() {
  const { billId } = useParams();
  const router = useRouter();
  const { data: bill, isLoading } = useBillDetail(billId as string);

  if (isLoading) return <div className="p-10 text-center">กำลังโหลด...</div>;
  if (!bill) return <div className="p-10 text-center">ไม่พบข้อมูลบิล</div>;

  const totalAmount = bill.expenses.reduce((sum: number, exp: any) => sum + exp.total_amount, 0);

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        
        {/* Navigation */}
        <button onClick={() => router.back()} className="mb-6 flex items-center text-gray-500 font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" /> ย้อนกลับ
        </button>

        {/* Receipt Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-dashed border-gray-200 bg-gray-50/50">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-900 p-3 rounded-2xl">
                <ReceiptText className="w-6 h-6 text-white" />
              </div>
              <button onClick={handleDelete} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <h1 className="text-xl font-black text-gray-900">รายละเอียดบิล</h1>
            <p className="text-sm text-gray-500 uppercase tracking-tighter">ID: {bill.id.slice(0, 13)}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Meta Info */}
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">วันที่บันทึก</p>
                <div className="flex items-center mt-1 text-sm font-semibold">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  {new Date(bill.billing_date).toLocaleDateString('th-TH')}
                </div>
              </div>
              <div className="flex-1 text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">สาขา</p>
                <p className="mt-1 text-sm font-semibold">{bill.branches?.name}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">รายการสินค้า</p>
              {bill.expenses.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.item_name}</p>
                    <p className="text-[10px] text-gray-400">
                      {item.qty} {item.unit} × ฿{item.price_per_unit.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-black text-gray-900">฿{item.total_amount.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="pt-6 border-t-2 border-gray-900">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">ยอดรวมทั้งสิ้น</span>
                <span className="text-2xl font-black text-blue-600">฿{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tagging Info (Category) */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Tag className="w-3 h-3" />
          <span>หมวดหมู่หลัก: {bill.expenses[0]?.categories?.name || 'ทั่วไป'}</span>
        </div>
      </div>
    </div>
  );
}