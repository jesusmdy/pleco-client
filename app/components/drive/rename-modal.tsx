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
