"use client";

import SantenderDashboardClient from "./_components/SantenderDashboardClient";
import { useOkta } from "@/providers/OktaProvider";

export default function SantenderLanding() {
  const { user, isAuthenticated, isLoading } = useOkta();

  if (isLoading || !isAuthenticated || user?.client !== "santender") {
    return <div className="text-sm text-muted-foreground">Loading Santander experience…</div>;
  }

  const name = user?.name ?? "John";
  return <SantenderDashboardClient name={name} />;
}
