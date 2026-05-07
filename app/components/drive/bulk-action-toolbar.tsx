"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Button } from "@/app/components/ui/button";
import { Chip } from "@/app/components/ui/chip";
import { BulkDeleteModal } from "./bulk-delete-modal";

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
      <div className="fixed bottom-12 left-[calc(50%+var(--sidebar-width)/2)] -translate-x-1/2 z-[100] h-16 flex items-center gap-8 pl-3 pr-6 rounded-full bg-md-surface-container-highest shadow-2xl border border-md-outline-variant/10 animate-in fade-in slide-in-from-bottom-8 duration-500 backdrop-blur-xl bg-opacity-90 min-w-max">
        <div className="flex items-center gap-3">
          <Button
            variant="text"
            size="icon"
            onClick={clear}
            title="Deselect all"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <Chip variant="primary">
            {count} {count === 1 ? "item" : "items"} selected
          </Chip>
        </div>

        <div className="flex items-center gap-3">
          {actions}
          <Button
            variant="error"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="w-4.5 h-4.5" />
            Delete items
          </Button>
        </div>
      </div>

      <BulkDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
      />
    </>
  );
}
