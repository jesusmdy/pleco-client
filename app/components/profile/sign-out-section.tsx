"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Modal } from "@/app/components/ui/modal";

export function SignOutSection() {
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/sign-in" });
  };

  return (
    <>
      <button
        onClick={() => setIsSignOutOpen(true)}
        className="flex items-center gap-2 text-figma-text-muted text-[12px] font-bold uppercase tracking-wider transition-all rounded hover:text-figma-red cursor-pointer group"
      >
        <LogOut className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        Sign out of this device
      </button>

      <Modal
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
        title="Confirm Sign Out"
      >
        <p className="text-figma-text-muted text-[13px] mb-6 leading-relaxed">
          Are you sure you want to sign out of this device? You will need to log in again to access your drive.
        </p>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            onClick={() => setIsSignOutOpen(false)} 
            className="bg-transparent hover:bg-white/5 text-figma-text-muted hover:text-white h-8 text-[12px] font-bold uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSignOut}
            className="bg-figma-red hover:bg-figma-red/90 text-white h-8 text-[12px] font-bold uppercase tracking-wider px-4"
          >
            Sign Out
          </Button>
        </div>
      </Modal>
    </>
  );
}
