"use client";
import { useState } from "react";
import { Plus, Trash2, Edit3, ArrowLeft } from "lucide-react";
import { deleteCategory, upsertCategory } from "@/src/actions/categoryAction";
import { useRouter } from "next/navigation";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

export default function CategoryManager({
  initialCategories,
}: {
  readonly initialCategories: any[];
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
  let saveButtonLabel = "ยืนยันเพิ่มหมวดหมู่";
  if (loading) {
    saveButtonLabel = "กำลังบันทึก...";
  } else if (editingId) {
    saveButtonLabel = "บันทึกการแก้ไข";
  }

  return (
    <div className={`min-h-screen ${appColorClasses.pageBg} p-6 max-w-md mx-auto space-y-8`}>
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-full transition-colors hover:bg-surface border ${appColorClasses.borderSoft}`}
        >
          <ArrowLeft className={`w-6 h-6 ${appColorClasses.textSecondary}`} />
        </button>

        <div>
          <h1 className={`text-2xl font-black ${appColorClasses.textPrimary} leading-none`}>
            ตั้งค่าหมวดหมู่
          </h1>
          <p className={`text-sm font-bold ${appColorClasses.textSecondary} mt-1`}>
            จัดการคำหลัก AI
          </p>
        </div>
      </div>
      <div
        className={`p-6 rounded-3xl border transition-all ${
          editingId
            ? `${intentColorClasses.brand.borderStrong} ${intentColorClasses.brand.bg}`
            : `${appColorClasses.borderSoft} ${appColorClasses.cardBg}`
        }`}
      >
        <h2 className={`text-xl font-black ${appColorClasses.textPrimary} mb-4 flex items-center gap-2`}>
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
            className={`w-full p-4 bg-white border ${appColorClasses.borderSoft} rounded-2xl font-bold ${appColorClasses.textPrimary} focus:ring-2 focus:ring-brand-500 outline-none`}
          />
          <textarea
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Keyword (คั่นด้วยคอมม่า เช่น เนื้อ, ไก่, หมู)"
            className={`w-full p-4 bg-white border ${appColorClasses.borderSoft} rounded-2xl font-bold ${appColorClasses.textPrimary} text-sm h-24 outline-none`}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 h-14 bg-text-primary text-white rounded-2xl font-black text-lg active:scale-95 transition-all hover:bg-foreground disabled:bg-gray-400"
            >
              {saveButtonLabel}
            </button>
            {Boolean(editingId) && (
              <button
                onClick={cancelEdit}
                className={`px-6 h-14 bg-white border ${appColorClasses.borderSoft} ${appColorClasses.textPrimary} rounded-2xl font-black hover:bg-surface`}
              >
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-3">
        <p className={`text-xs font-black ${appColorClasses.textPrimary} uppercase tracking-widest ml-2`}>
          หมวดหมู่ทั้งหมด ({initialCategories.length})
        </p>
        {initialCategories.map((cat) => (
          <div
            key={cat.id}
            className={`${appColorClasses.cardBg} p-5 rounded-2xl border ${appColorClasses.borderSoft} flex justify-between items-center group shadow-sm`}
          >
            <div className="flex-1">
              <p className={`font-black ${appColorClasses.textPrimary} text-lg`}>{cat.name}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {cat.keywords?.map((kw: string) => (
                  <span
                    key={kw}
                    className={`text-[11px] bg-surface border ${appColorClasses.borderSubtle} ${appColorClasses.textPrimary} px-2 py-1 rounded-lg font-bold`}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEditing(cat)}
                className={`p-3 bg-surface hover:bg-brand-500 hover:text-white rounded-xl transition-all ${appColorClasses.textPrimary}`}
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (confirm("ลบหมวดหมู่หรือไม่?")) deleteCategory(cat.id);
                }}
                className={`p-3 bg-surface hover:bg-danger-600 hover:text-white rounded-xl transition-all ${appColorClasses.textPrimary}`}
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
