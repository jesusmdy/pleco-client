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
        className="w-full h-12 bg-md-primary text-md-on-primary font-bold rounded-xl shadow-lg shadow-md-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-[14px] uppercase tracking-widest"
      >
        Initialize Account
      </Button>

      <div className="text-center pt-2">
        <p className="text-[14px] text-md-on-surface-variant font-medium">
          Already a member?{" "}
          <Link
            href="/auth/sign-in"
            className="text-md-primary hover:underline font-bold uppercase tracking-widest ml-1"
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
