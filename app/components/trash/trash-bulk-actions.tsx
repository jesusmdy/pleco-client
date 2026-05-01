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
        className="bg-discord-blurple hover:bg-discord-blurple/80 text-white shadow-sm flex items-center gap-2 text-[14px]"
      >
        <RotateCcw className="w-4 h-4" />
        Restore ({count})
      </Button>

      <Button
        onClick={() => setIsDeleteOpen(true)}
        className="bg-discord-red hover:bg-discord-red/80 text-white shadow-sm flex items-center gap-2 text-[14px]"
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
