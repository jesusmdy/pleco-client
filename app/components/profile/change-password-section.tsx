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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <Input 
          label="Current Password"
          name="oldPassword"
          type="password" 
          placeholder="••••••••"
          required
        />
        <Input 
          label="New Password"
          name="newPassword"
          type="password" 
          placeholder="Min. 8 characters"
          required
        />
        {mfaEnabled && (
          <Input 
            label="Current TOTP Code"
            name="totpCode"
            type="text" 
            maxLength={6}
            required
            placeholder="000 000"
          />
        )}
      </div>

      {pwStatus && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 border text-[14px] font-semibold transition-all animate-in fade-in slide-in-from-top-1 duration-300",
          pwStatus.type === 'success' 
            ? 'bg-md-primary/10 text-md-primary border-md-primary/20' 
            : 'bg-md-error/10 text-md-error border-md-error/20'
        )}>
          {pwStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="leading-tight tracking-tight">{pwStatus.msg}</span>
        </div>
      )}

      <div className="pt-2">
        <Button 
          type="submit"
          isLoading={pwLoading}
          className="w-full bg-md-primary text-md-on-primary h-12 text-[15px] font-semibold tracking-tight rounded-full border border-md-primary/10 hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          Update account password
        </Button>
      </div>
    </form>
  );
}
