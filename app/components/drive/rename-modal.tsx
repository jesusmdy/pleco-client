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
    <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-[4px] animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
      <div className="bg-md-surface-container-high rounded-[28px] shadow-xl w-full max-w-md overflow-hidden border border-md-outline-variant/10 animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 flex items-center justify-between border-b border-md-outline-variant/10 bg-md-surface-container-high/50">
          <h2 className="text-[15px] font-semibold text-md-on-surface tracking-tight">Rename {item.itemType === "FOLDER" ? "folder" : "file"}</h2>
          <button 
            onClick={onClose}
            type="button"
            className="text-md-on-surface-variant hover:text-md-on-surface transition-all p-1.5 hover:bg-md-surface-variant/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-8">
            <Input
              label="New Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              required
            />

            {isMissingExtension && (
              <div className="mt-4 p-3 rounded-2xl bg-md-secondary-container/30 border border-md-secondary-container/50 animate-in fade-in slide-in-from-top-1 duration-300">
                <p className="text-[12px] text-md-on-secondary-container leading-relaxed mb-3 font-medium">
                  Changing the extension may make the file unreadable.
                </p>
                <button
                  type="button"
                  onClick={handleApplyExtension}
                  className="text-[13px] text-md-primary hover:underline transition-all flex items-center gap-2 font-semibold tracking-tight"
                >
                  Restore extension ({originalExtension})
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="ghost" className="h-10 px-6 font-bold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled} variant="primary" className="px-8 h-10 font-semibold tracking-tight border border-md-primary/10">
              {mutation.isPending ? "Renaming..." : "Rename"}
            </Button>
          </div>
          
          {mutation.isError && (
            <p className="mt-4 text-md-error text-[13px] text-center font-bold">
              {(mutation.error as Error).message || "Failed to rename item."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
