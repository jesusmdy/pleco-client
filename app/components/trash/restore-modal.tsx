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
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Items" maxWidth="sm">
      <div className="space-y-6">
        <p className="text-[15px] text-md-on-surface-variant leading-relaxed font-medium">
          Are you sure you want to restore{" "}
          <span className="text-md-on-surface font-bold">{count} selected item{count !== 1 ? "s" : ""}</span>?
          They will be moved back to their original locations in your drive.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" onClick={onClose} variant="ghost" disabled={mutation.isPending} className="h-10 px-6 font-bold">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-md-primary text-md-on-primary hover:bg-md-primary/90 px-8 h-10 font-bold shadow-sm border border-md-primary/10 rounded-xl"
          >
            {mutation.isPending ? "Restoring..." : "Restore Items"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
