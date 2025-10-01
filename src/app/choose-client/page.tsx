"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChooseClientClient from "./ChooseClientClient";
import { useOkta } from "@/providers/OktaProvider";

export default function ChooseClientPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useOkta();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (!user.clients.length || user.clients.length === 1) {
      router.replace("/after-login");
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading || !isAuthenticated || !user) {
    return <div className="text-sm text-muted-foreground">Loading your clients…</div>;
  }

  const clients = user.clients;
  if (clients.length <= 1) {
    return null;
  }

  return <ChooseClientClient name={user.name ?? "User"} clients={clients} />;
}
