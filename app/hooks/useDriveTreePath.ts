import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getFolderTree, UnifiedDriveItem } from "@/app/lib/drive";

/**
 * Hook to fetch the entire folder tree and provide path-based state
 * to support instant expansion in the sidebar tree.
 */
export function useDriveTreePath() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const token = (session as any)?.backendToken;
  
  // Extract folderId from /fm/drive/folders/[folderId]
  const match = pathname.match(/\/fm\/drive\/folders\/([^\/]+)/);
  const currentFolderId = match ? match[1] : null;

  // Fetch the entire folder tree at once
  const { data: treeItems, isLoading } = useQuery({
    queryKey: ["folderTreeFull"],
    queryFn: () => getFolderTree(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Pre-process the flat list into a Parent-Child mapping for instant lookups
  const folderMap: Record<string, UnifiedDriveItem[]> = {};
  treeItems?.forEach(item => {
    const parentKey = item.parentId || "root";
    if (!folderMap[parentKey]) folderMap[parentKey] = [];
    folderMap[parentKey].push(item);
  });

  // Identify the path to the current folder for auto-expansion
  const currentItem = treeItems?.find(i => i.id === currentFolderId);
  const pathIds = currentItem ? [...currentItem.path, currentItem.id] : [];
  
  const isRootActive = pathname === "/fm/drive";

  return {
    currentFolderId,
    pathIds,
    folderMap,
    isRootActive,
    token,
    pathname,
    isLoading
  };
}
