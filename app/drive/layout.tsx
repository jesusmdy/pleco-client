"use client";

import { Sidebar } from "@/app/components/layout/sidebar";
import { Header } from "@/app/components/layout/header";
import { UploadManager } from "@/app/components/drive/upload-manager";
import { AuthGuard } from "@/app/components/auth-guard";

export default function DriveLayout({ children }: { children: React.ReactNode }) {

  return (
    <AuthGuard isAuth={true}>
      <div className="flex min-h-screen bg-zinc-800">
        <Sidebar />
        <UploadManager />
        <div className="flex-1 flex flex-col overflow-hidden border-l border-white/5">
          <Header />
          <main className="flex-1 overflow-y-auto border-t border-white/5">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
