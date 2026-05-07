"use client";

import { useParams, usePathname } from "next/navigation";
import { useDrive } from "@/app/hooks/useDrive";
import { Breadcrumb } from "@/app/components/drive/breadcrumb";

export function DriveBreadcrumb() {
  const params = useParams();
  const pathname = usePathname();
  const folderId = (params?.folderId as string) || null;
  const { breadcrumb } = useDrive(folderId);

  if (pathname === "/fm/activity") {
    return (
      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-semibold tracking-tight text-md-on-surface">Activity</h1>
      </div>
    );
  }

  if (pathname === "/fm/storage") {
    return (
      <div className="flex items-center gap-2">
        <h1 className="text-[22px] font-semibold tracking-tight text-md-on-surface">Storage</h1>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <Breadcrumb path={breadcrumb || []} />
    </div>
  );
}
