"use client";

import React, { useState } from "react";
import { LoaderIcon, Plus, Store, Trash2, MoreVertical, Edit } from "lucide-react"; // ไอคอนสำหรับ UI
import Link from "next/link";
import { useBranch } from "@/src/hooks/useBranch";
import { appColorClasses, intentColorClasses } from "@/src/lib/colors";
import AddBranchForm from "@/src/components/addBranchForm";
import DeleteBranchDialog from "@/src/components/DeleteBranchDialog";
import EditBranchDialog from "@/src/components/EditBranchDialog";

export default function HomeContainer() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    branchId: string;
    branchName: string;
  }>({
    isOpen: false,
    branchId: "",
    branchName: "",
  });
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    branchId: string;
    branchName: string;
  }>({
    isOpen: false,
    branchId: "",
    branchName: "",
  });
  const { branchesData, isLoading } = useBranch();

  return (
    <div className={`min-h-screen ${appColorClasses.pageBg} flex flex-col items-center p-4 md:p-6 font-sans`}>
      {/* Welcome Header */}
      <header className="w-full max-w-md mt-8 mb-10 text-center">
        <h1 className={`text-3xl font-extrabold ${appColorClasses.textPrimary} tracking-tight`}>
          Welcome!
        </h1>
        <p className={`${appColorClasses.textSecondary} mt-2`}>กรุณาเลือกสาขาเพื่อจัดการข้อมูล</p>
      </header>

      {isLoading ? (
        <div className="w-full max-w-md flex justify-center py-10">
          <LoaderIcon className={`w-8 h-8 animate-spin ${appColorClasses.textMuted}`} />
        </div>
      ) : (
        <>
          {/* Branch Grid */}
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            {branchesData?.map((branch) => (
              <div
                key={branch.id}
                className={`group relative ${appColorClasses.cardBg} border ${appColorClasses.borderSoft} rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${intentColorClasses.brand.borderStrong.replace("border-", "hover:border-")} hover:shadow-md active:scale-95`}
              >
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditDialog({
                        isOpen: true,
                        branchId: branch.id,
                        branchName: branch.name,
                      });
                    }}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                    title="แก้ไขชื่อสาขา"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteDialog({
                        isOpen: true,
                        branchId: branch.id,
                        branchName: branch.name,
                      });
                    }}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    title="ลบสาขา"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Branch Link */}
                <Link
                  href={`/branch/${branch.id}`} // ไปที่หน้า Dashboard ของสาขานั้นๆ
                  className="flex flex-col items-center justify-center w-full h-full"
                >
                  <div className={`w-14 h-14 ${intentColorClasses.brand.bg} rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-100`}>
                    <Store className={`${intentColorClasses.brand.text} w-7 h-7`} />
                  </div>
                  <span className={`font-semibold ${appColorClasses.textPrimary} text-center`}>
                    {branch.name}
                  </span>
                </Link>
              </div>
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
                <div className="space-y-6">
                  <div className="space-y-2 text-center">
                    {/* ไอคอน + ในวงกลมตาม Wireframe */}
                    <div className={`mx-auto w-20 h-20 border-2 ${appColorClasses.borderSoft} rounded-full flex items-center justify-center bg-surface mb-4`}>
                      <Plus className={`${appColorClasses.textMuted} w-10 h-10`} />
                    </div>
                  </div>
                  <AddBranchForm 
                    onSuccess={() => setShowAddModal(false)}
                    onCancel={() => setShowAddModal(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer Info (Optional) */}
      <footer className={`mt-auto py-8 ${appColorClasses.textMuted} text-sm italic`}>
        Backend Managed by Supabase
      </footer>

      {/* Delete Branch Dialog */}
      <DeleteBranchDialog
        branchId={deleteDialog.branchId}
        branchName={deleteDialog.branchName}
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onSuccess={() => {
          // The useBranch hook will automatically refetch the data
          // due to revalidation in the server action
        }}
      />

      {/* Edit Branch Dialog */}
      <EditBranchDialog
        branchId={editDialog.branchId}
        branchName={editDialog.branchName}
        isOpen={editDialog.isOpen}
        onClose={() => setEditDialog({ ...editDialog, isOpen: false })}
        onSuccess={() => {
          // The useBranch hook will automatically refetch the data
          // due to revalidation in the server action
        }}
      />
    </div>
  );
}
