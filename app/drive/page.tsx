"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/api";
import { useSession, signOut } from "next-auth/react";
import { DiscordButton } from "@/app/components/ui/discord-button";
import { HardDrive, LogOut, User } from "lucide-react";

export default function DrivePage() {
  const { data: session } = useSession();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(session!.backendToken),
    enabled: !!session?.backendToken,
    retry: false,
  });

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/sign-in" });
  };

  return (
    <div className="flex min-h-screen bg-discord-bg-primary">
      {/* Sidebar - Side Drawer Style */}
      <div className="w-[240px] bg-discord-bg-secondary flex flex-col hidden md:flex border-r border-black/10">
        <div className="p-4 h-12 shadow-sm flex items-center border-b border-black/10">
          <h1 className="font-bold text-white truncate">Pleco Storage</h1>
        </div>

        <div className="flex-1 p-2 flex flex-col gap-1 mt-2">
          <div className="bg-discord-bg-modal/50 rounded p-2 flex items-center gap-3 text-white">
            <HardDrive className="w-5 h-5 text-discord-text-muted" />
            <span className="font-medium text-[15px]">My Drive</span>
          </div>
        </div>

        {/* User Profile Bar at Bottom */}
        <div className="bg-discord-bg-tertiary/50 p-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-white shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-white truncate leading-none">
                {session?.username || "User"}
              </span>
              <span className="text-[12px] text-discord-text-muted truncate">
                Online
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-white/10 rounded text-discord-text-muted hover:text-discord-red transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-discord-bg-primary overflow-hidden">
        <header className="h-12 shadow-sm border-b border-black/10 flex items-center px-4 justify-between bg-discord-bg-primary">
          <div className="flex items-center gap-2 text-discord-text-muted">
            <HardDrive className="w-5 h-5" />
            <h2 className="font-bold text-white">My Drive</h2>
          </div>
          <div className="md:hidden">
            <DiscordButton variant="link" onClick={handleLogout} className="text-discord-red">
              Logout
            </DiscordButton>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-discord-text-muted">
              <div className="w-10 h-10 border-4 border-white/10 border-t-discord-blurple rounded-full animate-spin" />
              <p>Fetching your files...</p>
            </div>
          ) : error ? (
            <div className="bg-discord-red/10 border border-discord-red/20 rounded p-4 text-discord-text-danger max-w-md mx-auto mt-10">
              <p className="font-bold mb-1">Failed to load profile</p>
              <p className="text-[14px]">{(error as Error).message}</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {profile?.username || session?.username}!
                </h3>
                <p className="text-discord-text-muted">
                  All your encrypted files are safe and accessible.
                </p>
              </div>

              {/* Placeholder for file list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-discord-bg-secondary border border-transparent hover:border-discord-blurple/30 rounded-lg p-4 cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 bg-discord-bg-tertiary rounded flex items-center justify-center mb-3 text-discord-text-muted group-hover:text-discord-blurple transition-colors">
                      <HardDrive className="w-6 h-6" />
                    </div>
                    <p className="text-white font-medium truncate mb-1">Encrypted_File_{i}.dat</p>
                    <p className="text-discord-text-muted text-[12px]">Updated 2 hours ago • 1.2 MB</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
