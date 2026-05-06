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
    <Modal isOpen={isOpen} onClose={onClose} title="Move to Trash" maxWidth="sm">
      <div className="space-y-6">
        <p className="text-[15px] text-md-on-surface-variant leading-relaxed font-medium">
          Are you sure you want to delete{" "}
          <span className="text-md-on-surface font-bold">{count} selected item{count !== 1 ? "s" : ""}</span>?
          This action will move them to the trash and they will be permanently deleted after 30 days.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" onClick={onClose} variant="ghost" disabled={mutation.isPending} className="h-10 px-6 font-bold">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-md-error text-md-on-error hover:bg-md-error/90 px-8 h-10 font-bold shadow-sm border border-md-error/10 rounded-xl"
          >
            {mutation.isPending ? "Deleting..." : `Delete Items`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
