"use client";

import { Modal } from "@/app/components/ui/modal";
import { Button } from "@/app/components/ui/button";
import { FolderUp, FileText, Info } from "lucide-react";

interface FolderUploadConfirmModalProps {
  folderName: string;
  fileCount: number;
  totalSize: number;
  onConfirm: () => void;
  onClose: () => void;
}

export function FolderUploadConfirmModal({
  folderName,
  fileCount,
  totalSize,
  onConfirm,
  onClose
}: FolderUploadConfirmModalProps) {
  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb > 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${Math.round(kb)} KB`;
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Confirm folder upload">
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-md-primary/5 rounded-2xl border border-md-primary/10">
          <div className="w-12 h-12 bg-md-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <FolderUp className="w-6 h-6 text-md-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[17px] font-bold text-md-on-surface truncate">{folderName}</h3>
            <p className="text-[13px] font-medium text-md-on-surface-variant">Selected directory</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-md-surface-container-high rounded-2xl border border-md-outline-variant/10">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-md-on-surface-variant" />
              <span className="text-[12px] font-bold text-md-on-surface-variant uppercase tracking-wider">Contents</span>
            </div>
            <p className="text-xl font-bold text-md-on-surface">{fileCount} files</p>
          </div>
          <div className="p-4 bg-md-surface-container-high rounded-2xl border border-md-outline-variant/10">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-md-on-surface-variant" />
              <span className="text-[12px] font-bold text-md-on-surface-variant uppercase tracking-wider">Total Size</span>
            </div>
            <p className="text-xl font-bold text-md-on-surface">{formatSize(totalSize)}</p>
          </div>
        </div>

        <div className="bg-md-surface-container-highest/50 p-4 rounded-2xl border border-md-outline-variant/10">
          <p className="text-[13px] text-md-on-surface-variant leading-relaxed">
            Uploading this folder will recreate its entire directory structure in your current workspace.
            Large uploads may take some time depending on your connection.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="error"
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-2 h-12 rounded-2xl"
          >
            Start upload
          </Button>
        </div>
      </div>
    </Modal>
  );
}
