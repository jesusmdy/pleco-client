"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Modal } from "@/app/components/ui/modal";

interface CreateFolderModalProps {
  parentId: string | null;
  onClose: () => void;
}

export function CreateFolderModal({ parentId, onClose }: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createFolder(name, parentId, session!.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["folderContent", parentId || "root"] 
      });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !mutation.isPending) {
      mutation.mutate();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="New folder"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="pt-2">
          <Input
            label="Folder Name"
            id="folderName"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Projects 2024"
            required
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="text"
            className="h-10 px-6 font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!name.trim() || mutation.isPending}
            variant="primary"
            className="px-8 h-10 font-bold tracking-tight"
          >
            {mutation.isPending ? "Creating..." : "Create"}
          </Button>
        </div>
        
        {mutation.isError && (
          <p className="text-md-error text-[13px] text-center font-bold">
            {(mutation.error as Error).message || "Failed to create folder."}
          </p>
        )}
      </form>
    </Modal>
  );
}
