"use client";

import { Loader2 } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { SearchResultItem } from "./search-result-item";

interface SearchResultsDropdownProps {
  isLoading: boolean;
  results: UnifiedDriveItem[] | undefined;
  debouncedQuery: string;
  onSelect: () => void;
  onSeeAll: () => void;
}

export function SearchResultsDropdown({ 
  isLoading, 
  results, 
  debouncedQuery, 
  onSelect, 
  onSeeAll 
}: SearchResultsDropdownProps) {
  return (
    <div className="absolute top-full left-0 w-full mt-1 bg-figma-dark border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden max-h-80 flex flex-col">
      {isLoading ? (
        <div className="p-4 flex items-center justify-center gap-2 text-figma-text-muted text-[12px]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-figma-blue" />
          Searching...
        </div>
      ) : results && results.length > 0 ? (
        <div className="py-1 overflow-y-auto overflow-x-hidden">
          {results.slice(0, 8).map((item) => (
            <SearchResultItem 
              key={item.id} 
              item={item} 
              onClick={onSelect} 
            />
          ))}
          {results.length > 8 && (
            <button
              onClick={onSeeAll}
              className="w-full py-2 text-[11px] text-figma-blue font-bold uppercase tracking-wider hover:bg-figma-blue/5 border-t border-white/5 transition-all"
            >
              See all results
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-figma-text-muted text-[12px]">
          No results found for "{debouncedQuery}"
        </div>
      )}
    </div>
  );
}
