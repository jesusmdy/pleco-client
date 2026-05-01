"use client";

import React from "react";
import { DiscordLogo } from "@/app/components/ui/discord-logo";
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
          <DiscordLogo className="w-12 h-12 text-discord-blurple mb-6" />
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
