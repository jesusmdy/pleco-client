"use client";

import { useRef, useState } from "react";
import { Folder, FileText, Lock } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useRouter } from "next/navigation";
import { FileActionMenu, FileActionTrigger } from "./file-action-menu";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Thumbnail } from "./thumbnail";
import { cn } from "@/app/lib/utils";

import { Card } from "../ui/card";

export type FileCardContext = "drive" | "trash";

interface FileCardProps {
  item: UnifiedDriveItem;
  context?: FileCardContext;
}

const DOUBLE_CLICK_MS = 220;

export function FileCard({ item, context = "drive" }: FileCardProps) {
  const router = useRouter();
  const isFolder = item.itemType === "FOLDER";
  const isTrash = context === "trash";
  const { toggle, isSelected } = useSelectionStore();
  const selected = isSelected(item.id);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleOpen = () => {
    if (isTrash) return;
    if (isFolder) router.push(`/fm/drive/folders/${item.id}`);
  };

  const handleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      handleOpen();
      return;
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      toggle(item.id);
    }, DOUBLE_CLICK_MS);
  };

  if (isFolder) {
    return (
      <Card
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        selected={selected}
        className="flex items-center justify-between px-4 h-14 group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Folder
            className={cn(
              "w-5 h-5 shrink-0 transition-colors",
              selected ? "text-md-primary" : "text-md-on-surface-variant group-hover:text-md-primary"
            )}
          />
          <span className="text-[14px] font-semibold tracking-tight truncate">{item.name}</span>
        </div>
        <div className={cn(
          "transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <FileActionTrigger item={item} context={context} />
        </div>

        {contextMenu && (
          <FileActionMenu 
            item={item} 
            x={contextMenu.x} 
            y={contextMenu.y} 
            context={context}
            onClose={() => setContextMenu(null)} 
          />
        )}
      </Card>
    );
  }

  return (
    <Card
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      selected={selected}
      className="flex flex-col h-60 group"
    >
      {/* File Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileText
            className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              selected ? "text-md-primary" : "text-md-on-surface-variant group-hover:text-md-primary"
            )}
          />
          <span className="text-[13px] font-semibold tracking-tight truncate">
            {item.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {item.encrypted && !selected && !isTrash && <Lock className="w-3.5 h-3.5 text-md-on-surface-variant/60" />}
          <div className={cn(
            "transition-opacity duration-200",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <FileActionTrigger item={item} context={context} />
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div
        className={cn(
          "flex-1 mx-4 mb-4 rounded-2xl border border-md-outline-variant/10 overflow-hidden flex items-center justify-center transition-all duration-300",
          selected ? "bg-md-surface-container-low shadow-inner" : "bg-md-surface-container-highest/50"
        )}
      >
        {item.hasThumb500 ? (
          <Thumbnail 
            itemId={item.id} 
            size={500} 
            alt={item.name} 
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              selected ? "opacity-90" : "opacity-100"
            )}
          />
        ) : (
          <div className={cn(
            "flex flex-col items-center gap-2 transition-colors duration-300",
            selected ? "text-md-primary opacity-60" : "opacity-20"
          )}>
            <FileText className="w-10 h-10" />
            <span className="text-[11px] font-bold uppercase tracking-wider hidden group-hover:block">No preview</span>
          </div>
        )}
      </div>

      {contextMenu && (
        <FileActionMenu 
          item={item} 
          x={contextMenu.x} 
          y={contextMenu.y} 
          context={context}
          onClose={() => setContextMenu(null)} 
        />
      )}
    </Card>
  );
}
