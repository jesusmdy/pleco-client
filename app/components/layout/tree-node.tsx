"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Folder, HardDrive } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { FileActionMenu } from "@/app/components/drive/file-action-menu";

interface TreeNodeProps {
  id: string | null;
  name: string;
  depth: number;
  isActive: boolean;
  isRoot?: boolean;
  pathIds: string[];
  token: string | undefined;
  pathname: string;
  folderMap: Record<string, UnifiedDriveItem[]>;
  item?: UnifiedDriveItem;
}

export function TreeNode({ 
  id, 
  name, 
  depth, 
  isActive, 
  isRoot = false, 
  pathIds, 
  token, 
  pathname,
  folderMap,
  item
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Auto-expand if this folder is in the current path
  useEffect(() => {
    if (id && pathIds.includes(id)) {
      setIsExpanded(true);
    }
    if (id === null && pathIds.length >= 0) {
      setIsExpanded(true);
    }
  }, [id, pathIds]);

  const folders = folderMap[id || "root"] || [];

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Shim for root node if item is missing
    const activeItem = item || (isRoot ? {
      id: null,
      name: "My Drive",
      itemType: "FOLDER",
      parentId: null,
      size: 0,
      depth: 0,
      path: [],
      encrypted: true,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UnifiedDriveItem : null);

    if (!activeItem) return;
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const href = id === null ? "/fm/drive" : `/fm/drive/folders/${id}`;

  return (
    <div className="flex flex-col">
      <div
        onContextMenu={handleContextMenu}
        className={cn(
          "flex items-center gap-1 min-h-[40px] px-2 rounded-xl transition-all duration-200 group relative",
          isActive 
            ? "bg-md-primary-container text-md-on-primary-container font-semibold" 
            : "text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface"
        )}
      >
        {depth > 0 && <div className="flex shrink-0" style={{ width: depth * 12 }} />}

        <button
          onClick={toggleExpand}
          className="p-1 rounded-full hover:bg-black/5 transition-all duration-200 shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <Link 
          href={href} 
          className="flex items-center gap-3 flex-1 min-w-0 py-2 overflow-hidden select-none"
        >
          {isRoot ? (
            <HardDrive className={cn("w-5 h-5 shrink-0", isActive ? "text-md-primary" : "text-md-on-surface-variant")} />
          ) : (
            <Folder className={cn("w-5 h-5 shrink-0", isActive ? "text-md-primary" : "text-md-on-surface-variant")} />
          )}
          <span className="text-[14px] truncate tracking-tight">{name}</span>
        </Link>
      </div>

      {isExpanded && folders.length > 0 && (
        <div className="flex flex-col mt-0.5">
          {folders.map((folder) => (
            <TreeNode
              key={folder.id}
              id={folder.id}
              name={folder.name}
              depth={depth + 1}
              isActive={pathname === `/fm/drive/folders/${folder.id}`}
              pathIds={pathIds}
              token={token}
              pathname={pathname}
              folderMap={folderMap}
              item={folder}
            />
          ))}
        </div>
      )}

      {contextMenu && (
        <FileActionMenu
          item={item || {
            id: null,
            name: "My Drive",
            itemType: "FOLDER",
            parentId: null,
            size: 0,
            depth: 0,
            path: [],
            encrypted: true,
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as UnifiedDriveItem}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
