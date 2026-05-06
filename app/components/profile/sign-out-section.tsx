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
        className="flex items-center gap-3 text-md-on-surface-variant text-[13px] font-bold uppercase tracking-widest transition-all rounded-lg hover:text-md-error cursor-pointer group px-2 py-1"
      >
        <LogOut className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
        Sign out of this device
      </button>

      <Modal
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
        title="Confirm Sign Out"
      >
        <p className="text-md-on-surface-variant text-[15px] mb-8 leading-relaxed font-medium">
          Are you sure you want to sign out of this device? You will need to log in again to access your drive.
        </p>

        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => setIsSignOutOpen(false)} 
            className="h-10 text-[14px] font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSignOut}
            className="bg-md-error text-md-on-error hover:bg-md-error/90 h-10 text-[14px] font-bold px-6 shadow-lg shadow-md-error/20"
          >
            Sign Out
          </Button>
        </div>
      </Modal>
    </>
  );
}
