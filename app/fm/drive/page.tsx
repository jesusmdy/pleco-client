"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { useSession } from "next-auth/react";
import { FileGrid } from "@/app/components/drive/file-grid";
import { useDrive } from "@/app/hooks/useDrive";
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-container scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10">
        <BulkActionToolbar />
        <FileGrid items={folderContent || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
