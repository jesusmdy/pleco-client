"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { useSession } from "next-auth/react";
import { FileGrid } from "@/app/components/drive/file-grid";
import { Breadcrumb } from "@/app/components/drive/breadcrumb";
import { useDrive } from "@/app/hooks/useDrive";
import { CreateFolderButton } from "@/app/components/drive/create-folder-button";
import { UploadFileButton } from "@/app/components/drive/upload-file-button";

export default function DriveRootPage() {
  const { data: session } = useSession();
  const { folderContent, isLoading, error } = useDrive(null);

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
        <div className="flex items-center gap-3 shrink-0">
          <UploadFileButton />
          <CreateFolderButton />
        </div>
      </div>
      <FileGrid items={folderContent || []} isLoading={isLoading} />
    </div>
  );
}
