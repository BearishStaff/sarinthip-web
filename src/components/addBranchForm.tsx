"use client";

import { useState } from "react";
import { addBranch } from "../actions/branchActions";

interface AddBranchFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddBranchForm({ onSuccess, onCancel }: AddBranchFormProps) {
  const [message, setMessage] = useState("");

  async function clientAction(formData: FormData) {
    const result = await addBranch(formData);
    
    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage("✅ Branch added successfully!");
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    }
  }

  return (
    <div className="space-y-4">
      <form action={clientAction} className="space-y-4">
        <div>
          <input
            name="name"
            type="text"
            placeholder="ระบุชื่อสาขา"
            className="w-full px-4 py-3 rounded-xl border border-border-soft focus:outline-none focus:ring-2 focus:ring-brand-500 text-center text-lg text-black"
            required
            autoFocus
          />
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full bg-text-primary text-white py-3 rounded-xl font-semibold hover:bg-foreground transition-colors"
          >
            ยืนยัน
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-card text-text-primary py-3 rounded-xl font-medium border border-border-subtle hover:bg-surface transition-colors"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>

      {message && <p className="text-sm mt-2 text-center">{message}</p>}
    </div>
  );
}