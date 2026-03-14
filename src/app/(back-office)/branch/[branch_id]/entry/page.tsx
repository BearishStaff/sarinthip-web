'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, ClipboardList, Loader2 } from 'lucide-react';
import { createBillWithExpenses } from '@/src/actions/billActions'; // We'll create this action
import { SmartInputView } from '@/src/components/SmartBillInput';
import { ManualFormView } from '@/src/components/ManualFormView';

type EntryMode = 'smart' | 'manual';

export default function EntryPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params.id as string;

  const [mode, setMode] = useState<EntryMode>('smart');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSmartProcess = async () => {
    if (!inputText.trim()) return alert("กรุณาใส่ข้อความก่อนประมวลผล");
    
    setIsProcessing(true);
    try {
      // Call our Server Action that uses the myTextParser internally
      const result = await createBillWithExpenses(branchId, inputText);
      
      if (result.success) {
        router.push(`/branch/${branchId}`);
        router.refresh(); // Refresh dashboard data
      }
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-6">
        <button onClick={() => router.back()} className="p-2 mr-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">บันทึกรายจ่าย</h1>
      </div>

      {/* Tab Switcher */}
      <div className="w-full max-w-md bg-gray-200 p-1 rounded-2xl flex mb-6">
        <button
          onClick={() => setMode('smart')}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === 'smart' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          <Sparkles className={`w-4 h-4 mr-2 ${mode === 'smart' ? 'text-purple-500' : ''}`} /> AI ก๊อปวาง
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === 'manual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          <ClipboardList className={`w-4 h-4 mr-2 ${mode === 'manual' ? 'text-blue-500' : ''}`} /> กรอกเอง
        </button>
      </div>

      {/* Conditional Content */}
      <div className="w-full max-w-md">
        {mode === 'smart' ? (
          <SmartInputView 
            text={inputText} 
            setText={setInputText} 
            onProcess={handleSmartProcess}
            loading={isProcessing}
          />
        ) : (
          <ManualFormView branchId={branchId} />
        )}
      </div>
    </div>
  );
}