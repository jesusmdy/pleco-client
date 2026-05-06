import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pleco - Secure File Storage",
  description: "Securely store and share your files.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --md-primary: #e2e48c;
            --md-on-primary: #252e00;
            --md-primary-container: #4b4c04;
            --md-on-primary-container: #e2e48c;
            --md-background: #0a1100;
            --md-on-background: #e4e3d6;
            --md-surface: #0a1100;
            --md-on-surface: #e4e3d6;
            --md-surface-container-low: #151c0a;
            --md-surface-container: #1b2312;
            --md-surface-container-high: #262d1c;
            --md-surface-container-highest: #313826;
            --md-outline-variant: #47483b;
            --md-primary-rgb: 226, 228, 140;

            /* Override Tailwind generated variables to be safe */
            --color-md-primary: var(--md-primary) !important;
            --color-md-primary-container: var(--md-primary-container) !important;
            --color-md-background: var(--md-background) !important;
            --color-md-surface-container-low: var(--md-surface-container-low) !important;
          }
          body {
            background-color: var(--md-background) !important;
            color: var(--md-on-background) !important;
            font-family: var(--font-outfit), sans-serif !important;
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
