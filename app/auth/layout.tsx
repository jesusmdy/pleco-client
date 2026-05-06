"use client";

import React from "react";
import { HardDrive } from "lucide-react";
import { AuthGuard } from "@/app/components/auth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard isAuth={false}>
      <div className="flex items-center justify-center min-h-screen bg-figma-dark relative overflow-hidden">
        {/* Premium Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        
        {/* Subtle Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-figma-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-figma-blue/5 rounded-full blur-[120px]" />
        
        <div className="z-10 w-full max-w-[420px] mx-4">
          <div className="bg-figma-bg border border-white/5 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-10 flex flex-col items-center relative overflow-hidden">
            {/* Header / Logo */}
            <div className="flex flex-col items-center mb-10 gap-3">
              <div className="w-14 h-14 bg-figma-blue rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(24,160,251,0.3)]">
                <HardDrive className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white tracking-tight">Pleco Drive</h1>
                <p className="text-[13px] text-figma-text-muted mt-1">Your space, secured.</p>
              </div>
            </div>
            
            <div className="w-full">
              {children}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[11px] text-figma-text-muted/50 uppercase tracking-[0.2em] font-bold">
              Powered by Pleco Cloud
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
