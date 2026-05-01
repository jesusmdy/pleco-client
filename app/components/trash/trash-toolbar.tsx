"use client";

import { Search, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface TrashToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onSelectAll: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export function TrashToolbar({
  search,
  onSearchChange,
  selectedCount,
  totalCount,
  allSelected,
  onSelectAll,
  onRestore,
  onDelete,
}: TrashToolbarProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-discord-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search trash..."
          className="w-full bg-discord-bg-tertiary text-white text-[14px] rounded-full pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-discord-blurple border border-transparent transition-all"
        />
      </div>

      {totalCount > 0 && (
        <label className="flex items-center gap-2 text-discord-text-muted text-[14px] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="w-4 h-4 rounded accent-discord-blurple cursor-pointer"
          />
          Select all
        </label>
      )}

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <Button
            onClick={onRestore}
            className="flex items-center gap-2 bg-discord-blurple hover:bg-discord-blurple/80 text-white shadow-sm text-[14px]"
          >
            <RotateCcw className="w-4 h-4" />
            Restore ({selectedCount})
          </Button>
          <Button
            onClick={onDelete}
            className="flex items-center gap-2 bg-discord-red hover:bg-discord-red/80 text-white shadow-sm text-[14px]"
          >
            <Trash2 className="w-4 h-4" />
            Delete Forever ({selectedCount})
          </Button>
        </div>
      )}
    </div>
  );
}
