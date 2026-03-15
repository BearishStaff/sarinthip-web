import React from "react";
import { createManualExpense } from "../actions/billActions";
import { useRouter } from "next/navigation";

export function ManualFormView({ branchId }: { branchId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // Form State
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0],
  );
  const [itemName, setItemName] = React.useState("");
  const [qty, setQty] = React.useState(0);
  const [unit, setUnit] = React.useState("กก.");
  const [price, setPrice] = React.useState(0);

  const handleSubmit = async () => {
    if (!itemName || qty <= 0 || price <= 0)
      return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    setLoading(true);
    const result = await createManualExpense({
      branchId,
      itemName,
      qty,
      unit,
      pricePerUnit: price,
      billingDate: date,
    });

    if (result.success) {
      router.push(`/branch/${branchId}`);
      router.refresh();
    } else {
      alert("เกิดข้อผิดพลาด: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white text-black p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            วันที่
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black text-sm font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            หมวดหมู่
          </label>
          <select className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none">
            <option value="เนื้อ">เนื้อ</option>
            <option value="หมู">หมู</option>
            <option value="ผัก">ผัก</option>
            <option value="เส้น">เส้น</option>
            {/* Future: Map through categories from DB here */}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          ชื่อรายการ
        </label>
        <input
          type="text"
          placeholder="เช่น ลูกชิ้นเนื้อ"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black font-bold"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            จำนวน
          </label>
          <input
            type="number"
            placeholder="0"
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            หน่วย
          </label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="กก."
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            ราคา/หน่วย
          </label>
          <input
            type="number"
            placeholder="0"
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black font-bold"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-dashed border-gray-200">
        <div className="flex justify-between items-center px-2">
          <span className="text-gray-400 font-bold text-sm uppercase">
            รวมทั้งสิ้น
          </span>
          <span className="text-3xl font-black text-gray-900">
            ฿ {(qty * price).toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-16 rounded-2xl bg-gray-900 text-white text-lg font-black shadow-lg shadow-gray-200 active:scale-95 transition-all disabled:bg-gray-400"
      >
        {loading ? "กำลังบันทึก..." : "บันทึกรายการ"}
      </button>
    </div>
  );
}
