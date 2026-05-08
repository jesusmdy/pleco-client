"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useUploadActions } from "@/app/hooks/useUploadActions";
import { FolderUploadConfirmModal } from "./folder-upload-confirm-modal";

interface UploadContextType {
  uploadTo: (folderId: string | null, type: "file" | "folder") => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [targetId, setTargetId] = React.useState<string | null>(null);
  
  const {
    triggerFileUpload,
    triggerFolderUpload,
    pendingFolder,
    setPendingFolder,
    handleConfirmFolderUpload,
    fileInputRef,
    folderInputRef,
    handleFileChange
  } = useUploadActions(targetId);

  const uploadTo = (folderId: string | null, type: "file" | "folder") => {
    setTargetId(folderId);
    // Use a small timeout to ensure state update has propagated if needed, 
    // although refs don't depend on state for the click trigger.
    setTimeout(() => {
      if (type === "file") triggerFileUpload();
      else triggerFolderUpload();
    }, 0);
  };

  return (
    <UploadContext.Provider value={{ uploadTo }}>
      {children}
      
      {/* Global Hidden Inputs */}
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => handleFileChange(e, false)} 
      />
      <input 
        type="file" 
        className="hidden" 
        ref={folderInputRef} 
        onChange={(e) => handleFileChange(e, true)}
        {...{ webkitdirectory: "", directory: "" } as any}
      />

      {/* Global Confirmation Modal */}
      {pendingFolder && (
        <FolderUploadConfirmModal 
          folderName={pendingFolder.name}
          fileCount={pendingFolder.count}
          totalSize={pendingFolder.size}
          onConfirm={handleConfirmFolderUpload}
          onClose={() => setPendingFolder(null)}
        />
      )}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
}
