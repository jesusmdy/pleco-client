"use client";

import { useStorageUsage } from "@/app/hooks/useStorageUsage";
import { useProfile } from "@/app/hooks/useProfile";
import { useRecentFiles } from "@/app/hooks/useRecentFiles";
import { formatBytes } from "@/app/lib/utils";
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Archive, 
  File, 
  ChevronRight, 
  History
} from "lucide-react";
import Link from "next/link";

const FILE_TYPE_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  "image/": { icon: ImageIcon, color: "bg-blue-500", label: "Images" },
  "video/": { icon: Video, color: "bg-purple-500", label: "Videos" },
  "application/pdf": { icon: FileText, color: "bg-red-500", label: "Documents" },
  "text/": { icon: FileText, color: "bg-red-500", label: "Documents" },
  "application/zip": { icon: Archive, color: "bg-yellow-500", label: "Archives" },
  "application/x-rar-compressed": { icon: Archive, color: "bg-yellow-500", label: "Archives" },
};

export default function StoragePage() {
  const { data: usage, isLoading: usageLoading } = useStorageUsage();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: recentFiles, isLoading: recentLoading } = useRecentFiles();

  if (usageLoading || profileLoading) {
    return <div className="p-8 text-discord-text-muted">Loading storage data...</div>;
  }

  if (!usage || !profile) return null;

  const used = usage.totalSize;
  const limit = profile.storageLimitBytes;
  const percentage = Math.min(100, (used / limit) * 100);

  // Group breakdown by category
  const breakdown = Object.entries(usage.sizeByType || {}).reduce((acc, [mime, size]) => {
    let category = "Others";
    for (const [key, config] of Object.entries(FILE_TYPE_CONFIG)) {
      if (mime.startsWith(key)) {
        category = config.label;
        break;
      }
    }
    acc[category] = (acc[category] || 0) + size;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Storage Dashboard</h1>
        <p className="text-discord-text-muted font-medium">
          Manage your cloud storage and view your usage breakdown.
        </p>
      </div>

      {/* Usage Card */}
      <div className="bg-discord-bg-secondary rounded-xl p-8 border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">{formatBytes(used).split(' ')[0]}</span>
              <span className="text-xl font-bold text-discord-text-muted">{formatBytes(used).split(' ')[1]} used</span>
            </div>
            <p className="text-discord-text-muted font-semibold tracking-wide">
              Total Capacity: <span className="text-white">{formatBytes(limit)}</span>
            </p>
          </div>
          <div className="bg-discord-blurple/10 px-4 py-2 rounded-full border border-discord-blurple/20">
            <span className="text-discord-blurple font-bold text-sm uppercase tracking-widest">
              {profile.tierName} Plan
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-discord-bg-tertiary rounded-full overflow-hidden shadow-inner flex">
          {Object.entries(breakdown).map(([label, size], index) => {
             const categoryPercentage = (size / limit) * 100;
             const config = Object.values(FILE_TYPE_CONFIG).find(c => c.label === label) || { color: "bg-discord-text-muted" };
             return (
               <div 
                 key={label}
                 className={`h-full ${config.color} transition-all duration-500`}
                 style={{ width: `${categoryPercentage}%`, opacity: 1 - (index * 0.1) }}
                 title={`${label}: ${formatBytes(size)}`}
               />
             );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {Object.entries(breakdown).map(([label, size]) => {
            const config = Object.values(FILE_TYPE_CONFIG).find(c => c.label === label) || { icon: File, color: "bg-discord-text-muted" };
            return (
              <div key={label} className="space-y-2 group cursor-default">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  <span className="text-discord-text-muted text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                    {label}
                  </span>
                </div>
                <div className="text-white font-bold text-lg">{formatBytes(size)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-discord-bg-secondary rounded-xl flex items-center justify-center border border-white/5 shadow-lg">
            <History className="w-5 h-5 text-discord-blurple" />
          </div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Recent Uploads</h2>
        </div>

        <div className="bg-discord-bg-secondary rounded-xl border border-white/5 overflow-hidden shadow-2xl">
          {recentLoading ? (
            <div className="p-8 text-center text-discord-text-muted font-medium">Loading recent files...</div>
          ) : recentFiles?.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-discord-bg-tertiary rounded-2xl flex items-center justify-center mx-auto">
                <File className="w-8 h-8 text-discord-text-muted" />
              </div>
              <p className="text-discord-text-muted font-medium italic">No recent uploads found.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentFiles?.map((file) => {
                let config = { icon: File, color: "text-discord-text-muted" };
                for (const [key, c] of Object.entries(FILE_TYPE_CONFIG)) {
                  if (file.mimeType?.startsWith(key)) {
                    config = { icon: c.icon, color: c.color.replace('bg-', 'text-') };
                    break;
                  }
                }
                const Icon = config.icon;

                return (
                  <div key={file.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                    <div className={`w-10 h-10 rounded-lg bg-discord-bg-tertiary flex items-center justify-center shrink-0 border border-white/5`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold truncate group-hover:text-discord-blurple transition-colors">
                        {file.name}
                      </div>
                      <div className="text-discord-text-muted text-[13px] font-medium flex items-center gap-2">
                        <span>{formatBytes(file.size || 0)}</span>
                        <span>•</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/drive/folders/${file.parentId || ''}`}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-discord-blurple"
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
