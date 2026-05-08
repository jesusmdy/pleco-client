"use client";

import { UploadManager } from "@/app/components/drive/upload-manager";
import { AuthGuard } from "@/app/components/auth-guard";
import { VerticalToolbar } from "@/app/components/layout/vertical-toolbar";
import { UploadProvider } from "@/app/components/drive/upload-provider";
import { useEffect } from "react";
import { useCryptoStore } from "@/app/store/useCryptoStore";

export default function FmLayout({ children }: { children: React.ReactNode }) {
  const initializeFromSession = useCryptoStore(state => state.initializeFromSession);

  useEffect(() => {
    initializeFromSession();
  }, [initializeFromSession]);

  return (
    <AuthGuard isAuth={true}>
      <UploadProvider>
        <div className="flex h-screen bg-md-background overflow-hidden">
          <VerticalToolbar />
          <UploadManager />
          <main className="flex-1 flex flex-col min-w-0 border-l border-md-outline-variant/10">
            {children}
          </main>
        </div>
      </UploadProvider>
    </AuthGuard>
  );
}
