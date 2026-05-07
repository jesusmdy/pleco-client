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
    <div className="h-16 flex items-center px-8 justify-between shrink-0 bg-md-surface-container-low border-b border-md-outline-variant/10 gap-8 mb-2 transition-all duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0 flex items-baseline gap-4">
          <h1 className="text-[22px] font-semibold text-md-on-surface tracking-tight truncate">{title}</h1>
          {subtitle && (
            <span className="text-[14px] text-md-on-surface-variant tracking-tight font-medium truncate opacity-70">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        {onSearchChange && (
          <div className="relative w-72 hidden lg:block group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-md-on-surface-variant group-focus-within:text-md-primary transition-colors" />
            <input
              type="text"
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-md-surface-container-highest text-md-on-surface text-[14px] font-semibold rounded-full pl-11 pr-4 h-11 outline-none focus:ring-2 focus:ring-md-primary/20 border border-md-outline-variant/10 focus:border-md-primary transition-all placeholder:text-md-on-surface-variant/40"
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
