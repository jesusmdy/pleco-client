"use client";

import { History, FileText, Image as ImageIcon, Video, Archive, File, ChevronRight } from "lucide-react";
import { formatBytes } from "@/app/lib/utils";
import Link from "next/link";
import { useRecentFiles } from "@/app/hooks/useRecentFiles";

const FILE_TYPE_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  "image/": { icon: ImageIcon, color: "text-md-primary", label: "Images" },
  "video/": { icon: Video, color: "text-md-tertiary", label: "Videos" },
  "application/pdf": { icon: FileText, color: "text-md-error", label: "Documents" },
  "text/": { icon: FileText, color: "text-md-error", label: "Documents" },
  "application/zip": { icon: Archive, color: "text-md-secondary", label: "Archives" },
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
      <div className="flex items-center gap-3 text-md-on-surface-variant px-1">
        <History className="w-5 h-5" />
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      
      <div className="space-y-10">
        {isLoading ? (
          <div className="bg-md-surface-container rounded-2xl border border-md-outline-variant/10 p-12 text-center text-md-on-surface-variant text-[14px] font-bold">
            Analyzing activity history...
          </div>
        ) : !files || files.length === 0 ? (
          <div className="bg-md-surface-container rounded-2xl border border-md-outline-variant/10 p-16 text-center text-md-on-surface-variant text-[14px] font-bold italic">
            No recent activity found in your drive.
          </div>
        ) : (
          Object.entries(groupedRecent || {}).map(([groupName, groupFiles]) => {
            if (groupFiles.length === 0) return null;

            return (
              <div key={groupName} className="space-y-4">
                <h3 className="text-[12px] font-bold text-md-on-surface-variant uppercase tracking-[0.1em] pl-2">
                  {groupName}
                </h3>
                <div className="bg-md-surface-container rounded-2xl border border-md-outline-variant/10 shadow-lg overflow-hidden divide-y divide-md-outline-variant/10">
                  {groupFiles.map((file) => {
                    let config = { icon: File, color: "text-md-on-surface-variant" };
                    for (const [key, c] of Object.entries(FILE_TYPE_CONFIG)) {
                      if (file.mimeType?.startsWith(key)) {
                        config = { icon: c.icon, color: c.color };
                        break;
                      }
                    }
                    const Icon = config.icon;

                    return (
                      <div key={file.id} className="p-4 flex items-center gap-5 hover:bg-md-primary/10 transition-all group">
                        <div className="w-11 h-11 rounded-xl bg-md-surface-container-highest border border-md-outline-variant/10 flex items-center justify-center shrink-0 shadow-sm">
                          <Icon className={`w-5.5 h-5.5 ${config.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-md-on-surface text-[15px] font-semibold truncate transition-colors">
                            {file.name}
                          </div>
                          <div className="text-md-on-surface-variant text-[12px] font-medium flex items-center gap-2 mt-1">
                            <span className="text-md-primary font-semibold">{formatBytes(file.size || 0)}</span>
                            <span className="opacity-20">•</span>
                            <span>
                              {new Date(file.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              {", "}
                              {new Date(file.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <Link 
                          href={`/fm/drive/folders/${file.parentId || ''}`}
                          className="w-10 h-10 rounded-full bg-md-surface-container-highest flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-md-primary hover:text-md-on-primary hover:scale-110 shadow-sm"
                        >
                          <ChevronRight className="w-5 h-5" />
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
