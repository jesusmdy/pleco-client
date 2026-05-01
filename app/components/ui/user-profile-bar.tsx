"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface UserProfileBarProps {
  username?: string | null;
}

export function UserProfileBar({ username }: UserProfileBarProps) {
  const initial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-discord-red flex items-center justify-center text-white font-bold text-[14px] shrink-0 shadow-sm">
        {initial}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
        className="text-[13px] font-medium text-discord-text-muted hover:text-white transition-colors flex items-center gap-1"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:inline">Logout</span>
      </button>
    </div>
  );
}
