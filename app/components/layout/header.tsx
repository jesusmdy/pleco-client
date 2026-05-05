"use client";

import { useSession } from "next-auth/react";
import { Search, Bell, Grid, List as ListIcon } from "lucide-react";
import { UserProfileBar } from "@/app/components/ui/user-profile-bar";
import Link from "next/link";
import { useViewStore } from "@/app/store/viewStore";

function ViewToggle() {
  const { viewMode, setViewMode } = useViewStore();

  return (
    <div className="flex bg-discord-bg-tertiary p-1 rounded-lg border border-white/5 mr-4">
      <button
        onClick={() => setViewMode("grid")}
        className={`p-1.5 rounded transition-all ${viewMode === "grid" ? "bg-white/10 text-white shadow-lg" : "text-discord-text-muted hover:text-white"}`}
        title="Grid View"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`p-1.5 rounded transition-all ${viewMode === "list" ? "bg-white/10 text-white shadow-lg" : "text-discord-text-muted hover:text-white"}`}
        title="List View"
      >
        <ListIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-14 flex items-center px-4 justify-between shrink-0">
      <div className="flex-1 max-w-2xl mr-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-discord-text-muted" />
          <input
            type="text"
            placeholder="Search files and folders..."
            className="w-full bg-discord-bg-tertiary text-white text-[14px] rounded-full pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-discord-blurple border border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <ViewToggle />
        <div className="flex items-center gap-2 text-discord-text-muted mr-2">
          <Link href="/drive/activity" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
        </div>
        <UserProfileBar username={session?.username} />
      </div>
    </header>
  );
}
