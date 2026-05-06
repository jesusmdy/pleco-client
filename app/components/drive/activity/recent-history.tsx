"use client";

import { History, FileText, Image as ImageIcon, Video, Archive, File, ChevronRight } from "lucide-react";
import { formatBytes } from "@/app/lib/utils";
import Link from "next/link";
import { useRecentFiles } from "@/app/hooks/useRecentFiles";

const FILE_TYPE_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  "image/": { icon: ImageIcon, color: "text-figma-blue", label: "Images" },
  "video/": { icon: Video, color: "text-purple-400", label: "Videos" },
  "application/pdf": { icon: FileText, color: "text-figma-red", label: "Documents" },
  "text/": { icon: FileText, color: "text-figma-red", label: "Documents" },
  "application/zip": { icon: Archive, color: "text-yellow-600", label: "Archives" },
};

interface RecentHistoryProps {
  title?: string;
}

export function RecentHistory({ title = "Historical Activity" }: RecentHistoryProps) {
  const { data: files, isLoading } = useRecentFiles();

  // Grouping logic for historical activity
  const groupFilesByTime = (files: any[]) => {
    const groups: Record<string, any[]> = {
      "Today": [],
      "Yesterday": [],
      "Last week": [],
      "Last month": [],
      "Older": [],
    };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const lastWeekStart = todayStart - 7 * 86400000;
    const lastMonthStart = todayStart - 30 * 86400000;

    files.forEach(file => {
      const time = new Date(file.createdAt).getTime();
      if (time >= todayStart) groups["Today"].push(file);
      else if (time >= yesterdayStart) groups["Yesterday"].push(file);
      else if (time >= lastWeekStart) groups["Last week"].push(file);
      else if (time >= lastMonthStart) groups["Last month"].push(file);
      else groups["Older"].push(file);
    });

    return groups;
  };

  const groupedRecent = files ? groupFilesByTime(files) : null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 text-figma-text-muted">
        <History className="w-4 h-4" />
        <h2 className="text-[11px] font-bold uppercase tracking-wider">{title}</h2>
      </div>
      
      <div className="space-y-8">
        {isLoading ? (
          <div className="bg-figma-dark/50 rounded-xl border border-white/5 p-8 text-center text-figma-text-muted text-[13px]">
            Analyzing activity history...
          </div>
        ) : !files || files.length === 0 ? (
          <div className="bg-figma-dark/50 rounded-xl border border-white/5 p-12 text-center text-figma-text-muted text-[13px] italic">
            No recent activity found.
          </div>
        ) : (
          Object.entries(groupedRecent || {}).map(([groupName, groupFiles]) => {
            if (groupFiles.length === 0) return null;

            return (
              <div key={groupName} className="space-y-3">
                <h3 className="text-[10px] font-bold text-figma-text-muted uppercase tracking-[0.08em] pl-1">
                  {groupName}
                </h3>
                <div className="bg-figma-dark/40 rounded-xl border border-white/5 shadow-2xl overflow-hidden divide-y divide-white/5">
                  {groupFiles.map((file) => {
                    let config = { icon: File, color: "text-figma-text-muted" };
                    for (const [key, c] of Object.entries(FILE_TYPE_CONFIG)) {
                      if (file.mimeType?.startsWith(key)) {
                        config = { icon: c.icon, color: c.color };
                        break;
                      }
                    }
                    const Icon = config.icon;

                    return (
                      <div key={file.id} className="p-3.5 flex items-center gap-4 hover:bg-white/5 transition-all group">
                        <div className="w-9 h-9 rounded-lg bg-figma-bg border border-white/5 flex items-center justify-center shrink-0">
                          <Icon className={`w-4.5 h-4.5 ${config.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-[13px] font-bold truncate transition-colors">
                            {file.name}
                          </div>
                          <div className="text-figma-text-muted text-[11px] font-medium flex items-center gap-2 mt-0.5">
                            <span className="text-white/60">{formatBytes(file.size || 0)}</span>
                            <span className="opacity-30">•</span>
                            <span>
                              {new Date(file.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              {", "}
                              {new Date(file.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <Link 
                          href={`/fm/drive/folders/${file.parentId || ''}`}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-figma-blue hover:scale-110"
                        >
                          <ChevronRight className="w-4 h-4 text-white" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
