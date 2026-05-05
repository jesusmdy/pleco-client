"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
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
        // Now fully sign in with the final token
        const result = await signIn("credentials", {
          mfaToken: data.token,
          mfaUser: JSON.stringify(data),
          redirect: false,
        });

        if (result?.error) {
          setError("Session expired, please try again");
        } else {
          router.push("/drive");
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
        // Normal login
        const result = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Failed to initialize session");
        } else {
          router.push("/drive");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
      <p className="text-discord-text-muted text-[16px] mb-6 text-center">
        Sign in to access your secure drive.
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {!isMfaRequired ? (
          <>
            <Input
              label="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <div className="flex flex-col gap-1">
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button variant="link" type="button" className="w-fit mt-1">
                Forgot your password?
              </Button>
            </div>
          </>
        ) : (
          <Input
            label="MFA Verification Code"
            required
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="Enter 6-digit code"
            autoFocus
          />
        )}

        {error && (
          <p className="text-discord-text-danger text-[14px] font-medium">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full h-[44px] rounded-[3px]">
          {isMfaRequired ? "Verify & Log In" : "Log In"}
        </Button>

        <p className="text-[14px] text-discord-text-muted mt-2">
          Need an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-discord-text-link hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
