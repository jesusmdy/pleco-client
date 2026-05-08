import { useState, useRef } from "react";
import { useUploadStore } from "@/app/store/useUploadStore";

/**
 * Hook to handle file and folder upload interactions.
 * Returns triggers and the necessary state for rendering confirmation modals.
 */
export function useUploadActions(targetFolderId: string | null) {
  const [pendingFolder, setPendingFolder] = useState<{ files: File[], name: string, count: number, size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { addFilesToQueue } = useUploadStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isFolder = false) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      if (isFolder) {
        const folderName = files[0].webkitRelativePath.split('/')[0];
        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        setPendingFolder({ files, name: folderName, count: files.length, size: totalSize });
      } else {
        addFilesToQueue(files, targetFolderId, false);
      }
    }
    // Clear inputs for re-selection
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (folderInputRef.current) folderInputRef.current.value = "";
  };

  const handleConfirmFolderUpload = () => {
    if (pendingFolder) {
      addFilesToQueue(pendingFolder.files, targetFolderId, true);
      setPendingFolder(null);
    }
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const triggerFolderUpload = async () => {
    if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
      try {
        const handle = await (window as any).showDirectoryPicker();
        const files: File[] = [];
        
        async function walk(dirHandle: any, path: string) {
          for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file') {
              const file = await entry.getFile();
              Object.defineProperty(file, 'webkitRelativePath', {
                value: `${path}${entry.name}`,
                configurable: true,
                enumerable: true,
                writable: true
              });
              files.push(file);
            } else if (entry.kind === 'directory') {
              await walk(entry, `${path}${entry.name}/`);
            }
          }
        }
        
        await walk(handle, `${handle.name}/`);
        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        setPendingFolder({ files, name: handle.name, count: files.length, size: totalSize });
      } catch (err) {
        // User cancelled or error
        console.error("Folder picker error:", err);
      }
    } else {
      folderInputRef.current?.click();
    }
  };

  return {
    triggerFileUpload,
    triggerFolderUpload,
    pendingFolder,
    setPendingFolder,
    handleConfirmFolderUpload,
    fileInputRef,
    folderInputRef,
    handleFileChange
  };
}
