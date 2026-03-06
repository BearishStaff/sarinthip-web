'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, ClipboardList} from 'lucide-react';

type EntryMode = 'smart' | 'manual';

export default function EntryPage() {
  const router = useRouter();
  const [mode, setMode] = useState<EntryMode>('smart');
  const [inputText, setInputText] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-6">
        <button onClick={() => router.back()} className="p-2 mr-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">บันทึกรายจ่าย</h1>
      </div>

      {/* Tab Switcher (Wireframe Step 3) */}
      <div className="w-full max-w-md bg-gray-200 p-1 rounded-2xl flex mb-6">
        <button
          onClick={() => setMode('smart')}
          className={`flex-1 flex items-center justify-center py-2 rounded-xl text-sm font-medium transition-all ${
            mode === 'smart' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" /> AI ก๊อปวาง
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center py-2 rounded-xl text-sm font-medium transition-all ${
            mode === 'manual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          <ClipboardList className="w-4 h-4 mr-2" /> กรอกเอง
        </button>
      </div>

      {/* Conditional Content */}
      <div className="w-full max-w-md">
        {mode === 'smart' ? (
          <SmartInputView 
            text={inputText} 
            setText={setInputText} 
            onProcess={() => router.push(`/branch/1/entry/preview`)} 
          />
        ) : (
          <ManualFormView />
        )}
      </div>
    </div>
  );
}

/** * UI for Pasting AI Text 
 */
function SmartInputView({ text, setText, onProcess }: any) {
  return (
    <div className="space-y-4 animate-in slide-in-from-right-2">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 mb-3">วางข้อความที่ได้จาก AI ลงในช่องด้านล่าง</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="27/02/2569 | ลูกชิ้นเนื้อ 3 กก. ..."
          className="min-h-[300px] border-none focus-visible:ring-0 bg-gray-50 rounded-xl p-4 text-base"
        />
      </div>
      <button onClick={onProcess} className="w-full h-14 rounded-2xl bg-gray-900 text-lg font-bold">
        ประมวลผลข้อมูล
      </button>
    </div>
  );
}

/** * UI for Manual Entry (Step 4 in Wireframe) 
 */
function ManualFormView() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 animate-in slide-in-from-left-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">วันที่</label>
          <input type="text" placeholder="27/02/2569" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">หมวดหมู่</label>
          <select className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black">
            <option>เนื้อสัตว์</option>
            <option>ผัก</option>
            <option>เส้น</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-400 uppercase">รายการ</label>
        <input type="text" placeholder="เช่น ลูกชิ้นเนื้อ" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">หน่วย</label>
          <input type="text" placeholder="กก. / ถุง" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">ราคา/หน่วย</label>
          <input type="number" placeholder="220" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black" />
        </div>
      </div>

      <div className="pt-4 border-t border-dashed">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">รวมทั้งหมด</span>
          <span className="text-2xl font-black">฿ 0</span>
        </div>
      </div>

      <button className="w-full h-14 rounded-2xl bg-gray-900 text-lg font-bold">
        บันทึกรายการ
      </button>
    </div>
  );
}