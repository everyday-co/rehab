import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fix & Flip Tracker",
  description: "Professional rehab estimation and project tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "min-h-screen bg-background font-sans text-foreground antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
