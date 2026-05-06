"use client";

import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Button } from "@/app/components/ui/button";
import { RestoreModal } from "./restore-modal";
import { PermanentDeleteModal } from "./permanent-delete-modal";

export function TrashBulkActions() {
  const { selectedIds, clear } = useSelectionStore();
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const count = selectedIds.size;

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsRestoreOpen(true)}
        className="h-9 px-4 text-[13px] font-bold"
      >
        <RotateCcw className="w-4 h-4" />
        Restore ({count})
      </Button>

      <Button
        onClick={() => setIsDeleteOpen(true)}
        className="h-9 px-4 text-[13px] font-bold bg-md-error text-md-on-error hover:bg-md-error/90 shadow-lg shadow-md-error/20"
      >
        <Trash2 className="w-4 h-4" />
        Delete Forever ({count})
      </Button>

      <RestoreModal
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        selectedIds={selectedIds}
        onSuccess={clear}
      />
      <PermanentDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        selectedIds={selectedIds}
        onSuccess={clear}
      />
    </>
  );
}
