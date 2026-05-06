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
      className={`flex items-center gap-4 py-2 px-4 cursor-pointer group transition-all mx-1 my-0.5 rounded-xl ${
        selected ? "bg-md-primary-container/40" : "hover:bg-md-surface-container-low"
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-md-surface-container-highest border border-md-outline-variant/10 overflow-hidden">
          {isFolder ? (
            <Folder className={`w-4 h-4 ${selected ? "text-md-primary" : "text-md-on-surface-variant"}`} />
          ) : item.hasThumb200 ? (
            <Thumbnail itemId={item.id} size={200} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <FileText className={`w-4 h-4 ${selected ? "text-md-primary" : "text-md-on-surface-variant"}`} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-md-on-surface text-[13px] font-bold truncate select-none">
            {item.name}
          </div>
        </div>
      </div>

      <div className="w-24 text-md-on-surface-variant text-[12px] font-bold hidden sm:block">
        {isFolder ? "--" : formatBytes(item.size || 0)}
      </div>

      <div className="w-32 text-md-on-surface-variant text-[12px] font-bold hidden md:block text-right pr-4">
        {new Date(item.createdAt).toLocaleDateString()}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {selected ? (
          <CheckCircle2 className="w-4 h-4 text-md-primary shrink-0" />
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
