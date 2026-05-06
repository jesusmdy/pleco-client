"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Edit2, Trash2, FolderOpen, ExternalLink } from "lucide-react";
import { UnifiedDriveItem, downloadFile } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { RenameModal } from "./rename-modal";
import { DeleteModal } from "./delete-modal";
import { useRouter } from "next/navigation";

interface FileContextMenuProps {
  item: UnifiedDriveItem;
  x: number;
  y: number;
  onClose: () => void;
}

export function FileContextMenu({ item, x, y, onClose }: FileContextMenuProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleOpen = () => {
    onClose();
    if (item.itemType === "FOLDER") {
      router.push(`/fm/drive/folders/${item.id}`);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    try {
      await downloadFile(item.id, item.name, session!.backendToken);
    } catch (err) {
      console.error("Failed to download:", err);
    }
  };

  // Adjust position if menu goes off screen
  const menuWidth = 160;
  const menuHeight = 180;
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <>
      <div 
        ref={menuRef}
        className="fixed z-[100] w-40 bg-[#1e1e1e] rounded-md shadow-2xl border border-black/50 py-1 px-1 animate-in fade-in zoom-in-95 duration-100"
        style={{ top: adjustedY, left: adjustedX }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <button
          type="button"
          onClick={handleOpen}
          className="w-full text-left px-2 py-1.5 text-[12px] text-white hover:bg-figma-blue flex items-center gap-2 rounded-sm transition-colors group"
        >
          {item.itemType === "FOLDER" ? (
            <>
              <FolderOpen className="w-3.5 h-3.5 text-figma-text-muted group-hover:text-white" /> Open Folder
            </>
          ) : (
            <>
              <ExternalLink className="w-3.5 h-3.5 text-figma-text-muted group-hover:text-white" /> Open File
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsRenameOpen(true)}
          className="w-full text-left px-2 py-1.5 text-[12px] text-white hover:bg-figma-blue flex items-center gap-2 rounded-sm transition-colors group"
        >
          <Edit2 className="w-3.5 h-3.5 text-figma-text-muted group-hover:text-white" /> Rename
        </button>
        
        {item.itemType === "FILE" && (
          <button
            type="button"
            onClick={handleDownload}
            className="w-full text-left px-2 py-1.5 text-[12px] text-white hover:bg-figma-blue flex items-center gap-2 rounded-sm transition-colors group"
          >
            <Download className="w-3.5 h-3.5 text-figma-text-muted group-hover:text-white" /> Download
          </button>
        )}

        <div className="h-[1px] bg-white/5 my-1 mx-[-4px]" />

        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="w-full text-left px-2 py-1.5 text-[12px] text-discord-red hover:bg-discord-red hover:text-white flex items-center gap-2 rounded-sm transition-colors group"
        >
          <Trash2 className="w-3.5 h-3.5 text-discord-red group-hover:text-white" /> Delete
        </button>
      </div>

      {isRenameOpen && <RenameModal item={item} onClose={onClose} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={onClose} />}
    </>
  );
}
