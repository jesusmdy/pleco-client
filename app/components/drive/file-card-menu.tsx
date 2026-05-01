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
        className="text-discord-text-muted hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-discord-bg-modal rounded shadow-xl border border-white/5 py-1 z-40">
          <button
            type="button"
            onClick={() => { setIsOpen(false); setIsRenameOpen(true); }}
            className="w-full text-left px-3 py-2 text-[14px] text-discord-text-primary hover:bg-discord-blurple hover:text-white flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Rename
          </button>
          
          {item.itemType === "FILE" && (
            <button
              type="button"
              onClick={handleDownload}
              className="w-full text-left px-3 py-2 text-[14px] text-discord-text-primary hover:bg-discord-blurple hover:text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          )}

          <div className="h-[1px] bg-white/5 my-1 mx-2" />

          <button
            type="button"
            onClick={() => { setIsOpen(false); setIsDeleteOpen(true); }}
            className="w-full text-left px-3 py-2 text-[14px] text-discord-red hover:bg-discord-red hover:text-white flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}

      {isRenameOpen && <RenameModal item={item} onClose={() => setIsRenameOpen(false)} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={() => setIsDeleteOpen(false)} />}
    </div>
  );
}
