"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadItem, useUploadStore } from "@/app/store/useUploadStore";
import { 
  XCircle, CheckCircle, Clock, Loader2, AlertCircle, ChevronRight, ChevronDown, X,
  Folder, FileText, Image as ImageIcon, Film, Music, FileArchive, File 
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ListItem } from "@/app/components/ui/list";
import { Chip } from "@/app/components/ui/chip";

interface ActivityItemProps {
  item: UploadItem;
  onCancel: (id: string) => void;
  isChild?: boolean;
}

export function ActivityItem({ item, onCancel, isChild = false }: ActivityItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const dismissItem = useUploadStore(state => state.dismissItem);

  const hasChildren = item.children && item.children.length > 0;

  const handleItemClick = () => {
    if (item.status !== "completed") return;
    
    if (!item.parentId || item.parentId === "root") {
      router.push("/fm/drive");
    } else {
      router.push(`/fm/drive/folders/${item.parentId}`);
    }
  };

  return (
    <div className="flex flex-col">
      <ListItem
        onClick={handleItemClick}
        className={cn(
          "min-h-[72px] !mx-0 !rounded-none !my-0 border-b border-md-outline-variant/5",
          isChild ? "pl-14 bg-md-surface-container-low/30" : "bg-md-surface-container",
          item.status === "completed" && "cursor-pointer"
        )}
        leading={
          <div className="flex items-center gap-4 shrink-0">
            {/* Folder toggle or padding */}
            {!isChild && hasChildren ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="w-10 h-10 flex items-center justify-center text-md-on-surface-variant hover:bg-md-on-surface/[0.08] rounded-full transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            ) : (
              !isChild && <div className="w-10" />
            )}

            {/* Leading Visual */}
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              item.type === "folder" ? "bg-md-primary/10 text-md-primary" : "bg-md-surface-variant/30 text-md-on-surface-variant"
            )}>
              <FileKindIcon name={item.name} type={item.type} />
            </div>
          </div>
        }
        supportingText={<ItemInfo item={item} isChild={isChild} mode="supporting" />}
        trailing={
          <div className="flex items-center gap-3 shrink-0">
            <StatusIcon status={item.status} />
            
            <ItemActions 
              item={item} 
              isChild={isChild} 
              onCancel={onCancel} 
              onDismiss={dismissItem} 
            />
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-[16px] tracking-tight">{item.name}</span>
          {item.type === "folder" && (
            <span className="text-[10px] font-bold bg-md-primary/10 text-md-primary px-1.5 py-0.5 rounded-full uppercase tracking-widest border border-md-primary/20 shrink-0">
              Folder
            </span>
          )}
        </div>
      </ListItem>

      <ProgressBar status={item.status} progress={item.progress} />

      {/* Nested Children */}
      {!isChild && hasChildren && isExpanded && (
        <div className="divide-y divide-md-outline-variant/5">
          {item.children!.map((child) => (
            <ActivityItem key={child.id} item={child} onCancel={onCancel} isChild />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Sub-components
 */

function StatusIcon({ status }: { status: UploadItem["status"] }) {
  switch (status) {
    case "queue": return <Clock className="w-5 h-5 text-md-on-surface-variant" />;
    case "in_progress": return <Loader2 className="w-5 h-5 text-md-primary animate-spin" />;
    case "completed": return (
      <Chip variant="success" className="h-7 px-3">
        Uploaded
      </Chip>
    );
    case "cancelled": return <XCircle className="w-5 h-5 text-md-on-surface-variant" />;
    case "error": return <AlertCircle className="w-5 h-5 text-md-error" />;
  }
}

function ItemInfo({ item, isChild, mode }: { item: UploadItem, isChild: boolean, mode: "headline" | "supporting" }) {
  const completedCount = item.children?.filter(c => c.status === "completed").length || 0;
  const totalCount = item.children?.length || 0;

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb > 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${Math.round(kb)} KB`;
  };

  const getParentFolderName = (path?: string) => {
    if (!path) return null;
    const parts = path.split('/');
    if (parts.length < 2) return null;
    return parts[parts.length - 2];
  };

  const parentFolder = getParentFolderName(item.relativePath);
  const hasChildren = item.children && item.children.length > 0;

  if (mode === "headline") {
    return (
      <div className="flex items-center gap-2">
        <h3 className="text-md-on-surface text-[16px] font-semibold leading-tight line-clamp-1 tracking-tight">
          {item.name}
        </h3>
        {item.type === "folder" && (
          <span className="text-[10px] font-bold bg-md-primary/10 text-md-primary px-1.5 py-0.5 rounded-full uppercase tracking-widest border border-md-primary/20 shrink-0">
            Folder
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      {item.type === "folder" && hasChildren ? (
        <Chip variant="primary" className="h-6 px-2 text-[11px] font-bold">
          {completedCount} of {totalCount} files uploaded
        </Chip>
      ) : (
        <>
          {isChild && parentFolder && (
            <Chip variant="primary" className="h-6 px-2 text-[11px] font-bold">
              in {parentFolder}
            </Chip>
          )}
          <Chip variant="surface" className="h-6 px-2 text-[11px] font-bold">
            {formatSize(item.size)}
          </Chip>
        </>
      )}
      
      {item.error && (
        <Chip variant="error" className="h-6 px-2 text-[11px] font-bold">
          {item.error}
        </Chip>
      )}
    </div>
  );
}

function ItemActions({ 
  item, 
  isChild, 
  onCancel, 
  onDismiss 
}: { 
  item: UploadItem; 
  isChild: boolean; 
  onCancel: (id: string) => void; 
  onDismiss: (id: string) => void;
}) {
  if (item.status === "queue" || item.status === "in_progress") {
    return (
      <button
        onClick={() => onCancel(item.id)}
        className="text-md-on-surface-variant hover:text-md-error text-[13px] font-semibold tracking-tight px-3 py-1.5 hover:bg-md-error/10 rounded-xl transition-all"
      >
        Cancel
      </button>
    );
  }

  if (!isChild) {
    return (
      <button
        onClick={() => onDismiss(item.id)}
        title="Dismiss from activity"
        className="p-2 text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-variant/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    );
  }

  return null;
}

function ProgressBar({ status, progress }: { status: UploadItem["status"], progress: number }) {
  if (status !== "in_progress") return null;

  return (
    <div className="h-1 w-full bg-md-outline-variant/10">
      <div 
        className="h-full bg-md-primary transition-all duration-300" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}

function FileKindIcon({ name, type }: { name: string, type: "file" | "folder" }) {
  if (type === "folder") return <Folder className="w-4 h-4 text-md-primary/60" />;
  
  const ext = name.split('.').pop()?.toLowerCase();
  
  const kinds = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    video: ['mp4', 'mkv', 'mov', 'avi', 'webm'],
    audio: ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
    doc: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz'],
  };

  if (kinds.image.includes(ext!)) return <ImageIcon className="w-4 h-4 text-md-on-surface-variant/60" />;
  if (kinds.video.includes(ext!)) return <Film className="w-4 h-4 text-md-on-surface-variant/60" />;
  if (kinds.audio.includes(ext!)) return <Music className="w-4 h-4 text-md-on-surface-variant/60" />;
  if (kinds.doc.includes(ext!)) return <FileText className="w-4 h-4 text-md-on-surface-variant/60" />;
  if (kinds.archive.includes(ext!)) return <FileArchive className="w-4 h-4 text-md-on-surface-variant/60" />;
  
  return <File className="w-4 h-4 text-md-on-surface-variant/60" />;
}
