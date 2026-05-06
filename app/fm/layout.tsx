"use client";

import { UploadManager } from "@/app/components/drive/upload-manager";
import { AuthGuard } from "@/app/components/auth-guard";
import { VerticalToolbar } from "@/app/components/layout/vertical-toolbar";

export default function FmLayout({ children }: { children: React.ReactNode }) {

  return (
    <AuthGuard isAuth={true}>
      <div className="flex min-h-screen bg-figma-bg overflow-hidden text-figma-text-muted">
        <VerticalToolbar />
        <UploadManager />
        <main className="flex-1 flex flex-col min-w-0 border-l border-white/5">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
