"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/app/lib/api";
import { DiscordInput } from "@/app/components/ui/discord-input";
import { DiscordButton } from "@/app/components/ui/discord-button";
import Link from "next/link";

export default function SignUpPage() {
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
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-6">Create an account</h2>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <DiscordInput
          label="Email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <DiscordInput
          label="Username"
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />

        <DiscordInput
          label="Password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        {error && (
          <p className="text-discord-text-danger text-[14px] font-medium">
            {error}
          </p>
        )}

        <div className="mt-2">
          <DiscordButton type="submit" isLoading={mutation.isPending}>
            Continue
          </DiscordButton>
        </div>

        <Link
          href="/auth/sign-in"
          className="text-discord-text-link text-[14px] hover:underline mt-2"
        >
          Already have an account?
        </Link>

        <p className="text-[12px] text-discord-text-muted mt-2 leading-relaxed">
          By registering, you agree to Pleco&apos;s{" "}
          <span className="text-discord-text-link cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-discord-text-link cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </form>
    </div>
  );
}
