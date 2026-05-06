"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreItems } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { Modal } from "@/app/components/ui/modal";
import { Button } from "@/app/components/ui/button";

interface RestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: Set<string>;
  onSuccess: () => void;
}

export function RestoreModal({ isOpen, onClose, selectedIds, onSuccess }: RestoreModalProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const count = selectedIds.size;

  const mutation = useMutation({
    mutationFn: () => restoreItems(Array.from(selectedIds), session!.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      onSuccess();
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Items">
      <p className="text-discord-text-primary text-[15px] mb-6 leading-relaxed">
        Are you sure you want to restore{" "}
        <span className="text-white font-semibold">{count} item{count !== 1 ? "s" : ""}</span>?
        {" "}They will be moved back to your drive.
      </p>

      <div className="flex justify-end gap-3">
        <Button type="button" onClick={onClose} variant="ghost" disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-discord-blurple hover:bg-discord-blurple/80 text-white font-semibold tracking-tight border border-white/10"
        >
          {mutation.isPending ? "Restoring..." : "Restore"}
        </Button>
      </div>
    </Modal>
  );
}
