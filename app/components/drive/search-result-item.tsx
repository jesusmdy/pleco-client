"use client";

import Link from "next/link";
import { File, Folder } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";

interface SearchResultItemProps {
  item: UnifiedDriveItem;
  onClick: () => void;
}

export function SearchResultItem({ item, onClick }: SearchResultItemProps) {
  return (
    <Link
      href={item.itemType === "FOLDER" ? `/fm/drive/folders/${item.id}` : `/fm/drive?fileId=${item.id}`}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors group/item"
    >
      <div className="shrink-0 w-6 h-6 rounded bg-figma-bg border border-white/5 flex items-center justify-center">
        {item.itemType === "FOLDER" ? (
          <Folder className="w-3.5 h-3.5 text-figma-blue" />
        ) : (
          <File className="w-3.5 h-3.5 text-figma-text-muted group-hover/item:text-white transition-colors" />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] text-white font-medium truncate">{item.name}</span>
        <span className="text-[10px] text-figma-text-muted truncate">
          {item.path.length > 0 ? item.path.join(" / ") : "Root"}
        </span>
      </div>
    </Link>
  );
}
