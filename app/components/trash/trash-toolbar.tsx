"use client";

import { Search } from "lucide-react";
import { ViewToggle } from "@/app/components/ui/view-toggle";
import { EmptyTrash } from "./empty-trash";

interface TrashToolbarProps {
  subtitle?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  itemIds?: string[];
}

export function TrashToolbar({
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  itemIds = [],
}: TrashToolbarProps) {
  const title = "Trash Bin";
  const showViewToggle = true;

  return (
    <div className="h-10 flex items-center px-3 justify-between shrink-0 bg-figma-dark border-b border-black/20 gap-4 mb-4">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="min-w-0 flex items-baseline gap-2">
          <h1 className="text-[13px] font-bold text-white truncate">{title}</h1>
          {subtitle && (
            <span className="text-[10px] text-figma-text-muted uppercase tracking-wider font-semibold truncate opacity-80">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {onSearchChange && (
          <div className="relative w-56 hidden md:block">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-figma-text-muted" />
            <input
              type="text"
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-figma-bg text-white text-[11px] rounded-md pl-8 pr-3 py-1 outline-none focus:ring-1 focus:ring-figma-blue border border-white/5 transition-all"
            />
          </div>
        )}

        {showViewToggle && (
          <div className="flex items-center gap-3">
            {onSearchChange && <div className="w-[1px] h-3.5 bg-white/5" />}
            <ViewToggle />
          </div>
        )}

        {itemIds.length > 0 && (
          <>
            <div className="w-[1px] h-3.5 bg-white/5" />
            <EmptyTrash itemIds={itemIds} />
          </>
        )}
      </div>
    </div>
  );
}
