"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/app/lib/api";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

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
      // Invalidate the current folder's cache to trigger a refetch
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-discord-bg-primary rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="font-bold text-white">Create Folder</h2>
          <button 
            onClick={onClose}
            className="text-discord-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <label htmlFor="folderName" className="block text-discord-text-muted text-[12px] font-bold uppercase mb-2">
              Folder Name
            </label>
            <input
              id="folderName"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-discord-bg-tertiary text-white p-2.5 rounded border border-transparent focus:border-discord-blurple focus:outline-none transition-colors"
              placeholder="e.g. My Documents"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || mutation.isPending}
              variant="primary"
            >
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
          
          {mutation.isError && (
            <p className="mt-4 text-discord-text-danger text-[14px]">
              {(mutation.error as Error).message || "Failed to create folder."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
