"use client";

import { useRef, useState } from "react";
import { Folder, FileText, CheckCircle2 } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useRouter } from "next/navigation";
import { FileActionMenu, FileActionTrigger } from "./file-action-menu";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Thumbnail } from "./thumbnail";
import { formatBytes } from "@/app/lib/utils";

interface FileListItemProps {
  item: UnifiedDriveItem;
  context?: "drive" | "trash";
}

const DOUBLE_CLICK_MS = 220;

export function FileListItem({ item, context = "drive" }: FileListItemProps) {
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

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`flex items-center gap-3 py-1.5 px-3 cursor-pointer group transition-all border-b border-black/10 ${
        selected ? "bg-figma-blue/10" : "hover:bg-figma-hover"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 shrink-0 rounded-md flex items-center justify-center bg-figma-bg border border-white/5 overflow-hidden">
          {isFolder ? (
            <Folder className={`w-3.5 h-3.5 ${selected ? "text-figma-blue" : "text-figma-text-muted"}`} />
          ) : item.hasThumb200 ? (
            <Thumbnail itemId={item.id} size={200} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <FileText className={`w-3.5 h-3.5 ${selected ? "text-figma-blue" : "text-figma-text-muted"}`} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-white text-[12px] font-medium truncate select-none">
            {item.name}
          </div>
        </div>
      </div>

      <div className="w-20 text-figma-text-muted text-[11px] font-medium hidden sm:block">
        {isFolder ? "--" : formatBytes(item.size || 0)}
      </div>

      <div className="w-28 text-figma-text-muted text-[11px] font-medium hidden md:block text-right pr-4">
        {new Date(item.createdAt).toLocaleDateString()}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {selected ? (
          <CheckCircle2 className="w-4 h-4 text-figma-blue shrink-0" />
        ) : !isTrash ? (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FileActionTrigger item={item} context={context} />
          </div>
        ) : null}
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
    </div>
  );
}
