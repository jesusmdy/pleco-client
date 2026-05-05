"use client";

import { useRef } from "react";
import { Folder, FileText, CheckCircle2 } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useRouter } from "next/navigation";
import { FileCardMenu } from "./file-card-menu";
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
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => {
    if (isTrash) return;
    if (isFolder) router.push(`/drive/folders/${item.id}`);
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
      className={`flex items-center gap-4 p-2 px-4 cursor-pointer group transition-all border-b border-white/5 ${
        selected ? "bg-discord-blurple/10" : "hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 shrink-0 rounded flex items-center justify-center bg-discord-bg-tertiary border border-white/5 overflow-hidden">
          {isFolder ? (
            <Folder className={`w-5 h-5 ${selected ? "text-discord-blurple" : "text-discord-text-muted"}`} />
          ) : item.hasThumb200 ? (
            <Thumbnail itemId={item.id} size={200} alt={item.name} className="w-full h-full" />
          ) : (
            <FileText className={`w-5 h-5 ${selected ? "text-discord-blurple" : "text-discord-text-muted"}`} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-white text-[14px] font-medium truncate select-none">
            {item.name}
          </div>
        </div>
      </div>

      <div className="w-24 text-discord-text-muted text-[13px] font-medium hidden sm:block">
        {isFolder ? "--" : formatBytes(item.size || 0)}
      </div>

      <div className="w-32 text-discord-text-muted text-[13px] font-medium hidden md:block">
        {new Date(item.createdAt).toLocaleDateString()}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {selected ? (
          <CheckCircle2 className="w-5 h-5 text-discord-blurple shrink-0" />
        ) : !isTrash ? (
          <FileCardMenu item={item} />
        ) : null}
      </div>
    </div>
  );
}
