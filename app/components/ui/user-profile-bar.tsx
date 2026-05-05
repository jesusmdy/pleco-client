import Link from "next/link";

interface UserProfileBarProps {
  username?: string | null;
}

export function UserProfileBar({ username }: UserProfileBarProps) {
  const initial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 rounded-full bg-discord-red flex items-center justify-center text-white font-bold text-[14px] shrink-0 shadow-sm">
        {initial}
      </div>
    </Link>
  );
}
