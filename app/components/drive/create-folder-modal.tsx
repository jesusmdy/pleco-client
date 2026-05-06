"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
      <div className="bg-figma-dark rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-black/50 animate-in zoom-in-95 duration-200">
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-figma-dark/50">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Create Folder</h2>
          <button 
            onClick={onClose}
            className="text-figma-text-muted hover:text-white transition-colors p-1 hover:bg-figma-hover rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <Input
              label="Folder Name"
              id="folderName"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Documents"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
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
              className="px-6"
            >
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
          
          {mutation.isError && (
            <p className="mt-3 text-discord-text-danger text-[11px] text-center">
              {(mutation.error as Error).message || "Failed to create folder."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
