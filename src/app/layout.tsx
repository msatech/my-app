"use client";

import { oktaAuth } from "@/lib/auth/oktaConfig";
import { Security } from "@okta/okta-react";

import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri?: string) => {
    // Redirect user back to the page they were trying to access, or home
    router.replace(originalUri || "/choose-client");
  };

  return (
    <html lang="en">
      <body>
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
          {children}
        </Security>
      </body>
    </html>
  );
}
