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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-discord-bg-primary rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="font-bold text-white">Rename {item.itemType === "FOLDER" ? "Folder" : "File"}</h2>
          <button 
            onClick={onClose}
            type="button"
            className="text-discord-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <Input
              label="Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Documents"
              required
            />

            {isMissingExtension && (
              <div className="mt-2.5 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                <p className="text-[12px] text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  If you change the extension, the file may become unreadable.
                </p>
                <button
                  type="button"
                  onClick={handleApplyExtension}
                  className="text-[12px] text-blue-400 hover:text-blue-300 hover:underline transition-all w-fit text-left flex items-center gap-1.5 group"
                >
                  <span className="opacity-90">Restore original extension</span>
                  <span className="font-bold bg-blue-400/10 px-1.5 py-0.5 rounded transition-colors group-hover:bg-blue-400/20">
                    {originalExtension}
                  </span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled} variant="primary">
              {mutation.isPending ? "Renaming..." : "Rename"}
            </Button>
          </div>
          
          {mutation.isError && (
            <p className="mt-4 text-discord-text-danger text-[14px]">
              {(mutation.error as Error).message || "Failed to rename item."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
