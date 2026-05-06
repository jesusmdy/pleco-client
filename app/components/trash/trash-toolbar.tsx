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
    <div className="h-14 flex items-center px-4 justify-between shrink-0 bg-md-surface-container-low border-b border-md-outline-variant/10 gap-6 mb-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0 flex items-baseline gap-3">
          <h1 className="text-[18px] font-bold text-md-on-surface truncate">{title}</h1>
          {subtitle && (
            <span className="text-[13px] text-md-on-surface-variant tracking-tight font-semibold truncate opacity-80">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        {onSearchChange && (
          <div className="relative w-64 hidden lg:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-md-on-surface-variant" />
            <input
              type="text"
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-md-surface-container-highest text-md-on-surface text-[13px] font-bold rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-md-primary/20 border border-md-outline-variant/10 transition-all placeholder:text-md-on-surface-variant/40"
            />
          </div>
        )}

        {showViewToggle && (
          <div className="flex items-center gap-4">
            {onSearchChange && <div className="w-[1px] h-4 bg-md-outline-variant/20" />}
            <ViewToggle />
          </div>
        )}

        {itemIds.length > 0 && (
          <>
            <div className="w-[1px] h-4 bg-md-outline-variant/20" />
            <EmptyTrash itemIds={itemIds} />
          </>
        )}
      </div>
    </div>
  );
}
