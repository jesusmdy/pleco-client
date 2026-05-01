"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "@/app/components/layout/sidebar";
import { Header } from "@/app/components/layout/header";
import { Toolbar } from "@/app/components/drive/toolbar";
import { UploadManager } from "@/app/components/drive/upload-manager";
import { AuthGuard } from "@/app/components/auth-guard";

export default function DriveLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <AuthGuard isAuth={true}>
      <div className="flex min-h-screen bg-discord-bg-primary">
        <Sidebar username={session?.username} />
        <UploadManager />
        <div className="flex-1 flex flex-col bg-discord-bg-primary overflow-hidden">
          <Header />
          <Toolbar />
          <main className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
            </div>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
