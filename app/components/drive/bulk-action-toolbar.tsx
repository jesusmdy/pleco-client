"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Button } from "@/app/components/ui/button";
import { BulkDeleteModal } from "./bulk-delete-modal";

function DriveDeleteButton({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      className="bg-md-error text-md-on-error hover:bg-md-error/90 shadow-lg shadow-md-error/20 flex items-center gap-2 px-4 h-8 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
    >
      <Trash2 className="w-4 h-4" />
      Delete ({count})
    </button>
  );
}

interface BulkActionToolbarProps {
  actions?: React.ReactNode;
}

export function BulkActionToolbar({ actions }: BulkActionToolbarProps) {
  const { selectedIds, clear } = useSelectionStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const count = selectedIds.size;

  if (count === 0) return null;

  return (
    <>
      <div className="h-12 flex items-center justify-between px-4 rounded-xl bg-md-primary-container border border-md-primary/10 animate-in slide-in-from-top-2 duration-300 mb-6 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={clear}
            className="p-1.5 hover:bg-md-on-primary-container/10 rounded-full text-md-on-primary-container transition-all active:scale-90"
            title="Deselect all"
          >
            <X className="w-4.5 h-4.5" />
          </button>
          <span className="text-md-on-primary-container text-[14px] font-bold uppercase tracking-widest whitespace-nowrap">
            {count} items selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          {actions ?? <DriveDeleteButton onClick={() => setIsDeleteOpen(true)} count={count} />}
        </div>
      </div>

      <BulkDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
    </>
  );
}
