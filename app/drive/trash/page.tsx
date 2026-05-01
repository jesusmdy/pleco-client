"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { listTrash, searchTrash, trashItemToDriveItem } from "@/app/lib/drive";
import { FileGrid } from "@/app/components/drive/file-grid";
import { BulkActionToolbar } from "@/app/components/drive/bulk-action-toolbar";
import { TrashBulkActions } from "@/app/components/trash/trash-bulk-actions";
import { useSelectionStore } from "@/app/store/selectionStore";
import { useDebounce } from "@/app/hooks/useDebounce";
import { Search } from "lucide-react";

export default function TrashPage() {
  const { data: session } = useSession();
  const { clear } = useSelectionStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => () => clear(), []);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["trash", debouncedSearch],
    queryFn: () =>
      debouncedSearch
        ? searchTrash(debouncedSearch, session!.backendToken)
        : listTrash(session!.backendToken),
    enabled: !!session?.backendToken,
    staleTime: 0,
    refetchOnMount: true,
  });

  const driveItems = useMemo(() => items.map(trashItemToDriveItem), [items]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Trash</h1>

        <div className="flex items-center gap-4">
          {!isLoading && items.length > 0 && (
            <span className="text-discord-text-muted text-[14px]">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          )}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-discord-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search trash..."
              className="bg-discord-bg-tertiary text-white text-[14px] rounded-full pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-discord-blurple border border-transparent transition-all w-56"
            />
          </div>
        </div>
      </div>

      <BulkActionToolbar actions={<TrashBulkActions />} />

      <FileGrid items={driveItems} isLoading={isLoading} context="trash" />
    </div>
  );
}
