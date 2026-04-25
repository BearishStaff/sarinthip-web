'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, ClipboardList } from "lucide-react";
import { createBillWithExpenses } from "@/src/actions/billActions";
import { SmartInputView } from "@/src/components/SmartBillInput";
import { ManualFormView } from "@/src/components/ManualFormView";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

type EntryMode = "smart" | "manual";

interface Props {
  branchId: string;
}

export default function InsertExpenseContainer({ branchId }: Readonly<Props>) {
  const router = useRouter();

  const [mode, setMode] = useState<EntryMode>("smart");
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSmartProcess = async () => {
    if (!inputText.trim()) return alert("กรุณาใส่ข้อความก่อนประมวลผล");

    setIsProcessing(true);
    try {
      const result = await createBillWithExpenses(branchId, inputText);

      if (result.success) {
        router.push(`/branch/${branchId}`);
        router.refresh();
      }
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen ${appColorClasses.pageBg} flex flex-col items-center p-4 md:p-6 font-sans`}>
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className={`p-2 mr-2 rounded-full transition-colors hover:bg-surface border ${appColorClasses.borderSoft}`}
        >
          <ArrowLeft className={`w-6 h-6 ${appColorClasses.textSecondary}`} />
        </button>
        <h1 className={`text-xl font-bold ${appColorClasses.textPrimary}`}>บันทึกรายจ่าย</h1>
      </div>

      {/* Tab Switcher */}
      <div className={`w-full max-w-md bg-surface border ${appColorClasses.borderSubtle} p-1 rounded-2xl flex mb-6`}>
        <button
          onClick={() => setMode("smart")}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === "smart"
              ? `${appColorClasses.cardBg} shadow-sm ${appColorClasses.textPrimary}`
              : appColorClasses.textSecondary
          }`}
        >
          <Sparkles className={`w-4 h-4 mr-2 ${mode === "smart" ? intentColorClasses.ai.text : ""}`} /> AI ก๊อปวาง
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === "manual"
              ? `${appColorClasses.cardBg} shadow-sm ${appColorClasses.textPrimary}`
              : appColorClasses.textSecondary
          }`}
        >
          <ClipboardList
            className={`w-4 h-4 mr-2 ${mode === "manual" ? intentColorClasses.brand.textStrong : ""}`}
          />{" "}
          กรอกเอง
        </button>
      </div>

      {/* Conditional Content */}
      <div className="w-full max-w-md">
        {mode === "smart" ? (
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