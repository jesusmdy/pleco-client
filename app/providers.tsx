"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import { SettingsProvider } from "./components/providers/settings-provider";

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
        <SettingsProvider>
          {children}
        </SettingsProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: "bg-md-surface-container-highest text-md-on-surface border border-md-outline-variant/10 rounded-2xl text-[13px] font-medium shadow-md",
            style: {
              background: 'var(--md-surface-container-highest)',
              color: 'var(--md-on-surface)',
              borderRadius: '16px',
              border: '1px solid var(--md-outline-variant)',
            }
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
