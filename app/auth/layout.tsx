"use client";

import React from "react";
import { HardDrive } from "lucide-react";
import { AuthGuard } from "@/app/components/auth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard isAuth={false}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-discord-bg-tertiary p-4 md:p-0 relative overflow-hidden">
        {/* Abstract background elements (optional, can be added for more flair) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-discord-blurple opacity-5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-discord-fuchsia opacity-5 rounded-full blur-[100px]" />
        
        <div className="z-10 w-full max-w-[480px] bg-discord-bg-modal rounded-lg shadow-2xl p-8 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8 gap-2">
            <div className="w-16 h-16 bg-discord-blurple rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <HardDrive className="w-8 h-8 text-white transform rotate-6" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-2">Pleco</h1>
          </div>
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
