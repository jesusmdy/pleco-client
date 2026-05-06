"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader } from "@/app/components/ui/loader";

interface AuthGuardProps {
  children: React.ReactNode;
  isAuth: boolean;
}

export function AuthGuard({ children, isAuth }: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (isAuth && status === "unauthenticated") {
      router.replace("/auth/sign-in");
    }

    if (!isAuth && status === "authenticated") {
      router.replace("/fm/drive");
    }
  }, [status, isAuth, router]);

  // Show spinner while session is resolving
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-md-background">
        <Loader size="lg" label="Synchronizing Workspace" />
      </div>
    );
  }

  // Block render until redirect fires
  if (isAuth && status !== "authenticated") return null;
  if (!isAuth && status !== "unauthenticated") return null;

  return <>{children}</>;
}
