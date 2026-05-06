"use client";

import { HardDrive, Activity, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const TOOLBAR_ITEMS = [
  {
    label: "My Drive",
    icon: HardDrive,
    href: "/fm/drive",
    pattern: /^\/fm\/drive(\/folders\/.*)?$/
  },
  {
    label: "Search",
    icon: Search,
    href: "/fm/drive/search",
    pattern: /^\/fm\/drive\/search$/
  },
  {
    label: "Activity",
    icon: Activity,
    href: "/fm/activity",
    pattern: /^\/fm\/activity$/
  },
];

interface ToolbarItemProps {
  href: string;
  icon?: any;
  children?: React.ReactNode;
  pattern?: RegExp;
}

function ToolbarItem({ href, icon: Icon, children, pattern }: ToolbarItemProps) {
  const pathname = usePathname();

  const isActive = pattern
    ? pattern.test(pathname)
    : pathname === href;

  return (
    <Link href={href} className="relative group px-2">
      <div className={`w-10 h-10 flex items-center justify-center transition-all rounded-full ${
        isActive 
          ? 'bg-md-primary-container text-md-on-primary-container border border-md-primary/10' 
          : 'text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface'
      }`}>
        {Icon ? (
          <Icon className={`w-5 h-5 transition-transform group-active:scale-90 ${isActive ? 'scale-110' : ''}`} />
        ) : (
          <div className="font-bold text-xs select-none">
            {children}
          </div>
        )}
      </div>
    </Link>
  );
}

import { UserProfileBar } from "@/app/components/ui/user-profile-bar";
import { QuickMenu } from "./quick-menu";

export function VerticalToolbar() {
  const { data: session } = useSession();

  return (
    <aside className="w-[56px] flex flex-col items-center py-4 bg-md-surface-container-low h-screen shrink-0 gap-4 border-r border-md-outline-variant/10 z-50">
      <div className="mb-4">
        <div className="w-10 h-10 bg-md-primary rounded-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform cursor-pointer border border-md-primary/10">
          <HardDrive className="w-5 h-5 text-md-on-primary" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {TOOLBAR_ITEMS.map((item) => (
          <ToolbarItem 
            key={item.href}
            href={item.href}
            icon={item.icon}
            pattern={item.pattern}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 w-full">
        <QuickMenu />
        <div className="w-8 h-[1px] bg-md-outline-variant/20" />
        <UserProfileBar username={session?.username} />
      </div>
    </aside>
  );
}
