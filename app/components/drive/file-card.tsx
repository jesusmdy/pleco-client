"use client";

import { useRef, useState } from "react";
import { Folder, FileText, Lock, CheckCircle2 } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useRouter } from "next/navigation";
import { FileActionMenu, FileActionTrigger } from "./file-action-menu";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Thumbnail } from "./thumbnail";

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
    if (isTrash) return; // no navigation in trash context
    if (isFolder) router.push(`/fm/drive/folders/${item.id}`);
  };

  const handleClick = () => {
    if (clickTimer.current) {
      // Second click within window → double-click → open
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      handleOpen();
      return;
    }
    // First click → wait to see if second comes
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      toggle(item.id);
    }, DOUBLE_CLICK_MS);
  };

  if (isFolder) {
    return (
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`flex items-center justify-between rounded-md px-2 py-1.5 cursor-pointer group transition-all border ${
          selected
            ? "bg-figma-blue/10 border-figma-blue"
            : "bg-[#2c2c2c] hover:bg-figma-hover border-white/5"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Folder
            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
              selected ? "text-figma-blue" : "text-figma-text-muted group-hover:text-figma-blue"
            }`}
          />
          <span className="text-white text-[12px] font-medium truncate select-none">{item.name}</span>
        </div>
        {selected ? (
          <CheckCircle2 className="w-4 h-4 text-figma-blue shrink-0" />
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FileActionTrigger item={item} context={context} />
          </div>
        )}

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

  // File Layout
  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`rounded-md cursor-pointer group flex flex-col h-44 overflow-hidden transition-all border ${
        selected
          ? "bg-figma-blue/10 border-figma-blue"
          : "bg-[#2c2c2c] hover:bg-figma-hover border-white/5"
      }`}
    >
      {/* File Header */}
      <div className="flex items-center justify-between px-2 py-1.5 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText
            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
              selected ? "text-figma-blue" : "text-figma-text-muted group-hover:text-figma-blue"
            }`}
          />
          <span className="text-white text-[12px] font-medium truncate select-none">{item.name}</span>
        </div>
        <div className="flex items-center gap-1">
          {item.encrypted && !selected && !isTrash && <Lock className="w-3 h-3 text-figma-text-muted" />}
          {selected ? (
            <CheckCircle2 className="w-4 h-4 text-figma-blue shrink-0" />
          ) : (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <FileActionTrigger item={item} context={context} />
            </div>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div
        className={`flex-1 mx-1.5 mb-1.5 rounded-sm border border-white/5 overflow-hidden flex items-center justify-center transition-colors ${
          selected ? "bg-figma-blue/5" : "bg-figma-bg"
        }`}
      >
        {item.hasThumb500 ? (
          <Thumbnail 
            itemId={item.id} 
            size={500} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText className="w-8 h-8 text-white/5" />
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
    </div>
  );
}
