import "./globals.css";
import "@/styles/themes.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Multi-Client App",
  description: "Mars & Santender themed routing",
};

import OktaProvider from "@/providers/OktaProvider";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <OktaProvider>{children}</OktaProvider>
      </body>
    </html>
  );
}