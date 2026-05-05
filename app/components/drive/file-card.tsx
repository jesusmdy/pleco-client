"use client";

import { useRef } from "react";
import { Folder, FileText, Lock, CheckCircle2 } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useRouter } from "next/navigation";
import { FileCardMenu } from "./file-card-menu";
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
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => {
    if (isTrash) return; // no navigation in trash context
    if (isFolder) router.push(`/drive/folders/${item.id}`);
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
        className={`flex items-center justify-between rounded-lg p-3 cursor-pointer group transition-all border ${
          selected
            ? "bg-discord-blurple/10 border-discord-blurple"
            : "bg-discord-bg-secondary hover:bg-white/5 border-transparent hover:border-white/10"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Folder
            className={`w-5 h-5 shrink-0 transition-colors ${
              selected ? "text-discord-blurple" : "text-discord-text-muted group-hover:text-discord-blurple"
            }`}
          />
          <span className="text-white text-[14px] font-medium truncate select-none">{item.name}</span>
        </div>
        {selected ? (
          <CheckCircle2 className="w-5 h-5 text-discord-blurple shrink-0" />
        ) : !isTrash ? (
          <FileCardMenu item={item} />
        ) : null}
      </div>
    );
  }

  // File Layout
  return (
    <div
      onClick={handleClick}
      className={`rounded-xl cursor-pointer group flex flex-col h-56 overflow-hidden transition-all border ${
        selected
          ? "bg-discord-blurple/10 border-discord-blurple"
          : "bg-discord-bg-secondary hover:bg-white/5 border-transparent hover:border-white/10"
      }`}
    >
      {/* File Header */}
      <div className="flex items-center justify-between p-3 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileText
            className={`w-5 h-5 shrink-0 transition-colors ${
              selected ? "text-discord-blurple" : "text-discord-text-muted group-hover:text-discord-blurple"
            }`}
          />
          <span className="text-white text-[14px] font-medium truncate select-none">{item.name}</span>
        </div>
        <div className="flex items-center gap-1">
          {item.encrypted && !selected && !isTrash && <Lock className="w-3.5 h-3.5 text-discord-text-muted" />}
          {selected ? (
            <CheckCircle2 className="w-5 h-5 text-discord-blurple shrink-0" />
          ) : !isTrash ? (
            <FileCardMenu item={item} />
          ) : null}
        </div>
      </div>

      {/* Future Preview Area */}
      <div
        className={`flex-1 mx-3 mb-3 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center transition-colors ${
          selected ? "bg-discord-blurple/5" : "bg-discord-bg-tertiary group-hover:bg-discord-bg-primary"
        }`}
      >
        {item.hasThumb500 ? (
          <Thumbnail 
            itemId={item.id} 
            size={500} 
            alt={item.name} 
            className="w-full h-full"
          />
        ) : (
          <FileText className="w-12 h-12 text-discord-text-muted/20" />
        )}
      </div>
    </div>
  );
}
