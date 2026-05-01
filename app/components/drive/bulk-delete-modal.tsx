"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { Modal } from "@/app/components/ui/modal";
import { Button } from "@/app/components/ui/button";
import { useSelectionStore } from "@/app/store/selectionStore";

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkDeleteModal({ isOpen, onClose }: BulkDeleteModalProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { selectedIds, clear } = useSelectionStore();
  const count = selectedIds.size;

  const mutation = useMutation({
    mutationFn: () =>
      Promise.all(
        Array.from(selectedIds).map((id) =>
          deleteItem(id, session!.backendToken)
        )
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folderContent"] });
      clear();
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Items">
      <p className="text-discord-text-primary text-[15px] mb-2 leading-relaxed">
        Are you sure you want to delete{" "}
        <span className="text-white font-semibold">{count} item{count !== 1 ? "s" : ""}</span>?
      </p>
      <p className="text-discord-text-muted text-[14px] mb-6">
        Deleted items will be moved to Trash.
      </p>

      <div className="flex justify-end gap-3">
        <Button type="button" onClick={onClose} variant="ghost" disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-discord-red hover:bg-discord-red/80 text-white shadow-sm"
        >
          {mutation.isPending ? "Deleting..." : `Delete ${count} item${count !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </Modal>
  );
}
