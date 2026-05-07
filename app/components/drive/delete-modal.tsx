"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem, UnifiedDriveItem } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Modal } from "@/app/components/ui/modal";

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Delete ${item.itemType === "FOLDER" ? "folder" : "file"}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <p className="text-md-on-surface text-[15px] leading-relaxed font-medium">
          Are you sure you want to delete <span className="font-bold text-md-primary">{item.name}</span>? This action will move the item to trash.
        </p>
        
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onClose} variant="text" className="h-10 px-6 font-bold">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending} 
            variant="error"
            className="px-8 h-10 font-bold tracking-tight"
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
        
        {mutation.isError && (
          <p className="text-md-error text-[13px] text-center font-bold">
            {(mutation.error as Error).message || "Failed to delete item."}
          </p>
        )}
      </form>
    </Modal>
  );
}
