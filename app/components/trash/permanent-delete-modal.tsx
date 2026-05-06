"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permanentlyDeleteItems } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { Modal } from "@/app/components/ui/modal";
import { Button } from "@/app/components/ui/button";

interface PermanentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: Set<string>;
  onSuccess: () => void;
}

export function PermanentDeleteModal({ isOpen, onClose, selectedIds, onSuccess }: PermanentDeleteModalProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const count = selectedIds.size;

  const mutation = useMutation({
    mutationFn: () => permanentlyDeleteItems(Array.from(selectedIds), session!.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      onSuccess();
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Forever" maxWidth="sm">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[13px] text-figma-text-muted leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="text-white font-bold">{count} item{count !== 1 ? "s" : ""}</span>?
          </p>
          <p className="text-figma-red text-[12px] font-medium flex items-center gap-1.5 opacity-90">
            <span>⚠</span> This action cannot be undone. These files will be gone forever.
          </p>
        </div>

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
            {mutation.isPending ? "Deleting..." : "Delete Forever"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
