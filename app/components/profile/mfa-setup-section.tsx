"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useSession } from "next-auth/react";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/mfa/setup`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.backendToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to start MFA setup");

      const data = await res.json();
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/mfa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.backendToken}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid verification code");
      }

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
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/mfa/disable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.backendToken}`,
        },
        body: JSON.stringify(data),
      });
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
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2 text-figma-blue">
          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
          <span className="font-bold text-[14px]">MFA Enabled Successfully</span>
        </div>
        
        <div className="space-y-3 p-4 bg-figma-blue/5 border border-figma-blue/20 rounded-xl">
          <p className="text-white text-[13px] font-bold">Important: Save backup codes</p>
          <p className="text-figma-text-muted text-[12px] leading-relaxed">
            These codes are the only way to access your account if you lose your authenticator. Store them securely.
          </p>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {scratchCodes.map((code, index) => (
              <code key={index} className="bg-figma-bg p-2 rounded-md text-center font-mono text-[11px] text-white border border-white/5 select-all">
                {code}
              </code>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => { setShowCodes(false); setIsSettingUp(false); onRefresh(); }} 
          className="w-full bg-figma-blue hover:bg-figma-blue/90 text-white h-8 text-[12px] font-bold uppercase tracking-wider"
        >
          I've saved these codes
        </Button>
      </div>
    );
  }

  if (mfaEnabled) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-figma-blue">
          <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_rgba(24,160,251,0.4)]"></div>
          <span className="font-bold text-[13px]">MFA Protection Active</span>
        </div>

        <form onSubmit={handleDisableMfa} className="pt-5 space-y-4 border-t border-white/5">
          <div className="space-y-3">
            <Input 
              label="Confirm Password"
              name="password"
              type="password" 
              required
              className="bg-figma-bg border-white/5 h-9 text-[13px]"
            />
            <Input 
              label="Current TOTP Code"
              name="totpCode"
              type="text" 
              maxLength={6}
              required
              className="bg-figma-bg border-white/5 h-9 text-[13px]"
            />
          </div>
          {error && <p className="text-figma-red text-[12px] font-medium">{error}</p>}
          <Button 
            type="submit"
            isLoading={isLoading}
            className="w-full bg-transparent hover:bg-figma-red/10 text-figma-red border border-figma-red/20 h-8 text-[11px] font-bold uppercase tracking-wider"
          >
            Disable 2FA
          </Button>
        </form>
      </div>
    );
  }

  if (isSettingUp) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-xl shadow-xl">
          <QRCodeSVG value={qrCodeData} size={160} />
        </div>
        
        <div className="space-y-2">
          <span className="text-figma-text-muted text-[10px] font-bold uppercase tracking-wider">Manual Setup Key</span>
          <code className="block bg-figma-bg p-2.5 rounded-lg text-figma-blue text-[11px] font-mono break-all uppercase border border-white/5 text-center tracking-widest">
            {secret}
          </code>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <Input
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="000 000"
            maxLength={6}
            className="bg-figma-bg border-white/5 h-9 text-center text-lg tracking-[0.5em]"
          />
          {error && <p className="text-figma-red text-[12px] font-medium">{error}</p>}
          <div className="flex gap-2">
            <Button 
              onClick={handleVerify} 
              isLoading={isLoading} 
              className="flex-1 bg-figma-blue hover:bg-figma-blue/90 text-white h-8 text-[12px] font-bold uppercase tracking-wider"
            >
              Verify & Enable
            </Button>
            <Button 
              onClick={() => setIsSettingUp(false)} 
              className="bg-transparent hover:bg-white/5 text-figma-text-muted hover:text-white h-8 text-[12px] font-bold uppercase tracking-wider px-4"
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
      {error && <p className="text-figma-red text-[12px] font-medium">{error}</p>}
      <Button 
        onClick={handleStartSetup} 
        isLoading={isLoading} 
        className="w-full bg-figma-blue hover:bg-figma-blue/90 text-white h-8 text-[12px] font-bold uppercase tracking-wider shadow-lg shadow-figma-blue/10"
      >
        Configure Two-Factor
      </Button>
    </div>
  );
}
