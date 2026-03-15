"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { deleteCategory, upsertCategory } from "@/src/actions/categoryAction";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  keywords: string[];
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [name, setName] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Note: Since this is a simple manager, we rely on server actions + revalidatePath
  // to refresh the list. If you want it instant, you could add local state management here.

  const handleSave = async () => {
    if (!name) return alert("กรุณาระบุชื่อหมวดหมู่");
    setLoading(true);

    const keywords = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k !== "");
    const result = await upsertCategory({ name, keywords });

    if (result.success) {
      setName("");
      setKeywordInput("");
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-black text-gray-900">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          จัดการหมวดหมู่
        </h1>
        <p className="text-sm text-gray-500">
          ใส่คำสำคัญเพื่อจัดกลุ่มรายการอัตโนมัติ
        </p>
      </header>

      {/* Form Section */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อหมวดหมู่..."
          className="w-full p-4 text-black bg-gray-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          placeholder="Keyword (เช่น หมู, ไก่, เนื้อ)"
          className="w-full p-4 text-black bg-gray-50 rounded-2xl border-none text-sm"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-14 bg-gray-900 text-white rounded-2xl font-bold active:scale-95 transition-all disabled:bg-gray-400"
        >
          {loading ? "กำลังบันทึก..." : "เพิ่มหมวดหมู่"}
        </button>
      </section>

      {/* List Section */}
      <section className="space-y-3">
        {initialCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded-2xl border border-gray-50 flex justify-between items-center group"
          >
            <div>
              <p className="font-bold text-gray-800">{cat.name}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {cat.keywords?.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
