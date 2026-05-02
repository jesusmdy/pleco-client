"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { useSession } from "next-auth/react";
import { FileGrid } from "@/app/components/drive/file-grid";
import { Breadcrumb } from "@/app/components/drive/breadcrumb";
import { useDrive } from "@/app/hooks/useDrive";
import { NewItemDropdown } from "@/app/components/drive/new-item-dropdown";
import { BulkActionToolbar } from "@/app/components/drive/bulk-action-toolbar";
import { useSelectionStore } from "@/app/store/selectionStore";

export default function DriveRootPage() {
  const { data: session } = useSession();
  const { folderContent, isLoading, error } = useDrive(null);
  const { clear } = useSelectionStore();

  useEffect(() => () => clear(), []);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(session!.backendToken),
    enabled: !!session?.backendToken,
    retry: false,
  });

  if (error) {
    return (
      <div className="bg-discord-red/10 border border-discord-red/20 rounded p-4 text-discord-text-danger max-w-md mx-auto mt-10">
        <p className="font-bold mb-1">Failed to load content</p>
        <p className="text-[14px]">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex-1 min-w-0">
          <Breadcrumb path={[]} />
        </div>
        <div className="flex items-center shrink-0">
          <NewItemDropdown />
        </div>
      </div>
      <BulkActionToolbar />
      <FileGrid items={folderContent || []} isLoading={isLoading} />
    </div>
  );
}
