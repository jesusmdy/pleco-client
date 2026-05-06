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
          flex items-center gap-2 h-9 px-4
          bg-md-error text-md-on-error hover:bg-md-error/90 
          font-semibold text-[13px] tracking-tight
          rounded-xl border border-md-error/10 transition-all duration-200 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
          cursor-pointer
        `}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        <span>Empty Trash</span>
      </button>

      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-[4px] animate-in fade-in duration-300"
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="bg-md-surface-container-high rounded-[28px] shadow-xl w-full max-w-md overflow-hidden border border-md-outline-variant/10 animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-md-outline-variant/10 bg-md-surface-container-high/50">
              <h2 className="text-[15px] font-semibold text-md-on-surface tracking-tight flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-md-error" />
                Empty Trash
              </h2>
              <button 
                onClick={() => setShowConfirm(false)}
                className="text-md-on-surface-variant hover:text-md-on-surface transition-all p-1.5 hover:bg-md-surface-variant/20 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              <p className="text-[15px] text-md-on-surface-variant leading-relaxed font-medium">
                Are you sure you want to permanently delete <span className="text-md-on-surface font-bold">{itemIds.length} items</span>? 
                This action <span className="text-md-error font-bold">cannot be undone</span> and files will be lost forever.
              </p>
              
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="h-10 px-6 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleEmpty()}
                  disabled={isPending}
                  className="bg-md-error text-md-on-error hover:bg-md-error/90 px-8 h-10 font-bold shadow-sm border border-md-error/10 rounded-xl"
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
