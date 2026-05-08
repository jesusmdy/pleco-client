import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getRecentFiles } from "@/app/lib/drive";
import { useDecryptedItems } from "./useDecryptedItems";

export function useRecentFiles() {
  const { data: session } = useSession();
  const token = (session as any)?.backendToken;

  const query = useQuery({
    queryKey: ["recentFiles"],
    queryFn: () => getRecentFiles(token!),
    enabled: !!token,
  });

  const decryptedData = useDecryptedItems(query.data);

  return { ...query, data: decryptedData };
}
