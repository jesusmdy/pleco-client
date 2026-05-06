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
        className="text-md-on-surface-variant hover:text-md-on-surface p-1.5 rounded-full transition-all hover:bg-md-surface-variant/20 outline-none active:scale-90"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-md-surface-container rounded-xl shadow-md border border-md-outline-variant/10 py-1.5 px-1.5 z-40 animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => { setIsOpen(false); setIsRenameOpen(true); }}
            className="w-full text-left px-3 py-2 text-[13px] font-bold text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3 rounded-lg transition-all group"
          >
            <Edit2 className="w-4.5 h-4.5 text-md-on-surface-variant group-hover:text-md-primary" /> Rename
          </button>
          
          {item.itemType === "FILE" && (
            <button
              type="button"
              onClick={handleDownload}
              className="w-full text-left px-3 py-2 text-[13px] font-bold text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3 rounded-lg transition-all group"
            >
              <Download className="w-4.5 h-4.5 text-md-on-surface-variant group-hover:text-md-primary" /> Download
            </button>
          )}

          <div className="h-[1px] bg-md-outline-variant/10 my-1.5 mx-1" />

          <button
            type="button"
            onClick={() => { setIsOpen(false); setIsDeleteOpen(true); }}
            className="w-full text-left px-3 py-2 text-[13px] font-bold text-md-error hover:bg-md-error hover:text-md-on-error flex items-center gap-3 rounded-lg transition-all group"
          >
            <Trash2 className="w-4.5 h-4.5 group-hover:text-md-on-error" /> Delete
          </button>
        </div>
      )}

      {isRenameOpen && <RenameModal item={item} onClose={() => setIsRenameOpen(false)} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={() => setIsDeleteOpen(false)} />}
    </div>
  );
}
