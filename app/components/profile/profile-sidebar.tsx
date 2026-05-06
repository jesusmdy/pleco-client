"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/app/lib/utils";

const PERSONAL_ITEMS = [
  {
    label: "Profile",
    href: "/fm/profile",
    icon: User
  }
];

const SECURITY_ITEMS = [
  {
    label: "Change Password",
    href: "/fm/profile/change-password",
    icon: Lock
  },
  {
    label: "Manage MFA",
    href: "/fm/profile/manage-mfa",
    icon: ShieldCheck
  }
];

export function ProfileSidebar() {
  const pathname = usePathname();

  const renderItem = (item: any) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all group",
          isActive 
            ? "bg-figma-blue/10 text-figma-blue" 
            : "text-figma-text-muted hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon className={cn(
          "w-4 h-4",
          isActive ? "text-figma-blue" : "text-figma-text-muted group-hover:text-white"
        )} />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="w-64 shrink-0 flex flex-col gap-8 pr-8 border-r border-white/5 h-full">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="px-3 text-[10px] font-bold text-figma-text-muted uppercase tracking-wider mb-2">
            Personal Information
          </h2>
          <nav className="space-y-0.5">
            {PERSONAL_ITEMS.map(renderItem)}
          </nav>
        </div>

        <div className="space-y-1.5">
          <h2 className="px-3 text-[10px] font-bold text-figma-text-muted uppercase tracking-wider mb-2">
            Security
          </h2>
          <nav className="space-y-0.5">
            {SECURITY_ITEMS.map(renderItem)}
          </nav>
        </div>
      </div>
    </div>
  );
}
