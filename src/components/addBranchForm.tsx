"use client";

import { useState } from "react";
import { addBranch } from "../app/actions/branchActions";

export default function AddBranchForm() {
  const [message, setMessage] = useState("");

  async function clientAction(formData: FormData) {
    const result = await addBranch(formData);
    
    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage("✅ Branch added successfully!");
      // Optionally reset the form here
    }
  }

  return (
    <form action={clientAction} className="space-y-4 p-4 border rounded-lg">
      <div>
        <label className="block text-sm font-medium">Branch Name</label>
        <input
          name="name"
          type="text"
          placeholder="e.g., Sukhumvit Branch"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Branch
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}