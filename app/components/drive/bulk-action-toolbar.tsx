"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Button } from "@/app/components/ui/button";
import { Chip } from "@/app/components/ui/chip";
import { BulkDeleteModal } from "./bulk-delete-modal";

interface BulkActionToolbarProps {
  actions?: React.ReactNode;
  showDefaultDelete?: boolean;
}

export function BulkActionToolbar({ actions, showDefaultDelete = true }: BulkActionToolbarProps) {
  const { selectedIds, clear } = useSelectionStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const count = selectedIds.size;

  if (count === 0) return null;

  return (
    <>
      <div className="w-full h-16 flex items-center justify-between px-4 rounded-2xl bg-md-surface-container border border-md-outline-variant/10 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-3">
          <Button
            variant="text"
            size="icon"
            onClick={clear}
            title="Deselect all"
            className="hover:bg-md-surface-variant/20"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <Chip variant="primary" className="h-9 px-4">
            <span className="font-bold">{count}</span> {count === 1 ? "item" : "items"} selected
          </Chip>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {showDefaultDelete && (
            <Button
              variant="error"
              onClick={() => setIsDeleteOpen(true)}
              className="h-9 px-5 font-bold"
            >
              <Trash2 className="w-4 h-4" />
              Delete Items
            </Button>
          )}
        </div>
      </div>

      <BulkDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
      />
    </>
  );
}
