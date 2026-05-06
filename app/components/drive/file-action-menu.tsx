"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Edit2, Trash2, FolderOpen, ExternalLink, MoreVertical, RotateCcw, ShieldAlert } from "lucide-react";
import { UnifiedDriveItem, downloadFile, restoreItems, permanentlyDeleteItems } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { RenameModal } from "./rename-modal";
import { DeleteModal } from "./delete-modal";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface FileActionMenuProps {
  item: UnifiedDriveItem;
  x: number;
  y: number;
  onClose: () => void;
  variant?: "context" | "dropdown";
  context?: "drive" | "trash";
}

export function FileActionMenu({ item, x, y, onClose, variant = "context", context = "drive" }: FileActionMenuProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPermanentDeleteOpen, setIsPermanentDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isTrash = context === "trash";

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

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    try {
      await restoreItems([item.id], session!.backendToken);
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      queryClient.invalidateQueries({ queryKey: ["folderContent"] });
    } catch (err) {
      console.error("Failed to restore:", err);
    }
  };

  // Adjust position if menu goes off screen
  const menuWidth = 180;
  const menuHeight = isTrash ? 120 : 180;
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <>
      {!isRenameOpen && !isDeleteOpen && !isPermanentDeleteOpen && (
        <div 
          ref={menuRef}
          className={cn(
            "fixed z-[100] w-56 bg-md-surface-container rounded-xl shadow-xl border border-md-outline-variant/10 py-2 px-1.5 animate-in fade-in zoom-in-95 duration-100",
            variant === "dropdown" ? "origin-top-right" : "origin-top-left"
          )}
          style={{ top: adjustedY, left: adjustedX }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="px-3 py-2 mb-1 border-b border-md-outline-variant/10">
            <p className="text-[13px] font-semibold text-md-on-surface-variant tracking-tight truncate">
              {item.name}
            </p>
          </div>

          {!isTrash ? (
            <>
              <button
                type="button"
                onClick={handleOpen}
                className="w-full text-left px-3 py-2 text-[13px] font-semibold tracking-tight text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3 rounded-lg transition-all group"
              >
                {item.itemType === "FOLDER" ? (
                  <>
                    <FolderOpen className="w-4 h-4 text-md-on-surface-variant group-hover:text-md-primary" /> Open folder
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 text-md-on-surface-variant group-hover:text-md-primary" /> Open file
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsRenameOpen(true)}
                className="w-full text-left px-3 py-2 text-[13px] font-semibold tracking-tight text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3 rounded-lg transition-all group"
              >
                <Edit2 className="w-4 h-4 text-md-on-surface-variant group-hover:text-md-primary" /> Rename
              </button>
              
              {item.itemType === "FILE" && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full text-left px-3 py-2 text-[13px] font-semibold tracking-tight text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3 rounded-lg transition-all group"
                >
                  <Download className="w-4 h-4 text-md-on-surface-variant group-hover:text-md-primary" /> Download
                </button>
              )}

              <div className="h-[1px] bg-md-outline-variant/10 my-1 mx-[-6px]" />

              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="w-full text-left px-3 py-2 text-[13px] font-semibold tracking-tight text-md-error hover:bg-md-error/10 flex items-center gap-3 rounded-lg transition-all group"
              >
                <Trash2 className="w-4 h-4 text-md-error group-hover:text-md-error" /> Delete
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRestore}
                className="w-full text-left px-3 py-2 text-[13px] font-semibold tracking-tight text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary flex items-center gap-3 rounded-lg transition-all group"
              >
                <RotateCcw className="w-4 h-4 text-md-on-surface-variant group-hover:text-md-primary" /> Restore
              </button>

              <div className="h-[1px] bg-md-outline-variant/10 my-1 mx-[-6px]" />

              <button
                type="button"
                onClick={() => setIsPermanentDeleteOpen(true)}
                className="w-full text-left px-3 py-2 text-[13px] font-semibold tracking-tight text-md-error hover:bg-md-error/10 flex items-center gap-3 rounded-lg transition-all group"
              >
                <ShieldAlert className="w-4 h-4 text-md-error group-hover:text-md-error" /> Delete permanently
              </button>
            </>
          )}
        </div>
      )}

      {isRenameOpen && <RenameModal item={item} onClose={onClose} />}
      {isDeleteOpen && <DeleteModal item={item} onClose={onClose} />}
      {isPermanentDeleteOpen && (
        <PermanentDeleteModal item={item} onClose={onClose} />
      )}
    </>
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
      setMenuPos({ x: rect.right - 192, y: rect.bottom + 4 }); // 192 is w-48
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
