"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/app/lib/auth";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

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
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
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
        isLoading={mutation.isPending} 
        className="w-full h-11 bg-figma-blue hover:bg-figma-blue/90 text-white font-bold rounded-lg shadow-[0_8px_16px_rgba(24,160,251,0.2)] transition-all"
      >
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-[13px] text-figma-text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-figma-blue hover:underline font-bold"
          >
            Sign In
          </Link>
        </p>
      </div>

      <p className="text-[11px] text-figma-text-muted/60 mt-4 leading-relaxed text-center">
        By registering, you agree to Pleco Drive&apos;s{" "}
        <button type="button" className="text-figma-text-muted hover:text-white transition-colors underline decoration-white/20">
          Terms of Service
        </button>{" "}
        and{" "}
        <button type="button" className="text-figma-text-muted hover:text-white transition-colors underline decoration-white/20">
          Privacy Policy
        </button>
        .
      </p>
    </form>
  );
}
