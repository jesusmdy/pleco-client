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
    <Link href={href} className="relative">
      <div className={`w-8 h-8 flex items-center justify-center transition-colors rounded-md ${
        isActive 
          ? 'bg-figma-blue text-white shadow-sm' 
          : 'text-figma-text-muted hover:bg-figma-hover hover:text-white'
      }`}>
        {Icon ? (
          <Icon className="w-4 h-4" />
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

export function VerticalToolbar() {
  const { data: session } = useSession();

  return (
    <aside className="w-[44px] flex flex-col items-center py-2 bg-figma-dark h-screen shrink-0 gap-2 border-r border-black/20 shadow-xl">
      <div className="mb-2 p-1">
        <div className="w-6 h-6 bg-figma-blue rounded flex items-center justify-center">
          <HardDrive className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {TOOLBAR_ITEMS.map((item) => (
          <ToolbarItem 
            key={item.href}
            href={item.href}
            icon={item.icon}
            pattern={item.pattern}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-1">
        <div className="w-6 h-[1px] bg-white/5 mb-1" />
        <UserProfileBar username={session?.username} />
      </div>
    </aside>
  );
}
