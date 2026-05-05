"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, FolderPlus, FileUp, ChevronDown } from "lucide-react";
import { useUploadStore } from "@/app/store/useUploadStore";
import { CreateFolderModal } from "./create-folder-modal";

export function NewItemDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const params = useParams();
  const folderId = (params?.folderId as string) || null;
  const { addFilesToQueue } = useUploadStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(Array.from(e.target.files), folderId);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsOpen(false);
  };


  return (
    <div className="relative" ref={menuRef}>
      <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />

      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Create or upload"
        className={`
          flex items-center gap-2 h-9 px-4
          bg-discord-blurple hover:bg-discord-blurple/90 
          text-white font-semibold text-[14px]
          rounded-full shadow-sm transition-all duration-150 active:scale-95
          cursor-pointer
          ${isOpen ? "ring-2 ring-white/20" : ""}
        `}
      >
        <Plus className="w-4 h-4" />
        <span>New</span>
        <ChevronDown className={`w-3.5 h-3.5 ml-0.5 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <DropdownMenu 
          onNewFolder={() => { setIsCreateModalOpen(true); setIsOpen(false); }}
          onFileUpload={() => fileInputRef.current?.click()}
        />
      )}

      {isCreateModalOpen && (
        <CreateFolderModal parentId={folderId} onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}

/**
 * Sub-component for the dropdown menu to follow Coding Standards (Single Responsibility)
 */
function DropdownMenu({ 
  onNewFolder, 
  onFileUpload 
}: { 
  onNewFolder: () => void; 
  onFileUpload: () => void; 
}) {
  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-discord-bg-modal rounded-lg shadow-xl border border-white/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
      <MenuButton 
        icon={<FolderPlus className="w-4 h-4" />} 
        label="New folder" 
        onClick={onNewFolder} 
        hint="Create a new folder"
      />
      <div className="h-[1px] bg-white/5 my-1 mx-2" />
      <MenuButton 
        icon={<FileUp className="w-4 h-4" />} 
        label="File upload" 
        onClick={onFileUpload} 
        hint="Upload files from your computer"
      />
    </div>
  );
}

function MenuButton({ 
  icon, 
  label, 
  onClick, 
  hint 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      title={hint}
      className="w-full flex items-center gap-3 px-3 py-2 text-[14px] text-discord-text-primary hover:bg-discord-blurple hover:text-white transition-colors text-left cursor-pointer group"
    >
      <span className="text-discord-text-muted group-hover:text-white transition-colors">{icon}</span>
      {label}
    </button>
  );
}
