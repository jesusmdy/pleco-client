"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameItem, UnifiedDriveItem } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";

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
      setName(name.slice(0, currentDotIndex) + originalExtension);
    } else {
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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Rename ${item.itemType === "FOLDER" ? "folder" : "file"}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="pt-2">
          <Input
            label="New Name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..."
            required
          />

          {isMissingExtension && (
            <div className="mt-4 p-4 rounded-2xl bg-md-secondary-container/30 border border-md-secondary-container/50 animate-in fade-in slide-in-from-top-1 duration-300">
              <p className="text-[12px] text-md-on-secondary-container leading-relaxed mb-3 font-medium">
                Changing the extension may make the file unreadable.
              </p>
              <button
                type="button"
                onClick={handleApplyExtension}
                className="text-[13px] text-md-primary hover:underline transition-all flex items-center gap-2 font-bold tracking-tight"
              >
                Restore extension ({originalExtension})
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onClose} variant="text" className="h-10 px-6 font-bold">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitDisabled} 
            variant="primary" 
            className="px-8 h-10 font-bold tracking-tight"
          >
            {mutation.isPending ? "Renaming..." : "Rename"}
          </Button>
        </div>
        
        {mutation.isError && (
          <p className="text-md-error text-[13px] text-center font-bold">
            {(mutation.error as Error).message || "Failed to rename item."}
          </p>
        )}
      </form>
    </Modal>
  );
}
