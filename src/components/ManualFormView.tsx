import { useState } from "react";

export function ManualFormView({ branchId }: { branchId: string }) {
  const [qty, setQty] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const total = qty * price;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">วันที่</label>
          <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black text-sm font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">หมวดหมู่</label>
          <select className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none">
            <option>เนื้อสัตว์</option>
            <option>ผัก/เครื่องปรุง</option>
            <option>ของใช้/อื่นๆ</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ชื่อรายการ</label>
        <input type="text" placeholder="เช่น ลูกชิ้นเนื้อ" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black font-bold" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">จำนวน</label>
          <input 
            type="number" 
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="0" 
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black font-bold" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">หน่วย</label>
          <input type="text" placeholder="กก." className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ราคา/หน่วย</label>
          <input 
            type="number" 
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="0" 
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black font-bold" 
          />
        </div>
      </div>

      <div className="pt-6 border-t border-dashed border-gray-200">
        <div className="flex justify-between items-center px-2">
          <span className="text-gray-400 font-bold text-sm uppercase">รวมทั้งสิ้น</span>
          <span className="text-3xl font-black text-gray-900">฿ {total.toLocaleString()}</span>
        </div>
      </div>

      <button className="w-full h-16 rounded-2xl bg-gray-900 text-white text-lg font-black shadow-lg shadow-gray-200 active:scale-95 transition-all">
        บันทึกรายการ
      </button>
    </div>
  );
}