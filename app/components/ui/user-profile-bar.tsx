"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserProfileBarProps {
  username?: string | null;
}

export function UserProfileBar({ username }: UserProfileBarProps) {
  const pathname = usePathname();
  const isActive = pathname === "/fm/profile";
  const initial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <Link href="/fm/profile" className="relative group">
      <div className={`w-9 h-9 flex items-center justify-center transition-all rounded-full font-bold text-[13px] select-none ${
        isActive 
          ? 'bg-md-primary text-md-on-primary shadow-sm border border-md-primary/10 scale-105' 
          : 'bg-md-surface-container-highest text-md-on-surface group-hover:bg-md-surface-variant/40'
      }`}>
        {initial}
      </div>
    </Link>
  );
}
