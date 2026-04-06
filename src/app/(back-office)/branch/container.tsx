"use client";

import React, { useState } from "react";
import { LoaderIcon, Plus, Store } from "lucide-react"; // ไอคอนสำหรับ UI
import Link from "next/link";
import { useBranch } from "@/src/hooks/useBranch";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";

function handleAddBranch() {
  console.log("add branch");
}

export default function HomeContainer() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { branchesData, isLoading } = useBranch();

  return (
    <div className={`min-h-screen ${appColorClasses.pageBg} flex flex-col items-center p-6 font-sans`}>
      {/* Welcome Header */}
      <header className="w-full max-w-md mt-8 mb-10 text-center">
        <h1 className={`text-3xl font-extrabold ${appColorClasses.textPrimary} tracking-tight`}>
          Welcome!
        </h1>
        <p className={`${appColorClasses.textSecondary} mt-2`}>กรุณาเลือกสาขาเพื่อจัดการข้อมูล</p>
      </header>

      {isLoading ? (
        <LoaderIcon className="center"></LoaderIcon>
      ) : (
        <>
          {/* Branch Grid */}
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            {branchesData?.map((branch) => (
              <Link
                key={branch.id}
                href={`/branch/${branch.id}`} // ไปที่หน้า Dashboard ของสาขานั้นๆ
                className={`group relative ${appColorClasses.cardBg} border ${appColorClasses.borderSoft} rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${intentColorClasses.brand.borderStrong.replace("border-", "hover:border-")} hover:shadow-md active:scale-95`}
              >
                <div className={`w-14 h-14 ${intentColorClasses.brand.bg} rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-100`}>
                  <Store className={`${intentColorClasses.brand.text} w-7 h-7`} />
                </div>
                <span className={`font-semibold ${appColorClasses.textPrimary} text-center`}>
                  {branch.name}
                </span>
              </Link>
            ))}

            {/* Add Branch Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className={`bg-card border-2 border-dashed border-border-soft rounded-2xl p-6 flex flex-col items-center justify-center transition-all hover:border-brand-400 hover:bg-brand-50 active:scale-95`}
            >
              <div className={`w-14 h-14 bg-surface rounded-full flex items-center justify-center mb-3`}>
                <Plus className={`${appColorClasses.textMuted} w-7 h-7`} />
              </div>
              <span className={`font-medium ${appColorClasses.textSecondary}`}>เพิ่มสาขา</span>
            </button>
          </div>

          {/* Modal เพิ่มสาขา (ตามภาพ "เพิ่มสาขา" ใน Wireframe) */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl space-y-6">
                <h2 className={`text-xl font-bold text-center ${appColorClasses.textPrimary} tracking-tight`}>
                  เพิ่มสาขาใหม่
                </h2>
                <form onSubmit={handleAddBranch} className="space-y-6">
                  <div className="space-y-2 text-center">
                    {/* ไอคอน + ในวงกลมตาม Wireframe */}
                    <div className={`mx-auto w-20 h-20 border-2 ${appColorClasses.borderSoft} rounded-full flex items-center justify-center bg-surface mb-4`}>
                      <Plus className={`${appColorClasses.textMuted} w-10 h-10`} />
                    </div>
                    <input
                      type="text"
                      placeholder="ระบุชื่อสาขา"
                      value={""}
                      onChange={() => {}}
                      className="w-full px-4 py-3 rounded-xl border border-border-soft focus:outline-none focus:ring-2 focus:ring-brand-500 text-center text-lg"
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      className={`w-full bg-text-primary text-white py-3 rounded-xl font-semibold hover:bg-foreground transition-colors`}
                    >
                      ยืนยัน
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className={`w-full bg-card ${appColorClasses.textSecondary} py-3 rounded-xl font-medium border ${appColorClasses.borderSubtle} hover:bg-surface transition-colors`}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer Info (Optional) */}
      <footer className={`mt-auto py-8 ${appColorClasses.textMuted} text-sm italic`}>
        Backend Managed by Supabase
      </footer>
    </div>
  );
}
