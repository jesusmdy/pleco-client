"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { FileGrid } from "@/app/components/drive/file-grid";
import { Breadcrumb } from "@/app/components/drive/breadcrumb";
import { useDrive } from "@/app/hooks/useDrive";
import { NewItemDropdown } from "@/app/components/drive/new-item-dropdown";
import { BulkActionToolbar } from "@/app/components/drive/bulk-action-toolbar";
import { useSelectionStore } from "@/app/store/selectionStore";

export default function FolderPage() {
  const params = useParams();
  const folderId = params.folderId as string;
  const { clear } = useSelectionStore();

  useEffect(() => () => clear(), [folderId]);
  const { folderContent, breadcrumb, isLoading, error } = useDrive(folderId);

  if (error) {
    return (
      <div className="bg-discord-red/10 border border-discord-red/20 rounded p-4 text-discord-text-danger max-w-md mx-auto mt-10">
        <p className="font-bold mb-1">Failed to load content</p>
        <p className="text-[14px]">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex-1 min-w-0">
          {breadcrumb && <Breadcrumb path={breadcrumb} />}
        </div>
        <div className="flex items-center shrink-0">
          <NewItemDropdown />
        </div>
      </div>
      <div className="p-4 border-t border-white/5">
        <BulkActionToolbar />
        <FileGrid items={folderContent || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
