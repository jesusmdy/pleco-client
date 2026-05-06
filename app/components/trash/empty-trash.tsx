"use client";

import { useState } from "react";
import { Trash2, Loader2, X, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { permanentlyDeleteItems } from "@/app/lib/drive";
import { toast } from "react-hot-toast";
import { Button } from "@/app/components/ui/button";

interface EmptyTrashProps {
  itemIds: string[];
  disabled?: boolean;
}

export function EmptyTrash({ itemIds, disabled }: EmptyTrashProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate: handleEmpty, isPending } = useMutation({
    mutationFn: () => permanentlyDeleteItems(itemIds, session!.backendToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      queryClient.invalidateQueries({ queryKey: ["storage-usage"] });
      toast.success("Trash emptied successfully");
      setShowConfirm(false);
    },
    onError: (error) => {
      toast.error("Failed to empty trash: " + (error as Error).message);
    },
  });

  if (itemIds.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={disabled || isPending}
        title="Permanently delete all items in the trash"
        className={`
          flex items-center gap-1.5 h-7 px-3
          bg-figma-red hover:bg-figma-red/90 
          text-white font-medium text-[12px]
          rounded-md shadow-sm transition-all duration-150 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
          cursor-pointer
        `}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
        <span>Empty Trash</span>
      </button>

      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in duration-200"
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="bg-figma-dark rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-black/50 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-figma-dark/50">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-figma-red" />
                Empty Trash
              </h2>
              <button 
                onClick={() => setShowConfirm(false)}
                className="text-figma-text-muted hover:text-white transition-colors p-1 hover:bg-figma-hover rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-[13px] text-figma-text-muted leading-relaxed">
                Are you sure you want to permanently delete <span className="text-white font-bold">{itemIds.length} items</span>? 
                This action cannot be undone and files will be lost forever.
              </p>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleEmpty()}
                  disabled={isPending}
                  className="bg-figma-red hover:bg-figma-red/90 px-6"
                >
                  {isPending ? "Emptying..." : "Empty Trash"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
