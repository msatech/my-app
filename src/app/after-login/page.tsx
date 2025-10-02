"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOkta } from "@/providers/OktaProvider";

export default function AfterLogin() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useOkta();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    const clients = user.clients ?? [];
    if (!user.client && clients.length > 1) {
      router.replace("/choose-client");
      return;
    }

    const destination = user.client ?? clients[0];
    if (!destination) {
      router.replace("/login");
      return;
    }

    router.replace(`/${destination}`);
  }, [isAuthenticated, isLoading, router, user]);

  return (
    <div className="text-sm text-muted-foreground">Preparing your experience…</div>
  );
}
