import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getStorageUsage } from "@/app/lib/user";

export function useStorageUsage() {
  const { data: session } = useSession();
  const token = (session as any)?.backendToken;

  return useQuery({
    queryKey: ["storageUsage"],
    queryFn: () => getStorageUsage(token!),
    enabled: !!token,
  });
}
