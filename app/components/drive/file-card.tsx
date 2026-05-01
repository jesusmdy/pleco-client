import { HardDrive, Folder, FileText, Lock } from "lucide-react";
import { UnifiedDriveItem } from "@/app/lib/api";
import { useRouter } from "next/navigation";

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

  const formatSize = (bytes: number | null) => {
    if (bytes === null) return null;
    const kb = bytes / 1024;
    if (kb > 1024) {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
    return `${Math.round(kb)} KB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-discord-bg-secondary border border-transparent hover:border-discord-blurple/30 rounded-lg p-4 cursor-pointer transition-all group flex flex-col relative"
    >
      {item.encrypted && (
        <div className="absolute top-3 right-3 text-discord-text-muted">
          <Lock className="w-4 h-4" />
        </div>
      )}
      
      <div className="w-12 h-12 bg-discord-bg-tertiary rounded flex items-center justify-center mb-3 text-discord-text-muted group-hover:text-discord-blurple transition-colors">
        {isFolder ? (
          <Folder className="w-6 h-6" />
        ) : (
          <FileText className="w-6 h-6" />
        )}
      </div>
      
      <p className="text-white font-medium truncate mb-1" title={item.name}>
        {item.name}
      </p>
      
      {!isFolder && (
        <p className="text-discord-text-muted text-[12px]">
          {formatDate(item.updatedAt)} 
          {item.size !== null ? ` • ${formatSize(item.size)}` : ""}
        </p>
      )}
    </div>
  );
}
