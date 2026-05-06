"use client";

import { useParams } from "next/navigation";
import { useDrive } from "@/app/hooks/useDrive";
import { Breadcrumb } from "@/app/components/drive/breadcrumb";

export function DriveBreadcrumb() {
  const params = useParams();
  const folderId = (params?.folderId as string) || null;
  const { breadcrumb } = useDrive(folderId);

  return (
    <div className="min-w-0">
      <Breadcrumb path={breadcrumb || []} />
    </div>
  );
}
