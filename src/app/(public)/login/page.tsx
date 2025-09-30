"use client";

import { useOktaAuth } from "@okta/okta-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { oktaAuth, authState } = useOktaAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState?.isAuthenticated) {
      router.replace("/choose-client"); // already logged in
    } else if (authState && !authState.isAuthenticated) {
      oktaAuth.signInWithRedirect(); // auto-trigger Okta login
    }
  }, [authState, oktaAuth, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-600 to-red-800 text-white">
      <p className="text-lg">Redirecting to secure Okta login...</p>
    </div>
  );
}
