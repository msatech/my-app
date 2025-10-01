"use client";

import * as React from "react";
import { useOkta } from "@/providers/OktaProvider";

export default function LogoutButton({
  asChild,
  children,
}: {
  asChild?: boolean;
  children?: React.ReactNode;
}) {
  const { signOut } = useOkta();

  const onClick = async () => {
    await signOut();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, { onClick });
  }

  return <button onClick={onClick}>{children ?? "Logout"}</button>;
}
