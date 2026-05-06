"use client";

import { useUploadStore } from "@/app/store/useUploadStore";
import { ActivityHeader } from "@/app/components/drive/activity/activity-header";
import { ActivityList } from "@/app/components/drive/activity/activity-list";
import { RecentHistory } from "@/app/components/drive/activity/recent-history";
import { CloudUpload } from "lucide-react";

export default function ActivityPage() {
  const { queue, cancelItem } = useUploadStore();

  return (
    <div className="h-full overflow-y-auto p-8 w-full max-w-5xl mx-auto space-y-12 bg-md-background scrollbar-thin scrollbar-thumb-md-outline-variant/10">
      <ActivityHeader />

      <div className="flex flex-col gap-12">
        {/* Section 1: Live Uploads (On Top) */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-md-on-surface-variant px-1">
            <CloudUpload className="w-5 h-5" />
            <h2 className="text-[13px] font-bold uppercase tracking-widest">Live Activity</h2>
          </div>
          <ActivityList queue={queue} onCancel={cancelItem} />
        </section>

        {/* Section 2: Recent History (Below) */}
        <RecentHistory />
      </div>
    </div>
  );
}
