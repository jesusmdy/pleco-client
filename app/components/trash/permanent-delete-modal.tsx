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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Forever">
      <p className="text-discord-text-primary text-[15px] mb-2 leading-relaxed">
        Are you sure you want to permanently delete{" "}
        <span className="text-white font-semibold">{count} item{count !== 1 ? "s" : ""}</span>?
      </p>
      <p className="text-discord-red text-[14px] mb-6">
        ⚠ This action cannot be undone. These files will be gone forever.
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
          {mutation.isPending ? "Deleting..." : "Delete Forever"}
        </Button>
      </div>
    </Modal>
  );
}
