"use client";

import { HardDrive, Activity, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/app/lib/utils";
import { UserProfileBar } from "@/app/components/ui/user-profile-bar";
import { QuickMenu } from "./quick-menu";

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

function ToolbarItem({ href, icon: Icon, children, label, pattern }: ToolbarItemProps & { label?: string }) {
  const pathname = usePathname();

  const isActive = pattern
    ? pattern.test(pathname)
    : pathname === href;

  return (
    <Link href={href} className="relative group flex flex-col items-center gap-1 w-full py-2">
      {/* Active Indicator Pill */}
      <div className={cn(
        "w-14 h-8 flex items-center justify-center transition-all duration-300 rounded-full",
        isActive 
          ? 'bg-md-primary-container text-md-on-primary-container border border-md-primary/10' 
          : 'text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface'
      )}>
        {Icon ? (
          <Icon className={cn(
            "w-5.5 h-5.5 transition-transform duration-300",
            isActive ? 'scale-110' : 'group-hover:scale-110'
          )} />
        ) : (
          <div className="font-bold text-xs select-none">
            {children}
          </div>
        )}
      </div>
      
      {/* Label */}
      {label && (
        <span className={cn(
          "text-[12px] font-semibold tracking-tight transition-colors duration-300",
          isActive ? "text-md-on-surface font-bold" : "text-md-on-surface-variant group-hover:text-md-on-surface"
        )}>
          {label}
        </span>
      )}
    </Link>
  );
}


export function VerticalToolbar() {
  const { data: session } = useSession();

  return (
    <aside className="w-[96px] flex flex-col items-center py-6 bg-md-surface-container-low h-screen shrink-0 gap-8 border-r border-md-outline-variant/10 z-50">
      <div className="mb-2">
        <div className="w-12 h-12 bg-md-primary rounded-[18px] flex items-center justify-center rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer border border-md-primary/10 shadow-sm active:scale-90">
          <HardDrive className="w-6 h-6 text-md-on-primary" />
        </div>
      </div>

      <nav className="flex flex-col gap-4 w-full px-2">
        {TOOLBAR_ITEMS.map((item) => (
          <ToolbarItem 
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            pattern={item.pattern}
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-6 w-full pb-2">
        <QuickMenu />
        <div className="w-10 h-[1px] bg-md-outline-variant/10" />
        <UserProfileBar username={session?.username} />
      </div>
    </aside>
  );
}
