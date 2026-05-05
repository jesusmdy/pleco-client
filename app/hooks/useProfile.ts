import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getProfile } from "@/app/lib/user";

export function useProfile() {
  const { data: session } = useSession();
  const token = (session as any)?.backendToken;

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getProfile(token!),
    enabled: !!token,
  });
}
