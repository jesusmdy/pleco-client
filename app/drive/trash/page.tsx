"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { listTrash, searchTrash } from "@/app/lib/drive";
import { TrashToolbar } from "@/app/components/trash/trash-toolbar";
import { TrashItemList } from "@/app/components/trash/trash-item-list";
import { RestoreModal } from "@/app/components/trash/restore-modal";
import { PermanentDeleteModal } from "@/app/components/trash/permanent-delete-modal";
import { useDebounce } from "@/app/hooks/useDebounce";

export default function TrashPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

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

  const allSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds.size]
  );

  const handleToggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.size === items.length ? new Set() : new Set(items.map(i => i.id))
    );
  }, [items]);

  const handleActionSuccess = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Trash</h1>
        {!isLoading && items.length > 0 && (
          <span className="text-discord-text-muted text-[14px]">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <TrashToolbar
        search={search}
        onSearchChange={setSearch}
        selectedCount={selectedIds.size}
        totalCount={items.length}
        allSelected={allSelected}
        onSelectAll={handleSelectAll}
        onRestore={() => setIsRestoreOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <TrashItemList
        items={items}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onToggle={handleToggle}
      />

      <RestoreModal
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        selectedIds={selectedIds}
        onSuccess={handleActionSuccess}
      />

      <PermanentDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        selectedIds={selectedIds}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}
