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
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[15px] text-md-on-surface-variant leading-relaxed font-medium">
            Are you sure you want to permanently delete{" "}
            <span className="text-md-on-surface font-bold">{count} item{count !== 1 ? "s" : ""}</span>?
          </p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-md-error/10 border border-md-error/20">
            <span className="text-md-error font-bold">⚠</span>
            <p className="text-md-error text-[13px] font-bold uppercase tracking-wider">
              Critical: This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" onClick={onClose} variant="ghost" disabled={mutation.isPending} className="h-10 px-6 font-bold">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-md-error text-md-on-error hover:bg-md-error/90 px-8 h-10 font-bold shadow-lg shadow-md-error/20"
          >
            {mutation.isPending ? "Deleting..." : "Delete Forever"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
