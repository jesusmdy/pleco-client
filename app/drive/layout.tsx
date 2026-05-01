"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "@/app/components/layout/sidebar";
import { Header } from "@/app/components/layout/header";
import { UploadManager } from "@/app/components/drive/upload-manager";
import { AuthGuard } from "@/app/components/auth-guard";

export default function DriveLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <AuthGuard isAuth={true}>
      <div className="flex min-h-screen bg-discord-bg-primary">
        <Sidebar />
        <UploadManager />
        <div className="flex-1 flex flex-col bg-discord-bg-primary overflow-hidden">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
