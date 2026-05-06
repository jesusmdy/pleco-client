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
        onClick={() => setIsRestoreOpen(true)}
        className="bg-figma-blue hover:bg-figma-blue/90 text-white shadow-sm flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-medium transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Restore ({count})
      </Button>

      <Button
        onClick={() => setIsDeleteOpen(true)}
        className="bg-figma-red hover:bg-figma-red/90 text-white shadow-sm flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-medium transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
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
