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

  if (showCodes) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[#23a559]">
          <div className="w-2 h-2 rounded-full bg-current"></div>
          <span className="font-medium text-lg">MFA Enabled Successfully!</span>
        </div>
        
        <div className="flex flex-col gap-4 p-4 bg-[#23a559]/5 border border-[#23a559]/20 rounded-lg">
          <p className="text-white text-sm font-semibold">Save your backup codes:</p>
          <p className="text-discord-text-muted text-xs">
            These codes can be used to access your account if you lose your phone. 
            Store them in a secure place like a password manager. Each code can only be used once.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {scratchCodes.map((code, index) => (
              <code key={index} className="bg-discord-bg-tertiary p-2 rounded text-center font-mono text-sm text-white border border-white/5">
                {code}
              </code>
            ))}
          </div>
        </div>

        <Button onClick={() => { setShowCodes(false); setIsSettingUp(false); onRefresh(); }} variant="primary">
          I've saved these codes
        </Button>
      </div>
    );
  }

  if (mfaEnabled) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[#23a559]">
          <div className="w-2 h-2 rounded-full bg-current"></div>
          <span className="font-medium">MFA is enabled</span>
        </div>
        <p className="text-discord-text-muted text-sm">
          Your account is protected with two-factor authentication.
        </p>
      </div>
    );
  }

  if (isSettingUp) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg">
          <QRCodeSVG value={qrCodeData} size={200} />
        </div>
        
        <div className="flex flex-col gap-2">
          <p className="text-white text-sm font-medium">1. Scan the QR code or enter the secret manually:</p>
          <code className="bg-discord-bg-tertiary p-2 rounded text-discord-blurple text-xs break-all uppercase">
            {secret}
          </code>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-white text-sm font-medium">2. Enter the 6-digit code from your app:</p>
          <Input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
          />
          {error && <p className="text-discord-text-danger text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={handleVerify} isLoading={isLoading} variant="primary" className="flex-1">
              Verify & Enable
            </Button>
            <Button onClick={() => setIsSettingUp(false)} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-discord-text-muted text-sm">
        Add an extra layer of security to your account by enabling two-factor authentication.
      </p>
      {error && <p className="text-discord-text-danger text-sm">{error}</p>}
      <Button onClick={handleStartSetup} isLoading={isLoading} variant="primary">
        Enable MFA
      </Button>
    </div>
  );
}
