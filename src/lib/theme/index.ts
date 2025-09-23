import type { ClientKey } from "@/lib/client/constants";
import { marsTheme } from "./mars";
import { santenderTheme } from "./santender";

export type ThemeTokens = { name: string; cssVars?: Record<string, string | number> };

const THEMES: Record<ClientKey, ThemeTokens> = { mars: marsTheme, santender: santenderTheme };

export function getTheme(client: ClientKey): ThemeTokens {
  return THEMES[client];
}
