"use client";

import { useRef, useState } from "react";
import { Folder, FileText, CheckCircle2 } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useRouter } from "next/navigation";
import { FileActionMenu, FileActionTrigger } from "./file-action-menu";
import { useSelectionStore } from "@/app/store/selectionStore";
import { Thumbnail } from "./thumbnail";
import { formatBytes, cn } from "@/app/lib/utils";
import { isPreviewable } from "@/app/lib/preview";
import { FileViewerModal } from "./file-viewer-modal";

import { ListItem } from "../ui/list";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleOpen = () => {
    if (isTrash) return;
    if (isFolder) {
      router.push(`/fm/drive/folders/${item.id}`);
    } else if (isPreviewable(item.mimeType)) {
      setIsPreviewOpen(true);
    }
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
    <ListItem
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      selected={selected}
      className="px-6"
      leading={
        <div className={cn(
          "w-12 h-12 shrink-0 rounded-[18px] flex items-center justify-center border transition-colors overflow-hidden",
          selected 
            ? "bg-md-primary text-md-on-primary border-transparent" 
            : "bg-md-surface-container-highest border-md-outline-variant/10"
        )}>
          {isFolder ? (
            <Folder className="w-5 h-5" />
          ) : item.hasThumb200 || (item.encrypted && item.mimeType?.startsWith("image/")) ? (
            <Thumbnail item={item} size={200} className="w-full h-full object-cover" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
        </div>
      }
      supportingText={
        <span className="sm:hidden">
          {isFolder ? "Folder" : formatBytes(item.size || 0)}
        </span>
      }
      trailing={
        <>
          <div className={cn(
            "w-32 text-[13px] font-medium hidden sm:block",
            selected ? "text-md-on-primary-container/70" : "text-md-on-surface-variant"
          )}>
            {isFolder ? "Folder" : formatBytes(item.size || 0)}
          </div>

          <div className={cn(
            "w-40 text-[13px] font-medium hidden md:block text-right pr-8",
            selected ? "text-md-on-primary-container/70" : "text-md-on-surface-variant"
          )}>
            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>

          <div className="flex items-center gap-2 shrink-0 min-w-[24px]">
            {selected ? (
              <div className="w-6 h-6 rounded-full bg-md-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-md-on-primary" />
              </div>
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

          {isPreviewOpen && (
            <FileViewerModal 
              item={item} 
              onClose={() => setIsPreviewOpen(false)} 
            />
          )}
        </>
      }
    >
      {item.name}
    </ListItem>
  );
}
