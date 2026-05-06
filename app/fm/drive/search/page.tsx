"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { searchDrive } from "@/app/lib/drive";
import { SearchInput } from "@/app/components/drive/search-input";
import { ViewToggle } from "@/app/components/ui/view-toggle";
import { BulkActionToolbar } from "@/app/components/drive/bulk-action-toolbar";
import { FileGrid } from "@/app/components/drive/file-grid";
import { Search } from "lucide-react";
import { Suspense, useEffect } from "react";
import { useSelectionStore } from "@/app/store/selectionStore";

function SearchToolbar({ query }: { query: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-8">
        <div className="flex-1 max-w-2xl flex flex-col gap-4">
          <div className="flex items-center gap-2 text-figma-text-muted">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Search Workspace</span>
          </div>
          <SearchInput variant="page" autoFocus={true} />
        </div>

        <div className="flex flex-col items-end gap-3 pb-0.5">
          <div className="text-[10px] font-bold text-figma-text-muted uppercase tracking-wider opacity-50">View Options</div>
          <ViewToggle />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-top-1 duration-200">
        <BulkActionToolbar />
      </div>

      {query && (
        <h2 className="text-white text-[13px] font-bold uppercase tracking-wider opacity-60">
          Results for <span className="text-figma-blue">"{query}"</span>
        </h2>
      )}
    </div>
  );
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const query = searchParams.get("q") || "";
  const { clear } = useSelectionStore();

  const { data: results, isLoading } = useQuery({
    queryKey: ["search-full", query],
    queryFn: () => searchDrive(query, session!.backendToken),
    enabled: !!query && !!session?.backendToken,
  });

  useEffect(() => {
    clear();
  }, [query, clear]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto flex flex-col gap-8">
      <SearchToolbar query={query} />

      <div className="min-h-[400px]">
        {query ? (
          <FileGrid items={results || []} isLoading={isLoading} context="drive" />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-figma-text-muted">
            <Search className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-[13px]">Type something in the search bar to find files and folders.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse text-figma-text-muted">Loading search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
