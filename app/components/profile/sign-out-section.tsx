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
      <div>
        <button
          onClick={() => setIsSignOutOpen(true)}
          className="flex items-center gap-2 text-discord-red font-medium transition-all text-left rounded group hover:text-discord-red/80 hover:underline cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign out of this device
        </button>
      </div>

      <Modal
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
        title="Confirm Sign Out"
      >
        <p className="text-discord-text-primary text-[15px] mb-6 leading-relaxed">
          Are you sure you want to sign out of this device? You will need to log in again to access your drive.
        </p>

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={() => setIsSignOutOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSignOut}
            className="bg-discord-red hover:bg-discord-red/80 text-white shadow-sm"
          >
            Sign Out
          </Button>
        </div>
      </Modal>
    </>
  );
}
