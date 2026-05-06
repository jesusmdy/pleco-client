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
        className="fixed z-[100] w-56 bg-md-surface-container rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-md-outline-variant/10 py-2 px-2 animate-in fade-in zoom-in-95 duration-200"
        style={{ top: adjustedY, left: adjustedX }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <button
          type="button"
          onClick={handleOpen}
          className="w-full text-left px-4 py-2.5 text-[14px] font-bold text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3.5 rounded-xl transition-all group"
        >
          {item.itemType === "FOLDER" ? (
            <>
              <FolderOpen className="w-5 h-5 text-md-on-surface-variant group-hover:text-md-primary" /> Open Folder
            </>
          ) : (
            <>
              <ExternalLink className="w-5 h-5 text-md-on-surface-variant group-hover:text-md-primary" /> Open File
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsRenameOpen(true)}
          className="w-full text-left px-4 py-2.5 text-[14px] font-bold text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3.5 rounded-xl transition-all group"
        >
          <Edit2 className="w-5 h-5 text-md-on-surface-variant group-hover:text-md-primary" /> Rename
        </button>
        
        {item.itemType === "FILE" && (
          <button
            type="button"
            onClick={handleDownload}
            className="w-full text-left px-4 py-2.5 text-[14px] font-bold text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3.5 rounded-xl transition-all group"
          >
            <Download className="w-5 h-5 text-md-on-surface-variant group-hover:text-md-primary" /> Download
          </button>
        )}

        <div className="h-[1px] bg-md-outline-variant/10 my-2 mx-2" />

        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="w-full text-left px-4 py-2.5 text-[14px] font-bold text-md-error hover:bg-md-error hover:text-md-on-error flex items-center gap-3.5 rounded-xl transition-all group"
        >
          <Trash2 className="w-5 h-5 group-hover:text-md-on-error" /> Delete
        </button>
      </div>

      {isRenameOpen && <RenameModal item={item} onClose={onClose} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={onClose} />}
    </>
  );
}
