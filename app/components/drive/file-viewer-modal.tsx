"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Download, Edit2, Trash2, FileText, Info, Calendar, HardDrive, File as FileIcon } from "lucide-react";
import { UnifiedDriveItem, downloadFile, API_BASE_URL } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { getPreviewType } from "@/app/lib/preview";
import { PreviewRenderer } from "./preview-renderer";
import { formatBytes } from "@/app/lib/utils";
import { RenameModal } from "./rename-modal";
import { DeleteModal } from "./delete-modal";
import { cn } from "@/app/lib/utils";

interface FileViewerModalProps {
  item: UnifiedDriveItem;
  onClose: () => void;
}

export function FileViewerModal({ item, onClose }: FileViewerModalProps) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      if (!session?.backendToken) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/drive/download/${item.id}`, {
          headers: { Authorization: `Bearer ${session.backendToken}` },
        });

        if (!response.ok) throw new Error("Failed to load file content");

        const b = await response.blob();
        setBlob(b);
        const url = window.URL.createObjectURL(b);
        setBlobUrl(url);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();

    return () => {
      if (blobUrl) window.URL.revokeObjectURL(blobUrl);
    };
  }, [item.id, session?.backendToken]);

  const previewType = getPreviewType(item.mimeType);

  const handleDownload = () => {
    downloadFile(item.id, item.name, session!.backendToken);
  };

  return createPortal(
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-md-surface-container rounded-[32px] w-full h-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-500 border border-md-outline-variant/10">
        
        {/* Header */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-md-outline-variant/10 bg-md-surface-container/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-md-primary/10 flex items-center justify-center text-md-primary">
              <FileIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-md-on-surface tracking-tight truncate max-w-[400px]">
                {item.name}
              </h2>
              <p className="text-[12px] text-md-on-surface-variant font-medium opacity-70">
                {item.mimeType || "Unknown type"}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 rounded-full hover:bg-md-surface-variant/40 text-md-on-surface-variant hover:text-md-on-surface transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Area (80/20 Split) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Preview Area (80%) */}
          <div className="w-[78%] h-full relative p-6">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-md-primary/10 border-t-md-primary animate-spin" />
                  <FileText className="absolute inset-0 m-auto w-6 h-6 text-md-primary animate-pulse" />
                </div>
                <p className="text-[14px] font-bold text-md-on-surface-variant tracking-tight">Preparing your preview...</p>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-md-error p-8 text-center">
                <Info className="w-12 h-12" />
                <p className="text-[16px] font-bold tracking-tight">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-md-error/10 rounded-full text-[13px] font-bold hover:bg-md-error/20 transition-all">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-700">
                <PreviewRenderer type={previewType} blob={blob!} blobUrl={blobUrl!} />
              </div>
            )}
          </div>

          {/* Right: Info Sidebar (22%) */}
          <div className="w-[22%] h-full border-l border-md-outline-variant/10 bg-md-surface-container-high/30 p-8 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-md-outline-variant/20">
            
            <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-md-primary mb-6">File Details</h3>
            
            <div className="flex flex-col gap-6">
              <DetailItem 
                icon={<Calendar className="w-4 h-4" />} 
                label="Created" 
                value={new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })} 
              />
              <DetailItem 
                icon={<Calendar className="w-4 h-4" />} 
                label="Modified" 
                value={new Date(item.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })} 
              />
              <DetailItem 
                icon={<HardDrive className="w-4 h-4" />} 
                label="Size" 
                value={formatBytes(item.size || 0)} 
              />
              <DetailItem 
                icon={<FileText className="w-4 h-4" />} 
                label="MIME Type" 
                value={item.mimeType || "N/A"} 
              />
            </div>

            <div className="mt-12">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-md-primary mb-6">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <ActionButton 
                  icon={<Download className="w-4 h-4" />} 
                  label="Download" 
                  onClick={handleDownload} 
                />
                <ActionButton 
                  icon={<Edit2 className="w-4 h-4" />} 
                  label="Rename" 
                  onClick={() => setIsRenameOpen(true)} 
                />
                <ActionButton 
                  icon={<Trash2 className="w-4 h-4" />} 
                  label="Delete" 
                  variant="error"
                  onClick={() => setIsDeleteOpen(true)} 
                />
              </div>
            </div>

            <div className="mt-auto pt-8 opacity-40 hover:opacity-100 transition-opacity">
              <div className="p-4 rounded-2xl bg-md-surface-variant/20 border border-md-outline-variant/10">
                <p className="text-[11px] leading-relaxed text-md-on-surface-variant font-medium">
                  ID: <span className="font-mono break-all">{item.id}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isRenameOpen && (
        <RenameModal 
          item={item} 
          onClose={() => {
            setIsRenameOpen(false);
            // We don't necessarily close the viewer on rename, 
            // but the name in the viewer header won't update automatically 
            // without a prop sync. For now, just letting it be.
          }} 
        />
      )}
      {isDeleteOpen && (
        <DeleteModal 
          item={item} 
          onClose={() => {
            setIsDeleteOpen(false);
            onClose(); // Close viewer if deleted
          }} 
        />
      )}
    </div>,
    document.body
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-[11px] font-bold text-md-on-surface-variant/60 uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-[14px] font-semibold text-md-on-surface tracking-tight truncate">
        {value}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, variant = "default" }: { icon: React.ReactNode, label: string, onClick: () => void, variant?: "default" | "error" }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-5 py-3 rounded-[16px] text-[13px] font-bold transition-all active:scale-95",
        variant === "error" 
          ? "bg-md-error/10 text-md-error hover:bg-md-error/20" 
          : "bg-md-surface-variant/30 text-md-on-surface-variant hover:bg-md-surface-variant/60 hover:text-md-on-surface"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
