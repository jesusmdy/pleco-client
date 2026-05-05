import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getRecentFiles } from "@/app/lib/drive";

export function useRecentFiles() {
  const { data: session } = useSession();
  const token = (session as any)?.backendToken;

  return useQuery({
    queryKey: ["recentFiles"],
    queryFn: () => getRecentFiles(token!),
    enabled: !!token,
  });
}
