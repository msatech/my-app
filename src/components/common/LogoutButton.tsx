"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton({
  asChild,
  children,
}: {
  asChild?: boolean;
  children?: React.ReactNode;
}) {
  const onClick = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { onClick });
  }

  return <button onClick={onClick}>{children ?? "Logout"}</button>;
}
