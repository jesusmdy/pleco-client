"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem, UnifiedDriveItem } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface DeleteModalProps {
  item: UnifiedDriveItem;
  onClose: () => void;
}

export function DeleteModal({ item, onClose }: DeleteModalProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteItem(item.id, session!.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["folderContent", item.parentId || "root"] 
      });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mutation.isPending) {
      mutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-discord-bg-primary rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="font-bold text-white">Delete {item.itemType === "FOLDER" ? "Folder" : "File"}</h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-discord-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <p className="text-discord-text-primary text-[15px] mb-6 leading-relaxed">
            Are you sure you want to delete <strong>{item.name}</strong>? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending} 
              className="bg-discord-red hover:bg-discord-red/80 text-white shadow-sm"
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
          
          {mutation.isError && (
            <p className="mt-4 text-discord-text-danger text-[14px]">
              {(mutation.error as Error).message || "Failed to delete item."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
