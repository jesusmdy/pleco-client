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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
      <div className="bg-figma-dark rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-black/50 animate-in zoom-in-95 duration-200">
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-figma-dark/50">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Delete {item.itemType === "FOLDER" ? "Folder" : "File"}</h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-figma-text-muted hover:text-white transition-colors p-1 hover:bg-figma-hover rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <p className="text-white text-[13px] mb-6 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-figma-blue">{item.name}</span>? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending} 
              className="bg-discord-red hover:bg-discord-red/80 text-white px-6"
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
          
          {mutation.isError && (
            <p className="mt-3 text-discord-text-danger text-[11px] text-center">
              {(mutation.error as Error).message || "Failed to delete item."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
