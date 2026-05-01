import { useQuery } from "@tanstack/react-query";
import { getRootFolders, getFolderChildren, getBreadcrumb } from "@/app/lib/api";
import { useSession } from "next-auth/react";

export function useDrive(currentFolderId: string | null) {
  const { data: session } = useSession();
  const token = session?.backendToken;

  const { data: folderContent, isLoading, error } = useQuery({
    queryKey: ["folderContent", currentFolderId || "root"],
    queryFn: () => currentFolderId 
      ? getFolderChildren(currentFolderId, token!)
      : getRootFolders(token!),
    enabled: !!token,
  });

  const { data: breadcrumb } = useQuery({
    queryKey: ["breadcrumb", currentFolderId],
    queryFn: () => getBreadcrumb(currentFolderId!, token!),
    enabled: !!token && !!currentFolderId,
  });

  return { folderContent, breadcrumb, isLoading, error };
}
