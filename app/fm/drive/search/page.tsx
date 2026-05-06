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
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-12">
        <div className="flex-1 max-w-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3 text-md-on-surface-variant">
            <Search className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Search Workspace</span>
          </div>
          <SearchInput variant="page" autoFocus={true} />
        </div>

        <div className="flex flex-col items-end gap-3.5 pb-1">
          <div className="text-[11px] font-bold text-md-on-surface-variant uppercase tracking-widest opacity-70">View Options</div>
          <ViewToggle />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-top-1 duration-300">
        <BulkActionToolbar />
      </div>

      {query && (
        <h2 className="text-md-on-surface-variant text-[14px] font-bold uppercase tracking-widest px-1">
          Results for <span className="text-md-primary">"{query}"</span>
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
    <div className="p-8 w-full max-w-[1600px] mx-auto flex flex-col gap-12">
      <SearchToolbar query={query} />

      <div className="min-h-[400px]">
        {query ? (
          <FileGrid items={results || []} isLoading={isLoading} context="drive" />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-md-on-surface-variant/50">
            <Search className="w-20 h-20 mb-6 opacity-20" />
            <p className="text-[16px] font-medium">Type something in the search bar to find files and folders.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse text-md-on-surface-variant font-bold uppercase tracking-widest text-[14px]">Initializing search context...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
