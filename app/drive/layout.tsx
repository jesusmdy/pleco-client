"use client";

import { AuthGuard } from "@/app/components/auth-guard";

export default function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard isAuth={true}>{children}</AuthGuard>;
}
