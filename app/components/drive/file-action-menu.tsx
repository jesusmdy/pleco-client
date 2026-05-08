"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, Edit2, Trash2, FolderOpen, ExternalLink, MoreVertical, RotateCcw, ShieldAlert, FileUp, FolderUp } from "lucide-react";
import { UnifiedDriveItem, downloadFile, restoreItems, permanentlyDeleteItems } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { RenameModal } from "./rename-modal";
import { DeleteModal } from "./delete-modal";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useUpload } from "@/app/components/drive/upload-provider";
import { isPreviewable } from "@/app/lib/preview";
import { FileViewerModal } from "./file-viewer-modal";
import { useCryptoStore } from "@/app/store/useCryptoStore";
import { Menu, MenuItem, MenuSeparator } from "../ui/menu";

interface FileActionMenuProps {
  item: UnifiedDriveItem;
  x: number;
  y: number;
  onClose: () => void;
  variant?: "context" | "dropdown";
  context?: "drive" | "trash";
}

export function FileActionMenu({ item, x, y, onClose, variant = "context", context = "drive" }: FileActionMenuProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPermanentDeleteOpen, setIsPermanentDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isTrash = context === "trash";
  const { uploadTo } = useUpload();
  const masterKey = useCryptoStore(state => state.masterKey);

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
    if (item.itemType === "FOLDER") {
      onClose();
      router.push(`/fm/drive/folders/${item.id}`);
    } else if (item.itemType === "FILE" && isPreviewable(item.mimeType)) {
      setIsPreviewOpen(true);
      // We don't call onClose here because we want the FileActionMenu 
      // to render the portal (FileViewerModal) and then hide the menu.
      // Actually, in our render logic: 
      // !isRenameOpen && !isDeleteOpen && !isPermanentDeleteOpen && !isPreviewOpen && renderMenu()
      // So setting isPreviewOpen to true WILL hide the menu.
    } else {
      onClose();
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    try {
      await downloadFile(item, session!.backendToken, masterKey);
    } catch (err) {
      console.error("Failed to download:", err);
    }
  };

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    try {
      await restoreItems([item.id], session!.backendToken);
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      queryClient.invalidateQueries({ queryKey: ["folderContent"] });
      queryClient.invalidateQueries({ queryKey: ["folderTreeFull"] });
    } catch (err) {
      console.error("Failed to restore:", err);
    }
  };

  // Adjust position if menu goes off screen
  const menuWidth = 224;
  const menuHeight = isTrash ? 140 : 220;
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  const renderMenu = () => (
    <Menu
      ref={menuRef}
      className={cn(
        "fixed z-[500] w-56",
        variant === "dropdown" ? "origin-top-right" : "origin-top-left"
      )}
      style={{ top: adjustedY, left: adjustedX }}
    >
      <div className="px-3 py-2 mb-1 border-b border-md-outline-variant/10">
        <p className="text-[13px] font-semibold text-md-on-surface-variant tracking-tight truncate">
          {item.name}
        </p>
      </div>

      {!isTrash ? (
        <>
          <MenuItem
            onClick={handleOpen}
            icon={item.itemType === "FOLDER" ? <FolderOpen /> : <ExternalLink />}
          >
            {item.itemType === "FOLDER" ? "Open folder" : "Open file"}
          </MenuItem>

          <MenuItem
            onClick={() => setIsRenameOpen(true)}
            disabled={item.id === null}
            icon={<Edit2 />}
          >
            Rename
          </MenuItem>

          {item.itemType === "FOLDER" && (
            <>
              <MenuSeparator />
              <MenuItem
                onClick={() => {
                  uploadTo(item.id, "file");
                  onClose();
                }}
                icon={<FileUp />}
              >
                Upload file
              </MenuItem>
              <MenuItem
                onClick={() => {
                  uploadTo(item.id, "folder");
                  onClose();
                }}
                icon={<FolderUp />}
              >
                Upload folder
              </MenuItem>
            </>
          )}
          
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
            disabled={item.id === null}
            icon={<Trash2 />}
            variant="error"
          >
            Delete
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem
            onClick={handleRestore}
            icon={<RotateCcw />}
          >
            Restore
          </MenuItem>

          <MenuSeparator />

          <MenuItem
            onClick={() => setIsPermanentDeleteOpen(true)}
            icon={<ShieldAlert />}
            variant="error"
          >
            Delete permanently
          </MenuItem>
        </>
      )}
    </Menu>
  );

  if (!mounted) return null;

  return createPortal(
    <>
      {!isRenameOpen && !isDeleteOpen && !isPermanentDeleteOpen && !isPreviewOpen && renderMenu()}
      {isRenameOpen && <RenameModal item={item} onClose={onClose} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={onClose} />}
      {isPermanentDeleteOpen && (
        <PermanentDeleteModal item={item} onClose={onClose} />
      )}
      {isPreviewOpen && (
        <FileViewerModal item={item} onClose={() => { setIsPreviewOpen(false); onClose(); }} />
      )}
    </>,
    document.body
  );
}

// Helper component for the "More" button
export function FileActionTrigger({ item, context = "drive" }: { item: UnifiedDriveItem, context?: "drive" | "trash" }) {
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ x: rect.right - 224, y: rect.bottom + 4 }); // 224 is w-56
    }
  };

  return (
    <>
      <button 
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className="text-md-on-surface-variant hover:text-md-on-surface p-2 rounded-full transition-all hover:bg-md-surface-variant/20 outline-none active:scale-90"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {menuPos && (
        <FileActionMenu 
          item={item} 
          x={menuPos.x} 
          y={menuPos.y} 
          variant="dropdown"
          context={context}
          onClose={() => setMenuPos(null)} 
        />
      )}
    </>
  );
}

function PermanentDeleteModal({ item, onClose }: { item: UnifiedDriveItem; onClose: () => void }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await permanentlyDeleteItems([item.id], session!.backendToken);
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      onClose();
    } catch (err) {
      console.error("Permanent delete failed:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4 backdrop-blur-[4px]">
      <div className="bg-md-surface-container-high rounded-[28px] shadow-xl w-full max-w-sm overflow-hidden border border-md-outline-variant/10">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6 text-md-error">
            <ShieldAlert className="w-8 h-8" />
            <h2 className="text-[18px] font-bold">Permanent delete</h2>
          </div>
          <p className="text-[14px] text-md-on-surface-variant leading-relaxed">
            Are you sure you want to permanently delete <span className="text-md-on-surface font-bold">"{item.name}"</span>? 
            This action <span className="text-md-error font-bold underline decoration-2 underline-offset-4">cannot be undone</span>.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 bg-md-surface-container-highest/50 border-t border-md-outline-variant/10">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-semibold tracking-tight text-md-on-surface-variant hover:text-md-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-6 py-2.5 text-[13px] font-semibold tracking-tight text-md-on-error bg-md-error hover:bg-md-error/90 rounded-full border border-md-error/10 transition-all disabled:opacity-50 active:scale-95"
          >
            {isLoading ? "Deleting..." : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
