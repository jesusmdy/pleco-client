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
      <div className={`w-8 h-8 flex items-center justify-center transition-all rounded-md text-white font-bold text-xs select-none ${
        isActive 
          ? 'bg-figma-blue shadow-sm' 
          : 'bg-figma-hover group-hover:bg-[#4a4a4a]'
      }`}>
        {initial}
      </div>
    </Link>
  );
}
