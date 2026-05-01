import { HardDrive } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { signOut } from "next-auth/react";

export function Header() {
  return (
    <header className="h-12 shadow-sm border-b border-black/10 flex items-center px-4 justify-between bg-discord-bg-primary">
      <div className="flex items-center gap-2 text-discord-text-muted">
        <HardDrive className="w-5 h-5" />
        <h2 className="font-bold text-white">My Drive</h2>
      </div>
      <div className="md:hidden">
        <Button 
          variant="link" 
          onClick={() => signOut({ callbackUrl: "/auth/sign-in" })} 
          className="text-discord-red"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
