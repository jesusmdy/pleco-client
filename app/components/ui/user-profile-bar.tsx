import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface UserProfileBarProps {
  username?: string | null;
}

export function UserProfileBar({ username }: UserProfileBarProps) {
  return (
    <div className="bg-discord-bg-tertiary/50 p-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-white shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[14px] font-bold text-white truncate leading-none">
            {username || "User"}
          </span>
          <span className="text-[12px] text-discord-text-muted truncate">
            Online
          </span>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
        className="p-1.5 hover:bg-white/10 rounded text-discord-text-muted hover:text-discord-red transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
