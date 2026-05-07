"use client";

import { useState } from "react";
import { Trash2, Loader2, X, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { permanentlyDeleteItems } from "@/app/lib/drive";
import { toast } from "react-hot-toast";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";

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
      <Button
        variant="primary"
        onClick={() => setShowConfirm(true)}
        disabled={disabled || isPending}
        className={cn(
          "bg-md-error text-md-on-error hover:bg-md-error/90 rounded-full h-10 px-6 font-semibold",
          isPending && "opacity-70"
        )}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Trash2 className="w-4 h-4 mr-2" />
        )}
        <span>Empty Trash</span>
      </Button>

      {showConfirm && (
        <ConfirmEmptyModal 
          count={itemIds.length}
          isPending={isPending}
          onConfirm={handleEmpty}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

interface ConfirmEmptyModalProps {
  count: number;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmEmptyModal({ count, isPending, onConfirm, onClose }: ConfirmEmptyModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-md-surface-container-high rounded-[32px] w-full max-w-md overflow-hidden border border-md-outline-variant/10 animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-md-on-surface tracking-tight flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-md-error/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-md-error" />
            </div>
            Empty Trash
          </h2>
          <button 
            onClick={onClose}
            className="text-md-on-surface-variant hover:text-md-on-surface transition-all p-2 hover:bg-md-surface-variant/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-8 pb-8">
          <p className="text-[15px] text-md-on-surface-variant leading-relaxed font-medium">
            Are you sure you want to permanently delete <span className="text-md-on-surface font-bold">{count} items</span>? 
            This action <span className="text-md-error font-bold underline underline-offset-4">cannot be undone</span> and files will be lost forever.
          </p>
          
          <div className="flex justify-end gap-3 mt-10">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
              className="h-10 px-6 font-semibold rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={isPending}
              className="bg-md-error text-md-on-error hover:bg-md-error/90 px-8 h-10 font-semibold rounded-full border border-md-error/10 transition-all active:scale-95"
            >
              {isPending ? "Emptying..." : "Empty Trash"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
