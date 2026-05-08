"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { signIn as apiSignIn, verifyMfa as apiVerifyMfa } from "@/app/lib/auth";
import { deriveKey } from "@/app/lib/crypto";
import { useCryptoStore } from "@/app/store/useCryptoStore";

export function SignInForm() {
  const router = useRouter();
  const setMasterKey = useCryptoStore(state => state.setMasterKey);
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isMfaRequired) {
      if (!mfaCode) {
        setError("Please enter the verification code");
        return;
      }
      setIsLoading(true);
      try {
        const data = await apiVerifyMfa(mfaCode, tempToken);

        const result = await signIn("credentials", {
          mfaToken: data.token,
          mfaUser: JSON.stringify(data),
          redirect: false,
        });

        if (result?.error) {
          setError("Session expired, please try again");
        } else {
          router.push("/fm/drive");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred during verification");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiSignIn({ username, password });

      if (data.status === "MFA_REQUIRED") {
        setIsMfaRequired(true);
        setTempToken(data.token);
      } else {
        const result = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Failed to initialize session");
        } else {
          // Derive and set master key
          // We normalize the username to lowercase to prevent case-sensitivity issues with the salt
          const key = await deriveKey(password, username.toLowerCase()); 
          await setMasterKey(key);
          router.push("/fm/drive");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
      {!isMfaRequired ? (
        <>
          <Input
            label="Account Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <div className="flex flex-col gap-3">
            <Input
              label="Account Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <div className="flex justify-end px-1">
              <button type="button" className="text-[13px] text-md-primary hover:text-md-on-surface font-semibold tracking-tight transition-all">
                Forgot password?
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-[24px] bg-md-primary-container/20 border border-md-primary/10">
            <p className="text-[14px] text-md-on-primary-container leading-relaxed text-center font-medium">
              Multi-Factor Authentication is active. Please enter the verification code from your device.
            </p>
          </div>
          <Input
            label="Security Code"
            required
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="000 000"
            autoFocus
            className="text-center text-xl tracking-[0.4em] font-bold"
          />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-md-error/10 border border-md-error/20 animate-in shake duration-300">
          <p className="text-md-error text-[13px] font-bold text-center uppercase tracking-wider">
            {error}
          </p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full h-12 bg-md-primary text-md-on-primary font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-[15px] tracking-tight border border-md-primary/10"
      >
        {isMfaRequired ? "Confirm Identity" : "Access Workspace"}
      </Button>

      <div className="mt-2 text-center">
        <p className="text-[14px] text-md-on-surface-variant font-medium">
          New to Pleco?{" "}
          <Link
            href="/auth/sign-up"
            className="text-md-primary hover:underline font-semibold tracking-tight ml-1"
          >
            Create Workspace
          </Link>
        </p>
      </div>
    </form>
  );
}
