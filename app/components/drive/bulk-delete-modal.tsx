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
      queryClient.invalidateQueries({ queryKey: ["search-full"] });
      queryClient.invalidateQueries({ queryKey: ["search-quick"] });
      clear();
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Items" maxWidth="sm">
      <div className="space-y-4">
        <p className="text-[13px] text-figma-text-muted leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="text-white font-bold">{count} item{count !== 1 ? "s" : ""}</span>?
          This action will move them to the trash.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" onClick={onClose} variant="ghost" disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-figma-red hover:bg-figma-red/90 text-white shadow-sm px-6"
          >
            {mutation.isPending ? "Deleting..." : `Delete`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
