"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { useUploadStore } from "@/app/store/useUploadStore";
import { Button } from "@/app/components/ui/button";

export function UploadFileButton() {
  const params = useParams();
  const folderId = (params?.folderId as string) || null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFilesToQueue } = useUploadStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(Array.from(e.target.files), folderId);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="secondary"
      >
        <UploadCloud className="w-4 h-4" />
        Upload Files
      </Button>
    </>
  );
}
