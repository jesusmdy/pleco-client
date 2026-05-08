"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Download, Edit2, Trash2 } from "lucide-react";
import { UnifiedDriveItem, downloadFile } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { RenameModal } from "./rename-modal";
import { DeleteModal } from "./delete-modal";
import { useCryptoStore } from "@/app/store/useCryptoStore";

import { Menu, MenuItem, MenuSeparator } from "../ui/menu";

interface FileCardMenuProps {
  item: UnifiedDriveItem;
}

export function FileCardMenu({ item }: FileCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const masterKey = useCryptoStore(state => state.masterKey);

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
      await downloadFile(item, session!.backendToken, masterKey);
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
        <Menu className="absolute right-0 top-full mt-2 w-48 z-40">
          <MenuItem
            onClick={() => { setIsOpen(false); setIsRenameOpen(true); }}
            icon={<Edit2 />}
          >
            Rename
          </MenuItem>

          {item.itemType === "FILE" && (
            <MenuItem
              onClick={handleDownload}
              icon={<Download />}
            >
              Download
            </MenuItem>
          )}

          <MenuSeparator />

          <MenuItem
            onClick={() => { setIsOpen(false); setIsDeleteOpen(true); }}
            icon={<Trash2 />}
            variant="error"
          >
            Delete
          </MenuItem>
        </Menu>
      )}

      {isRenameOpen && <RenameModal item={item} onClose={() => setIsRenameOpen(false)} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={() => setIsDeleteOpen(false)} />}
    </div>
  );
}
