"use client";

import { useEffect } from "react";
import type { ThemeTokens } from "@/lib/theme";
import type { ClientKey } from "@/lib/client/constants";

export default function ThemeProvider({
  client,
  tokens,
  children,
}: {
  client: ClientKey;
  tokens?: ThemeTokens;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-client", client);
    if (tokens?.cssVars) {
      Object.entries(tokens.cssVars).forEach(([k, v]) => {
        html.style.setProperty(k, String(v));
      });
    }
  }, [client, tokens]);

  return <>{children}</>;
}
