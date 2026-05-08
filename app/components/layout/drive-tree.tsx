"use client";

import { useDriveTreePath } from "@/app/hooks/useDriveTreePath";
import { TreeNode } from "./tree-node";
import { Loader2 } from "lucide-react";

/**
 * Main DriveTree component that orchestrates the sidebar folder navigation.
 * Uses useDriveTreePath for logic and TreeNode for recursive rendering.
 */
export function DriveTree() {
  const { pathIds, folderMap, isRootActive, token, pathname, isLoading } = useDriveTreePath();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-md-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <TreeNode
        id={null}
        name="My Drive"
        depth={0}
        isActive={isRootActive}
        isRoot={true}
        pathIds={pathIds}
        token={token}
        pathname={pathname}
        folderMap={folderMap}
      />
    </div>
  );
}
