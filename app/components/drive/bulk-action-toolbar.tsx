"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Button } from "@/app/components/ui/button";
import { BulkDeleteModal } from "./bulk-delete-modal";

function DriveDeleteButton() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { selectedIds } = useSelectionStore();
  const count = selectedIds.size;

  return (
    <>
      <Button
        onClick={() => setIsDeleteOpen(true)}
        className="bg-discord-red hover:bg-discord-red/80 text-white shadow-sm flex items-center gap-2 text-[14px]"
      >
        <Trash2 className="w-4 h-4" />
        Delete ({count})
      </Button>
      <BulkDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
    </>
  );
}

interface BulkActionToolbarProps {
  actions?: React.ReactNode;
}

export function BulkActionToolbar({ actions }: BulkActionToolbarProps) {
  const { selectedIds, clear } = useSelectionStore();
  const count = selectedIds.size;

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-4 mb-4 py-2 px-3 rounded-lg bg-discord-bg-secondary border border-white/10 animate-in fade-in duration-150">
      <span className="text-white text-[14px] font-medium">
        {count} item{count !== 1 ? "s" : ""} selected
      </span>

      <button
        onClick={clear}
        className="text-[13px] text-discord-text-muted hover:text-white transition-colors flex items-center gap-1"
      >
        <X className="w-3.5 h-3.5" />
        Deselect all
      </button>

      <div className="ml-auto flex items-center gap-2">
        {actions ?? <DriveDeleteButton />}
      </div>
    </div>
  );
}
