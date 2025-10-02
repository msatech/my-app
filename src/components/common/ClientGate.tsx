"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOkta } from "@/providers/OktaProvider";
import type { ClientKey } from "@/lib/client/constants";

export default function ClientGate({
  mustBe,
  children,
}: {
  mustBe: ClientKey;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useOkta();
  const client = user?.client;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(false);
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (client !== mustBe) {
      router.replace(`/${mustBe}/not-authorized`);
      return;
    }

    setAllowed(true);
  }, [client, isAuthenticated, isLoading, mustBe, router, user]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
