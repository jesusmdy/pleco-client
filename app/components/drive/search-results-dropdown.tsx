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
    <div className="absolute top-full left-0 w-full mt-2 bg-md-surface-container border border-md-outline-variant/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden max-h-96 flex flex-col animate-in fade-in slide-in-from-top-1 duration-200">
      {isLoading ? (
        <div className="p-6 flex items-center justify-center gap-3 text-md-on-surface-variant text-[13px] font-bold">
          <Loader2 className="w-4 h-4 animate-spin text-md-primary" />
          Searching...
        </div>
      ) : results && results.length > 0 ? (
        <div className="py-2 overflow-y-auto overflow-x-hidden">
          <div className="px-4 py-2 mb-1">
            <p className="text-[11px] font-bold text-md-on-surface-variant uppercase tracking-widest">Quick Results</p>
          </div>
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
              className="w-full py-3 text-[12px] text-md-primary font-bold uppercase tracking-widest hover:bg-md-primary/5 border-t border-md-outline-variant/10 transition-all"
            >
              See all results
            </button>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-md-on-surface-variant text-[13px] font-medium italic">
          No results found for <span className="text-md-on-surface not-italic font-bold">"{debouncedQuery}"</span>
        </div>
      )}
    </div>
  );
}
