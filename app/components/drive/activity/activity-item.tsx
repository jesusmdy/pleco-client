import { UploadItem } from "@/app/store/useUploadStore";
import { XCircle, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";

interface ActivityItemProps {
  item: UploadItem;
  onCancel: (id: string) => void;
}

export function ActivityItem({ item, onCancel }: ActivityItemProps) {
  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb > 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${Math.round(kb)} KB`;
  };

  const getStatusIcon = (status: UploadItem["status"]) => {
    switch (status) {
      case "queue": return <Clock className="w-5 h-5 text-md-on-surface-variant" />;
      case "in_progress": return <Loader2 className="w-5 h-5 text-md-primary animate-spin" />;
      case "completed": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "cancelled": return <XCircle className="w-5 h-5 text-md-on-surface-variant" />;
      case "error": return <AlertCircle className="w-5 h-5 text-md-error" />;
    }
  };

  return (
    <div className="p-4 flex items-center justify-between hover:bg-md-primary/10 transition-colors group">
      <div className="flex items-center gap-4">
        {getStatusIcon(item.status)}
        <div>
          <p className="text-md-on-surface text-[15px] font-bold leading-tight">{item.file.name}</p>
          <p className="text-md-on-surface-variant text-[11px] mt-1 uppercase tracking-widest font-bold">
            {formatSize(item.file.size)} • {item.status.replace("_", " ")}
          </p>
        </div>
      </div>
      
      {(item.status === "queue" || item.status === "in_progress") && (
        <button
          onClick={() => onCancel(item.id)}
          className="text-md-on-surface-variant hover:text-md-error text-[12px] font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-md-error/10 rounded-xl transition-all"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
