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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-[4px] animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
      <div className="bg-md-surface-container-high rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.6)] w-full max-w-md overflow-hidden border border-md-outline-variant/10 animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 flex items-center justify-between border-b border-md-outline-variant/10 bg-md-surface-container-high/50">
          <h2 className="text-[14px] font-bold text-md-on-surface uppercase tracking-widest">New Folder</h2>
          <button 
            onClick={onClose}
            className="text-md-on-surface-variant hover:text-md-on-surface transition-all p-1.5 hover:bg-md-surface-variant/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-8">
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
          
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="h-10 px-6 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || mutation.isPending}
              variant="primary"
              className="px-8 h-10 font-bold shadow-lg shadow-md-primary/20"
            >
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
          
          {mutation.isError && (
            <p className="mt-4 text-md-error text-[13px] text-center font-bold">
              {(mutation.error as Error).message || "Failed to create folder."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
