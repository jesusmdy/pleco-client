"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FolderPlus } from "lucide-react";
import { CreateFolderModal } from "./create-folder-modal";
import { Button } from "@/app/components/ui/button";

export function CreateFolderButton() {
  const params = useParams();
  const folderId = (params?.folderId as string) || null;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        variant="primary"
      >
        <FolderPlus className="w-4 h-4" />
        New Folder
      </Button>

      {isCreateModalOpen && (
        <CreateFolderModal
          parentId={folderId}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  );
}
