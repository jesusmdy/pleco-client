"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e1e1e',
              color: '#ffffff',
              fontSize: '13px',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
