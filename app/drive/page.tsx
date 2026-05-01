"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { useSession } from "next-auth/react";
import { FileGrid } from "@/app/components/drive/file-grid";
import { Breadcrumb } from "@/app/components/drive/breadcrumb";
import { useDrive } from "@/app/hooks/useDrive";

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
      <Breadcrumb path={[]} />
      <FileGrid items={folderContent || []} isLoading={isLoading} />
    </div>
  );
}
