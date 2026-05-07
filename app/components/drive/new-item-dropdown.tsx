"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FolderPlus, FileUp, FolderUp } from "lucide-react";
import { useUploadStore } from "@/app/store/useUploadStore";
import { FabMenu, FabAction } from "@/app/components/ui/fab";
import { CreateFolderModal } from "./create-folder-modal";
import { FolderUploadConfirmModal } from "./folder-upload-confirm-modal";

export function NewItemDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pendingFolder, setPendingFolder] = useState<{ files: File[], name: string, count: number, size: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  const params = useParams();
  const folderId = (params?.folderId as string) || null;
  const { addFilesToQueue } = useUploadStore();
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isFolder = false) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      if (isFolder) {
        const folderName = files[0].webkitRelativePath.split('/')[0];
        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        setPendingFolder({ files, name: folderName, count: files.length, size: totalSize });
      } else {
        addFilesToQueue(files, folderId, false);
      }
    }
    // Clear inputs
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (folderInputRef.current) folderInputRef.current.value = "";
    setIsOpen(false);
  };

  const handleConfirmFolderUpload = () => {
    if (pendingFolder) {
      addFilesToQueue(pendingFolder.files, folderId, true);
      setPendingFolder(null);
    }
  };

  const handleFolderUploadClick = async () => {
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
        setIsOpen(false);
      } catch (err) {
        console.error("Folder picker error:", err);
      }
    } else {
      folderInputRef.current?.click();
    }
  };

  return (
    <>
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

      <FabMenu isOpen={isOpen} onOpenChange={setIsOpen}>
        <FabAction 
          icon={<FolderPlus className="w-5 h-5" />} 
          label="New folder" 
          onClick={() => { setIsCreateModalOpen(true); setIsOpen(false); }}
          variant="primary"
          delay={60}
        />
        <FabAction 
          icon={<FileUp className="w-5 h-5" />} 
          label="File upload" 
          onClick={() => { fileInputRef.current?.click(); setIsOpen(false); }}
          variant="primary"
          delay={30}
        />
        <FabAction 
          icon={<FolderUp className="w-5 h-5" />} 
          label="Folder upload" 
          onClick={() => { handleFolderUploadClick(); setIsOpen(false); }}
          variant="primary"
          delay={0}
        />
      </FabMenu>

      {isCreateModalOpen && (
        <CreateFolderModal parentId={folderId} onClose={() => setIsCreateModalOpen(false)} />
      )}

      {pendingFolder && (
        <FolderUploadConfirmModal 
          folderName={pendingFolder.name}
          fileCount={pendingFolder.count}
          totalSize={pendingFolder.size}
          onConfirm={handleConfirmFolderUpload}
          onClose={() => setPendingFolder(null)}
        />
      )}
    </>
  );
}
