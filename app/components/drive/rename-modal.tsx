"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameItem, UnifiedDriveItem } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface RenameModalProps {
  item: UnifiedDriveItem;
  onClose: () => void;
}

export function RenameModal({ item, onClose }: RenameModalProps) {
  const [name, setName] = useState(item.name);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Extract original extension if item is a file
  const lastDotIndex = item.name.lastIndexOf(".");
  const originalExtension = item.itemType === "FILE" && lastDotIndex !== -1 
    ? item.name.slice(lastDotIndex) 
    : "";

  const isMissingExtension = originalExtension && !name.toLowerCase().endsWith(originalExtension.toLowerCase());

  const handleApplyExtension = () => {
    const currentDotIndex = name.lastIndexOf(".");
    if (currentDotIndex !== -1) {
      // Replace existing extension or append if name ends in dot
      setName(name.slice(0, currentDotIndex) + originalExtension);
    } else {
      // Append original extension
      setName(name + originalExtension);
    }
  };

  const mutation = useMutation({
    mutationFn: () => renameItem(item.id, name, session!.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["folderContent", item.parentId || "root"] 
      });
      onClose();
    },
  });

  const hasChanged = name.trim() !== item.name;
  const isValid = name.trim().length > 0;
  const isSubmitDisabled = !hasChanged || !isValid || mutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      mutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
      <div className="bg-figma-dark rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-black/50 animate-in zoom-in-95 duration-200">
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-figma-dark/50">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Rename {item.itemType === "FOLDER" ? "Folder" : "File"}</h2>
          <button 
            onClick={onClose}
            type="button"
            className="text-figma-text-muted hover:text-white transition-colors p-1 hover:bg-figma-hover rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <Input
              label="New Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              required
            />

            {isMissingExtension && (
              <div className="mt-3 p-2 rounded-md bg-amber-400/5 border border-amber-400/20 animate-in fade-in slide-in-from-top-1 duration-300">
                <p className="text-[11px] text-amber-400 leading-normal mb-2">
                  Changing the extension may make the file unreadable.
                </p>
                <button
                  type="button"
                  onClick={handleApplyExtension}
                  className="text-[11px] text-figma-blue hover:underline transition-all flex items-center gap-1.5 font-medium"
                >
                  Restore original extension ({originalExtension})
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled} variant="primary" className="px-6">
              {mutation.isPending ? "Renaming..." : "Rename"}
            </Button>
          </div>
          
          {mutation.isError && (
            <p className="mt-3 text-discord-text-danger text-[11px] text-center">
              {(mutation.error as Error).message || "Failed to rename item."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
