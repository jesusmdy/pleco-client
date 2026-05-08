"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/app/lib/auth";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { generateRecoveryPhrase } from "@/app/lib/crypto";
import { ShieldCheck, Copy, Check } from "lucide-react";

export function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: any) => signUp(data),
    onSuccess: () => {
      router.push("/auth/sign-in");
    },
    onError: (err: any) => {
      setError(err.message || "Something went wrong during registration");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    
    if (!showRecovery) {
      setRecoveryPhrase(generateRecoveryPhrase());
      setShowRecovery(true);
      return;
    }

    mutation.mutate(formData);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recoveryPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      {!showRecovery ? (
        <>
          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <Input
            label="Username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 rounded-[24px] bg-md-primary/5 border border-md-primary/10 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-md-primary/10 flex items-center justify-center text-md-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-[16px] font-bold text-md-on-surface tracking-tight">Security Recovery Seed</h3>
              <p className="text-[13px] text-md-on-surface-variant mt-1 font-medium">
                This is the ONLY way to recover your files if you forget your password. Write it down and keep it safe.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 w-full mt-2">
              {recoveryPhrase.split(" ").map((word, i) => (
                <div key={i} className="bg-md-surface-container-high px-3 py-2 rounded-xl border border-md-outline-variant/10 text-center">
                  <span className="text-[10px] text-md-on-surface-variant/50 font-bold block uppercase tracking-tighter">#{i + 1}</span>
                  <span className="text-[13px] font-bold text-md-on-surface-variant tracking-tight">{word}</span>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={copyToClipboard}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-md-primary/10 text-md-primary text-[12px] font-bold hover:bg-md-primary/20 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied to clipboard" : "Copy recovery phrase"}
            </button>
          </div>
          
          <div className="flex items-start gap-3 px-2">
            <input 
              type="checkbox" 
              id="ack" 
              required 
              className="mt-1 w-4 h-4 rounded border-md-outline-variant text-md-primary focus:ring-md-primary" 
            />
            <label htmlFor="ack" className="text-[13px] text-md-on-surface-variant font-medium leading-relaxed">
              I have safely stored my recovery phrase. I understand that Pleco cannot recover my account without it.
            </label>
          </div>
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
        isLoading={mutation.isPending} 
        className="w-full h-12 bg-md-primary text-md-on-primary font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-[15px] tracking-tight border border-md-primary/10"
      >
        {showRecovery ? "Complete Initialization" : "Initialize Account"}
      </Button>

      <div className="text-center pt-2">
        <p className="text-[14px] text-md-on-surface-variant font-medium">
          Already a member?{" "}
          <Link
            href="/auth/sign-in"
            className="text-md-primary hover:underline font-semibold tracking-tight ml-1"
          >
            Sign In
          </Link>
        </p>
      </div>

      <p className="text-[12px] text-md-on-surface-variant/50 mt-6 leading-relaxed text-center font-medium">
        By registering, you agree to Pleco Drive&apos;s{" "}
        <button type="button" className="text-md-on-surface-variant hover:text-md-on-surface transition-colors underline decoration-md-outline-variant/30">
          Terms of Service
        </button>{" "}
        and{" "}
        <button type="button" className="text-md-on-surface-variant hover:text-md-on-surface transition-colors underline decoration-md-outline-variant/30">
          Privacy Policy
        </button>
        .
      </p>
    </form>
  );
}
