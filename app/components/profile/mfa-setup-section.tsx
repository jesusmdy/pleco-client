"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useSession } from "next-auth/react";
import { setupMfa, verifyMfa } from "@/app/lib/auth";
import { disableMfa } from "@/app/lib/user";

interface MfaSetupSectionProps {
  mfaEnabled: boolean;
  onRefresh: () => void;
}

export function MfaSetupSection({ mfaEnabled, onRefresh }: MfaSetupSectionProps) {
  const { data: session } = useSession();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scratchCodes, setScratchCodes] = useState<string[]>([]);
  const [showCodes, setShowCodes] = useState(false);

  const handleStartSetup = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await setupMfa(session!.backendToken);
      setQrCodeData(data.qrCodeData);
      setSecret(data.secret);
      setIsSettingUp(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await verifyMfa(verificationCode, session!.backendToken);

      if (data.scratchCodes) {
        setScratchCodes(data.scratchCodes);
        setShowCodes(true);
      } else {
        setIsSettingUp(false);
        onRefresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMfa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await disableMfa(data, session!.backendToken);
      onRefresh();
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Failed to disable MFA");
    } finally {
      setIsLoading(false);
    }
  };

  if (showCodes) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
        <div className="flex items-center gap-3 text-md-primary">
          <div className="w-2 h-2 rounded-full bg-current"></div>
          <span className="font-bold text-[15px] uppercase tracking-wider">MFA Protection Enabled</span>
        </div>
        
        <div className="space-y-4 p-6 bg-md-primary-container/30 border border-md-primary/20 rounded-2xl">
          <p className="text-md-on-surface font-bold text-[14px]">Action Required: Save Backup Codes</p>
          <p className="text-md-on-surface-variant text-[13px] leading-relaxed font-medium">
            These codes are the ONLY way to access your account if you lose your authenticator. Store them in a secure physical or digital location.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {scratchCodes.map((code, index) => (
              <code key={index} className="bg-md-surface-container-highest p-3 rounded-xl text-center font-mono text-[13px] text-md-on-surface border border-md-outline-variant/10 select-all font-bold tracking-widest shadow-sm">
                {code}
              </code>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => { setShowCodes(false); setIsSettingUp(false); onRefresh(); }} 
          className="w-full bg-md-primary text-md-on-primary h-12 text-[15px] font-semibold tracking-tight rounded-xl border border-md-primary/10"
        >
          I have saved these codes
        </Button>
      </div>
    );
  }

  if (mfaEnabled) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-md-primary">
          <div className="w-2 h-2 rounded-full bg-current"></div>
          <span className="font-bold text-[14px] uppercase tracking-widest">Active Protection</span>
        </div>

        <form onSubmit={handleDisableMfa} className="pt-8 space-y-5 border-t border-md-outline-variant/10">
          <div className="space-y-4">
            <Input 
              label="Confirm Identity (Password)"
              name="password"
              type="password" 
              required
            />
            <Input 
              label="Current TOTP Code"
              name="totpCode"
              type="text" 
              maxLength={6}
              required
              placeholder="000 000"
            />
          </div>
          {error && <p className="text-md-error text-[13px] font-bold text-center">{error}</p>}
          <Button 
            type="submit"
            isLoading={isLoading}
            className="w-full bg-md-error/10 hover:bg-md-error text-md-error hover:text-md-on-error border border-md-error/30 h-10 text-[13px] font-semibold tracking-tight rounded-xl transition-all"
          >
            Deactivate 2FA Protection
          </Button>
        </form>
      </div>
    );
  }

  if (isSettingUp) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-6 p-8 bg-md-surface-container-highest rounded-[28px] shadow-xl border border-md-outline-variant/10 mx-auto w-fit">
          <QRCodeSVG value={qrCodeData} size={180} />
          <div className="text-center">
            <p className="text-md-on-surface text-[14px] font-bold">Scan with Authenticator</p>
            <p className="text-md-on-surface-variant text-[12px] font-medium mt-1">Google, Authy, or Ente</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <span className="text-md-on-surface-variant text-[11px] font-bold uppercase tracking-widest px-1">Manual Setup Key</span>
          <code className="block bg-md-surface-container-highest p-4 rounded-2xl text-md-primary text-[14px] font-mono break-all uppercase border border-md-outline-variant/10 text-center tracking-[0.2em] font-bold">
            {secret}
          </code>
        </div>

        <div className="space-y-6 pt-6 border-t border-md-outline-variant/10">
          <Input
            label="Enter Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="000 000"
            maxLength={6}
            className="text-center text-2xl tracking-[0.6em] font-bold h-14"
          />
          {error && <p className="text-md-error text-[13px] font-bold text-center">{error}</p>}
          <div className="flex gap-3">
            <Button 
              onClick={handleVerify} 
              isLoading={isLoading} 
              className="flex-1 bg-md-primary text-md-on-primary h-12 text-[15px] font-semibold tracking-tight rounded-xl border border-md-primary/10"
            >
              Verify & Link
            </Button>
            <Button 
              onClick={() => setIsSettingUp(false)} 
              variant="ghost"
              className="h-12 px-6 font-bold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-md-error text-[13px] font-bold">{error}</p>}
      <Button 
        onClick={handleStartSetup} 
        isLoading={isLoading} 
        className="w-full bg-md-primary text-md-on-primary h-12 text-[15px] font-semibold tracking-tight rounded-xl border border-md-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Configure Two-Factor Auth
      </Button>
    </div>
  );
}
