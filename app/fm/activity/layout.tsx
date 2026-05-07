"use client";

import { Header } from "@/app/components/layout/header";

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-md-background">
      <Header />
      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-md-outline-variant/10">
        {children}
      </main>
    </div>
  );
}
