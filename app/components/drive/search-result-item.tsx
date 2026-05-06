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
      className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-md-primary/10 transition-colors group/item mx-1 rounded-xl"
    >
      <div className="shrink-0 w-8 h-8 rounded-lg bg-md-surface-container-highest border border-md-outline-variant/10 flex items-center justify-center">
        {item.itemType === "FOLDER" ? (
          <Folder className="w-4 h-4 text-md-primary" />
        ) : (
          <File className="w-4 h-4 text-md-on-surface-variant group-hover/item:text-md-primary transition-colors" />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[13px] text-md-on-surface font-bold truncate">{item.name}</span>
        <span className="text-[11px] text-md-on-surface-variant truncate font-medium">
          {item.path.length > 0 ? item.path.join(" / ") : "My Drive"}
        </span>
      </div>
    </Link>
  );
}
