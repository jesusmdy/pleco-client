"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export function SignInForm() {
  const router = useRouter();
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/mfa/verify`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tempToken}`
          },
          body: JSON.stringify({ code: mfaCode }),
        });

        if (!res.ok) {
          setError("Invalid verification code");
          setIsLoading(false);
          return;
        }

        const data = await res.json();
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
      } catch (err) {
        setError("An unexpected error occurred during verification");
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }

      const data = await res.json();

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
          router.push("/fm/drive");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        {!isMfaRequired ? (
          <>
            <Input
              label="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <div className="flex flex-col gap-2">
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            <div className="flex justify-end">
              <button type="button" className="text-[12px] text-figma-blue hover:text-figma-blue/80 font-medium transition-colors">
                Forgot password?
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded-lg bg-figma-blue/5 border border-figma-blue/20">
            <p className="text-[12px] text-figma-blue leading-relaxed text-center">
              MFA is enabled on your account. Please enter the code from your authenticator app.
            </p>
          </div>
          <Input
            label="Verification Code"
            required
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="000000"
            autoFocus
          />
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-[12px] font-medium text-center">
            {error}
          </p>
        </div>
      )}

      <Button 
        type="submit" 
        variant="primary" 
        isLoading={isLoading} 
        className="w-full h-11 bg-figma-blue hover:bg-figma-blue/90 text-white font-bold rounded-lg shadow-[0_8px_16px_rgba(24,160,251,0.2)] transition-all"
      >
        {isMfaRequired ? "Verify Identity" : "Sign In"}
      </Button>

      <div className="mt-2 text-center">
        <p className="text-[13px] text-figma-text-muted">
          New here?{" "}
          <Link
            href="/auth/sign-up"
            className="text-figma-blue hover:underline font-bold"
          >
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
}
