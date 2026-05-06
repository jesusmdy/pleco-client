"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Download, Edit2, Trash2 } from "lucide-react";
import { UnifiedDriveItem, downloadFile } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { RenameModal } from "./rename-modal";
import { DeleteModal } from "./delete-modal";

interface FileCardMenuProps {
  item: UnifiedDriveItem;
}

export function FileCardMenu({ item }: FileCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    try {
      await downloadFile(item.id, item.name, session!.backendToken);
    } catch (err) {
      console.error("Failed to download:", err);
    }
  };

  return (
    <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-figma-text-muted hover:text-white p-1 rounded-md transition-all hover:bg-figma-hover outline-none"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-figma-dark rounded-md shadow-2xl border border-black/50 py-1 px-1 z-40 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => { setIsOpen(false); setIsRenameOpen(true); }}
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
            onClick={() => { setIsOpen(false); setIsDeleteOpen(true); }}
            className="w-full text-left px-2 py-1.5 text-[12px] text-discord-red hover:bg-discord-red hover:text-white flex items-center gap-2 rounded-sm transition-colors group"
          >
            <Trash2 className="w-3.5 h-3.5 text-discord-red group-hover:text-white" /> Delete
          </button>
        </div>
      )}

      {isRenameOpen && <RenameModal item={item} onClose={() => setIsRenameOpen(false)} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={() => setIsDeleteOpen(false)} />}
    </div>
  );
}
