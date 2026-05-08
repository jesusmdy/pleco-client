"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Modal } from "@/app/components/ui/modal";
import { useCryptoStore } from "@/app/store/useCryptoStore";

export function SignOutSection() {
  const setMasterKey = useCryptoStore(state => state.setMasterKey);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  const handleSignOut = async () => {
    // 1. Thorough LocalStorage Cleanup
    const keysToClear = [
      "pleco-upload-activity",
      "pleco_token",
      "pleco-token",
      "pleco_username",
      "pleco-username",
      "view-mode-storage",
      "view-preferences-storage"
    ];
    keysToClear.forEach(key => localStorage.removeItem(key));
    
    // 2. SessionStorage Cleanup (Master Key)
    sessionStorage.removeItem("pleco_master_key");

    // 3. In-memory store cleanup
    await setMasterKey(null);

    // 4. Redirect to Sign-in
    signOut({ callbackUrl: "/auth/sign-in" });
  };

  return (
    <>
      <button
        onClick={() => setIsSignOutOpen(true)}
        className="flex items-center gap-4 text-md-on-surface-variant text-[14px] font-semibold tracking-tight transition-all rounded-full hover:text-md-error cursor-pointer group px-4 py-2 hover:bg-md-error/5"
      >
        <LogOut className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
        Sign out of this device
      </button>

      <Modal
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
        title="Confirm sign out"
      >
        <p className="text-md-on-surface-variant text-[15px] mb-8 leading-relaxed font-medium">
          Are you sure you want to sign out of this device? You will need to log in again to access your drive.
        </p>

        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => setIsSignOutOpen(false)} 
            className="h-10 text-[14px] font-semibold rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSignOut}
            className="bg-md-error text-md-on-error hover:bg-md-error/90 h-10 text-[14px] font-semibold tracking-tight px-8 rounded-full border border-md-error/10 transition-all active:scale-95"
          >
            Sign out
          </Button>
        </div>
      </Modal>
    </>
  );
}
