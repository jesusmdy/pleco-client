"use client";

import { useState } from "react";
import { Key, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { changePassword } from "@/app/lib/user";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface ChangePasswordSectionProps {
  token: string;
  mfaEnabled: boolean;
}

export function ChangePasswordSection({ token, mfaEnabled }: ChangePasswordSectionProps) {
  const [pwLoading, setPwLoading] = useState(false);
  const [pwStatus, setPwStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwLoading(true);
    setPwStatus(null);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      await changePassword(data, token);
      setPwStatus({ type: 'success', msg: "Password updated successfully!" });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setPwStatus({ type: 'error', msg: err.message || "Failed to update password" });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <Input 
          label="Current Password"
          name="oldPassword"
          type="password" 
          required
          className="bg-figma-bg border-white/5 h-9 text-[13px]"
        />
        <Input 
          label="New Password"
          name="newPassword"
          type="password" 
          required
          className="bg-figma-bg border-white/5 h-9 text-[13px]"
        />
        {mfaEnabled && (
          <Input 
            label="Current TOTP Code"
            name="totpCode"
            type="text" 
            maxLength={6}
            required
            className="bg-figma-bg border-white/5 h-9 text-[13px]"
          />
        )}
      </div>

      {pwStatus && (
        <div className={cn(
          "p-2.5 rounded-lg flex items-center gap-2 border text-[12px] font-medium transition-all",
          pwStatus.type === 'success' 
            ? 'bg-figma-blue/10 text-figma-blue border-figma-blue/20' 
            : 'bg-figma-red/10 text-figma-red border-figma-red/20'
        )}>
          {pwStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="leading-tight">{pwStatus.msg}</span>
        </div>
      )}

      <div className="pt-2">
        <Button 
          type="submit"
          isLoading={pwLoading}
          className="w-full bg-figma-blue hover:bg-figma-blue/90 text-white h-8 text-[12px] font-bold uppercase tracking-wider shadow-lg shadow-figma-blue/10"
        >
          Update Password
        </Button>
      </div>
    </form>
  );
}
