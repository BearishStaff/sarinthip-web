"use client";
import { useState } from "react";
import { Tag, Plus, Save, Trash2, Edit3, X, ArrowLeft } from "lucide-react";
import { deleteCategory, upsertCategory } from "@/src/actions/categoryAction";
import { useRouter } from "next/navigation";

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: any[];
}) {
    const router = useRouter();
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to load category data into the form
  const startEditing = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setKeywordInput(cat.keywords?.join(", ") || "");
    // Scroll to top so user sees the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setKeywordInput("");
  };

  const handleSave = async () => {
    if (!name) return alert("กรุณาระบุชื่อหมวดหมู่");
    setLoading(true);

    const keywords = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k !== "");

    // If editingId is present, upsert will update the existing record
    const result = await upsertCategory({
      id: editingId || undefined,
      name,
      keywords,
    });

    if (result.success) {
      cancelEdit();
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl active:shadow-none active:translate-y-1 transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" strokeWidth={3} />
        </button>

        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">
            ตั้งค่าหมวดหมู่
          </h1>
          <p className="text-sm font-bold text-gray-600 mt-1">
            จัดการคำหลัก AI
          </p>
        </div>
      </div>
      {/* Form Section - High Contrast */}
      <div
        className={`p-6 rounded-3xl border-4 transition-all ${editingId ? "border-blue-600 bg-blue-50" : "border-gray-900 bg-white"}`}
      >
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          {editingId ? (
            <Edit3 className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
          {editingId ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
        </h2>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อหมวดหมู่..."
            className="w-full p-4 bg-white border-2 border-gray-900 rounded-2xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-200 outline-none"
          />
          <textarea
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Keyword (คั่นด้วยคอมม่า เช่น เนื้อ, ไก่, หมู)"
            className="w-full p-4 bg-white border-2 border-gray-900 rounded-2xl font-bold text-gray-900 text-sm h-24 outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 h-14 bg-gray-900 text-white rounded-2xl font-black text-lg active:scale-95 transition-all disabled:bg-gray-400"
            >
              {loading
                ? "กำลังบันทึก..."
                : editingId
                  ? "บันทึกการแก้ไข"
                  : "ยืนยันเพิ่มหมวดหมู่"}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="px-6 h-14 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black hover:bg-gray-100"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-3">
        <p className="text-xs font-black text-gray-900 uppercase tracking-widest ml-2">
          หมวดหมู่ทั้งหมด ({initialCategories.length})
        </p>
        {initialCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded-2xl border-2 border-gray-900 flex justify-between items-center group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex-1">
              <p className="font-black text-gray-900 text-lg">{cat.name}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {cat.keywords?.map((kw: string) => (
                  <span
                    key={kw}
                    className="text-[11px] bg-gray-100 border border-gray-300 text-gray-900 px-2 py-1 rounded-lg font-bold"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEditing(cat)}
                className="p-3 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-gray-900"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (confirm("ลบหมวดหมู่หรือไม่?")) deleteCategory(cat.id);
                }}
                className="p-3 bg-gray-100 hover:bg-red-600 hover:text-white rounded-xl transition-all text-gray-900"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
