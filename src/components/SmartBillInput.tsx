import { Loader2 } from "lucide-react";

export function SmartInputView({ text, setText, onProcess, loading }: any) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium text-gray-600">วางข้อความสรุปจาก AI</p>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          placeholder="ตัวอย่าง:&#10;27/02/2569&#10;ลูกชิ้นเนื้อ 3 กก. 660&#10;เส้นเล็ก 5 ถุง 125"
          className="text-black w-full min-h-[350px] border-none focus:ring-0 bg-gray-50 rounded-2xl p-4 text-base placeholder:text-gray-300 resize-none"
        />
      </div>
      
      <button 
        onClick={onProcess} 
        disabled={loading || !text}
        className="w-full h-16 rounded-2xl bg-gray-900 text-white text-lg font-black shadow-lg shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            กำลังบันทึกข้อมูล...
          </>
        ) : (
          "ประมวลผลและบันทึก"
        )}
      </button>
    </div>
  );
}