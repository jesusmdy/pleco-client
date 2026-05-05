"use client";

import { Sidebar } from "@/app/components/layout/sidebar";
import { Header } from "@/app/components/layout/header";
import { AuthGuard } from "@/app/components/auth-guard";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard isAuth={true}>
      <div className="flex min-h-screen bg-discord-bg-primary">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden border-l border-white/5">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
