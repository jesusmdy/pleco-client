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
import { TrashToolbar } from "@/app/components/trash/trash-toolbar";

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10">
        <TrashToolbar
          subtitle={!isLoading ? `${items.length} items` : "Loading..."}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search trash..."
          itemIds={items.map(i => i.id)}
        />

        <div className="space-y-4 p-3">
          <BulkActionToolbar actions={<TrashBulkActions />} />
          <FileGrid items={driveItems} isLoading={isLoading} context="trash" />
        </div>
      </div>
    </div>
  );
}
