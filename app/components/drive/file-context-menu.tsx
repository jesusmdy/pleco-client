"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, Edit2, Trash2, FolderOpen, ExternalLink } from "lucide-react";
import { UnifiedDriveItem, downloadFile } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { RenameModal } from "./rename-modal";
import { DeleteModal } from "./delete-modal";
import { useRouter } from "next/navigation";

import { Menu, MenuItem, MenuSeparator } from "../ui/menu";

interface FileContextMenuProps {
  item: UnifiedDriveItem;
  x: number;
  y: number;
  onClose: () => void;
}

export function FileContextMenu({ item, x, y, onClose }: FileContextMenuProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
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
  const menuWidth = 224;
  const menuHeight = 220;
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  const renderMenu = () => (
    <Menu 
      ref={menuRef}
      className="fixed z-[500] w-56"
      style={{ top: adjustedY, left: adjustedX }}
    >
      <MenuItem
        onClick={handleOpen}
        icon={item.itemType === "FOLDER" ? <FolderOpen /> : <ExternalLink />}
      >
        {item.itemType === "FOLDER" ? "Open Folder" : "Open File"}
      </MenuItem>

      <MenuItem
        onClick={() => setIsRenameOpen(true)}
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
        onClick={() => setIsDeleteOpen(true)}
        icon={<Trash2 />}
        variant="error"
      >
        Delete
      </MenuItem>
    </Menu>
  );

  if (!mounted) return null;

  return createPortal(
    <>
      {renderMenu()}
      {isRenameOpen && <RenameModal item={item} onClose={onClose} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={onClose} />}
    </>,
    document.body
  );
}
