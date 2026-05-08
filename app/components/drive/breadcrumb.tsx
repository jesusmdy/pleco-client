"use client";

import { useState } from "react";
import { BreadcrumbNode, UnifiedDriveItem } from "@/app/lib/drive";
import { BreadcrumbItem } from "./breadcrumb-item";
import { BreadcrumbSeparator } from "./breadcrumb-separator";
import { FileActionMenu } from "./file-action-menu";

interface BreadcrumbProps {
  path: BreadcrumbNode[];
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item: UnifiedDriveItem } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, node: BreadcrumbNode) => {
    e.preventDefault();
    e.stopPropagation();

    // Shim UnifiedDriveItem for breadcrumb nodes
    const item: UnifiedDriveItem = {
      id: node.id,
      name: node.name,
      itemType: "FOLDER",
      parentId: null,
      size: 0,
      depth: 0,
      path: [],
      encrypted: true,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hasThumb200: false,
      hasThumb500: false,
    };

    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  return (
    <div className="flex items-center overflow-x-auto">
      <BreadcrumbItem 
        href="/fm/drive" 
        label="My Drive" 
        isLast={path.length === 0} 
      />
      
      {path.map((node, index) => {
        const isLast = index === path.length - 1;
        return (
          <div key={node.id} className="flex items-center shrink-0">
            <BreadcrumbSeparator />
            <BreadcrumbItem 
              href={`/fm/drive/folders/${node.id}`} 
              label={node.name} 
              isLast={isLast} 
              onContextMenu={(e) => handleContextMenu(e, node)}
              onClick={(e) => {
                if (isLast) {
                  e.preventDefault();
                  handleContextMenu(e, node);
                }
              }}
            />
          </div>
        );
      })}

      {contextMenu && (
        <FileActionMenu
          item={contextMenu.item}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
