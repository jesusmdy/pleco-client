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
          flex items-center gap-2.5 h-12 px-6
          bg-md-primary hover:bg-md-primary/90 
          text-md-on-primary font-bold text-[15px]
          rounded-2xl transition-all duration-200 active:scale-95
          cursor-pointer border border-md-primary/10
        `}
      >
        <Plus className="w-5 h-5" />
        <span>New</span>
        <ChevronDown className={`w-4 h-4 ml-1 opacity-60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
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
    <div className="absolute right-0 top-full mt-3 w-56 bg-md-surface-container rounded-2xl shadow-xl border border-md-outline-variant/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
      <MenuButton 
        icon={<FolderPlus className="w-5 h-5" />} 
        label="New folder" 
        onClick={onNewFolder} 
        hint="Create a new folder"
      />
      <div className="h-[1px] bg-md-outline-variant/10 my-1 mx-2" />
      <MenuButton 
        icon={<FileUp className="w-5 h-5" />} 
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
      className="w-[calc(100%-16px)] flex items-center gap-3.5 px-4 py-2.5 text-[13px] font-semibold tracking-tight text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary transition-all text-left cursor-pointer group rounded-xl mx-2"
    >
      <span className="text-md-on-surface-variant group-hover:text-md-primary transition-colors">{icon}</span>
      {label}
    </button>
  );
}
