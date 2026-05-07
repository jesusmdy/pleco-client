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
          "flex items-center gap-3 px-4 py-2.5 rounded-full text-[14px] font-semibold tracking-tight transition-all duration-200 group border active:scale-[0.98]",
          isActive 
            ? "bg-md-primary-container text-md-on-primary-container border-md-primary/10 shadow-sm" 
            : "text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface border-transparent"
        )}
      >
        <Icon className={cn(
          "w-5 h-5",
          isActive ? "text-md-primary" : "text-md-on-surface-variant group-hover:text-md-on-surface"
        )} />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="w-64 shrink-0 flex flex-col gap-10 pr-8 border-r border-md-outline-variant/10 h-full">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="px-4 text-[13px] font-semibold text-md-on-surface-variant tracking-tight mb-3">
            Personal information
          </h2>
          <nav className="space-y-1">
            {PERSONAL_ITEMS.map(renderItem)}
          </nav>
        </div>

        <div className="space-y-2">
          <h2 className="px-4 text-[13px] font-semibold text-md-on-surface-variant tracking-tight mb-3">
            Security
          </h2>
          <nav className="space-y-1">
            {SECURITY_ITEMS.map(renderItem)}
          </nav>
        </div>
      </div>
    </div>
  );
}
