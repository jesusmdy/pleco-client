"use client";

import { useUploadStore } from "@/app/store/useUploadStore";
import { ActivityHeader } from "@/app/components/drive/activity/activity-header";
import { ActivityList } from "@/app/components/drive/activity/activity-list";
import { RecentHistory } from "@/app/components/drive/activity/recent-history";
import { CloudUpload } from "lucide-react";

export default function ActivityPage() {
  const { queue, cancelItem } = useUploadStore();

  return (
    <div className="w-full max-w-5xl mx-auto px-8 py-10 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ActivityHeader />

      <div className="flex flex-col gap-16">
        {/* Section 1: Live uploads (On top) */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-md-on-surface-variant px-1">
            <CloudUpload className="w-6 h-6 text-md-primary" />
            <h2 className="text-2xl font-medium tracking-tight text-md-on-surface">Live activity</h2>
          </div>
          <ActivityList queue={queue} onCancel={cancelItem} />
        </section>

        {/* Section 2: Recent history (Below) */}
        <RecentHistory />
      </div>
    </div>
  );
}
