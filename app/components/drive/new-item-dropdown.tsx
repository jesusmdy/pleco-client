"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUpload } from "@/app/components/drive/upload-provider";
import { FolderPlus, FileUp, FolderUp } from "lucide-react";
import { FabMenu, FabAction } from "@/app/components/ui/fab";
import { CreateFolderModal } from "./create-folder-modal";

export function NewItemDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const params = useParams();
  const folderId = (params?.folderId as string) || null;
  const { uploadTo } = useUpload();

  const handleAction = (type: "file" | "folder") => {
    uploadTo(folderId, type);
    setIsOpen(false);
  };

  return (
    <>
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
          onClick={() => handleAction("file")}
          variant="primary"
          delay={30}
        />
        <FabAction 
          icon={<FolderUp className="w-5 h-5" />} 
          label="Folder upload" 
          onClick={() => handleAction("folder")}
          variant="primary"
          delay={0}
        />
      </FabMenu>

      {isCreateModalOpen && (
        <CreateFolderModal parentId={folderId} onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
