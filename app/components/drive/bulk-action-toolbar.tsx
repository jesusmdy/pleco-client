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
      className="bg-figma-red hover:bg-figma-red/90 text-white shadow-sm flex items-center gap-1.5 px-3 h-7 rounded-md text-[12px] font-medium transition-all cursor-pointer"
    >
      <Trash2 className="w-3.5 h-3.5" />
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
      <div className="h-9 flex items-center justify-between px-3 rounded-md bg-figma-blue/10 border border-figma-blue/20 animate-in fade-in duration-200 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={clear}
            className="p-1 hover:bg-figma-blue/20 rounded-md text-figma-blue transition-colors"
            title="Deselect all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <span className="text-figma-blue text-[12px] font-bold whitespace-nowrap">
            {count} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {actions ?? <DriveDeleteButton onClick={() => setIsDeleteOpen(true)} count={count} />}
        </div>
      </div>

      <BulkDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
    </>
  );
}
