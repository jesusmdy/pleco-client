import { Folder, FileText, Lock } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useRouter } from "next/navigation";
import { FileCardMenu } from "./file-card-menu";

interface FileCardProps {
  item: UnifiedDriveItem;
}

export function FileCard({ item }: FileCardProps) {
  const router = useRouter();
  const isFolder = item.itemType === "FOLDER";

  const handleClick = () => {
    if (isFolder) {
      router.push(`/drive/folders/${item.id}`);
    } else {
      // File click logic (e.g., download or preview) could go here
    }
  };

  if (isFolder) {
    return (
      <div 
        onClick={handleClick}
        className="flex items-center justify-between bg-discord-bg-secondary hover:bg-white/5 rounded-lg p-3 cursor-pointer group transition-colors border border-transparent hover:border-white/10"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Folder className="w-5 h-5 text-discord-text-muted group-hover:text-discord-blurple shrink-0 transition-colors" />
          <span className="text-white text-[14px] font-medium truncate select-none">{item.name}</span>
        </div>
        <FileCardMenu item={item} />
      </div>
    );
  }

  // File Layout
  return (
    <div 
      onClick={handleClick}
      className="bg-discord-bg-secondary hover:bg-white/5 rounded-xl cursor-pointer group flex flex-col h-56 overflow-hidden border border-transparent hover:border-white/10 transition-all"
    >
      {/* File Header */}
      <div className="flex items-center justify-between p-3 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileText className="w-5 h-5 text-discord-text-muted group-hover:text-discord-blurple shrink-0 transition-colors" />
          <span className="text-white text-[14px] font-medium truncate select-none">{item.name}</span>
        </div>
        <div className="flex items-center gap-1">
          {item.encrypted && <Lock className="w-3.5 h-3.5 text-discord-text-muted" />}
          <FileCardMenu item={item} />
        </div>
      </div>
      
      {/* Future Preview Area */}
      <div className="flex-1 bg-discord-bg-tertiary mx-3 mb-3 rounded-lg border border-white/5 flex items-center justify-center group-hover:bg-discord-bg-primary transition-colors">
        <FileText className="w-12 h-12 text-discord-text-muted/20" />
      </div>
    </div>
  );
}
