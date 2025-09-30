"use client";

import { useOktaAuth } from "@okta/okta-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SantenderPage() {
  const { authState } = useOktaAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState && !authState.isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authState, router]);

  if (!authState || !authState.isAuthenticated) {
    return <p>Loading secure page...</p>;
  }

  return <h1 className="text-2xl font-bold">Santender Dashboard</h1>;
}
