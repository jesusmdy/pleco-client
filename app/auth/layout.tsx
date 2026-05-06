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
      <div className="flex items-center justify-center min-h-screen bg-md-background relative overflow-hidden">
        {/* Premium Grid Background */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        
        {/* Subtle Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-md-primary/10 rounded-full blur-[140px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-md-secondary/5 rounded-full blur-[140px] animate-pulse duration-[15s]" />
        
        <div className="z-10 w-full max-w-[460px] mx-4">
          <div className="bg-md-surface-container border border-md-outline-variant/10 rounded-[32px] shadow-sm p-12 flex flex-col items-center relative overflow-hidden">
            {/* Header / Logo */}
            <div className="flex flex-col items-center mb-12 gap-5">
              <div className="w-16 h-16 bg-md-primary rounded-[22px] flex items-center justify-center shadow-sm border border-md-primary/10 transform hover:rotate-3 transition-transform">
                <HardDrive className="w-8 h-8 text-md-on-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-md-on-surface tracking-tighter">Pleco Drive</h1>
                <p className="text-[15px] text-md-on-surface-variant mt-2 font-medium">Your professional space, secured.</p>
              </div>
            </div>
            
            <div className="w-full">
              {children}
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[12px] text-md-on-surface-variant/40 uppercase tracking-[0.3em] font-bold">
              Integrated with Pleco Cloud Ecosystem
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
