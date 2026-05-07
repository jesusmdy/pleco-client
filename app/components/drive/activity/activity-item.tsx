"use client";

import { useState } from "react";
import { UploadItem, useUploadStore } from "@/app/store/useUploadStore";
import { XCircle, CheckCircle, Clock, Loader2, AlertCircle, ChevronRight, ChevronDown, X } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ActivityItemProps {
  item: UploadItem;
  onCancel: (id: string) => void;
  isChild?: boolean;
}

export function ActivityItem({ item, onCancel, isChild = false }: ActivityItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const dismissItem = useUploadStore(state => state.dismissItem);

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

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="flex flex-col">
      <div className={cn(
        "p-4 flex items-center justify-between hover:bg-md-primary/5 transition-colors group",
        isChild ? "pl-14 bg-md-surface-container-low/30" : "bg-md-surface-container"
      )}>
        <div className="flex items-center gap-4">
          {!isChild && hasChildren && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-md-on-surface-variant hover:text-md-on-surface transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {getStatusIcon(item.status)}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-md-on-surface text-[15px] font-bold leading-tight line-clamp-1">
                {item.name}
              </p>
              {item.type === "folder" && (
                <span className="text-[10px] font-bold bg-md-primary/10 text-md-primary px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  Folder
                </span>
              )}
            </div>
            <p className="text-md-on-surface-variant text-[12px] mt-1 font-semibold tracking-tight">
              {formatSize(item.size)} • {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("_", " ")}
              {item.error && <span className="text-md-error ml-2">• {item.error}</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {(item.status === "queue" || item.status === "in_progress") ? (
            <button
              onClick={() => onCancel(item.id)}
              className="text-md-on-surface-variant hover:text-md-error text-[13px] font-semibold tracking-tight px-3 py-1.5 hover:bg-md-error/10 rounded-xl transition-all"
            >
              Cancel
            </button>
          ) : (
            !isChild && (
              <button
                onClick={() => dismissItem(item.id)}
                title="Dismiss from activity"
                className="p-2 text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-variant/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Progress bar for in-progress items */}
      {item.status === "in_progress" && (
        <div className="h-0.5 w-full bg-md-outline-variant/10">
          <div 
            className="h-full bg-md-primary transition-all duration-300" 
            style={{ width: `${item.progress}%` }} 
          />
        </div>
      )}

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
