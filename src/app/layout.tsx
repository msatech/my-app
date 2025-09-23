import "./globals.css";
import "@/styles/themes.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Multi-Client App",
  description: "Mars & Santender themed routing",
};

import AuthProvider from "@/providers/SessionProvider";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}