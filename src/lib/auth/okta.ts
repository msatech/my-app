const TOKEN_STORAGE_KEY = "app:okta-tokens";
const PKCE_STORAGE_KEY = "app:okta-pkce";

export type StoredTokens = {
  idToken: string;
  accessToken: string;
  expiresAt: number;
};

export type StoredPkce = {
  codeVerifier: string;
  state: string;
  nonce: string;
  redirectTo?: string;
};

export type OktaConfig = {
  issuer: string;
  clientId: string;
  authorizeUrl: string;
  tokenUrl: string;
  logoutUrl: string;
  redirectUri: string;
  logoutRedirectUri: string;
};

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("This operation is only available in the browser.");
  }
}

export function getOktaConfig(): OktaConfig {
  ensureBrowser();
  const issuerEnv = process.env.NEXT_PUBLIC_OKTA_ISSUER;
  const clientId = process.env.NEXT_PUBLIC_OKTA_CLIENT_ID;
  if (!issuerEnv || !clientId) {
    throw new Error("Missing Okta configuration. Set NEXT_PUBLIC_OKTA_CLIENT_ID and NEXT_PUBLIC_OKTA_ISSUER.");
  }

  const issuer = issuerEnv.replace(/\/+$/, "");
  const origin = window.location.origin;

  return {
    issuer,
    clientId,
    authorizeUrl: `${issuer}/v1/authorize`,
    tokenUrl: `${issuer}/v1/token`,
    logoutUrl: `${issuer}/v1/logout`,
    redirectUri: `${origin}/auth/callback`,
    logoutRedirectUri: `${origin}/login`,
  };
}

export function saveTokens(tokens: StoredTokens | null) {
  ensureBrowser();
  if (!tokens) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

export function loadTokens(): StoredTokens | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredTokens;
    if (!parsed.idToken || !parsed.accessToken || !parsed.expiresAt) return null;
    return parsed;
  } catch (error) {
    console.warn("Unable to parse stored Okta tokens", error);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function savePkce(data: StoredPkce) {
  ensureBrowser();
  window.sessionStorage.setItem(PKCE_STORAGE_KEY, JSON.stringify(data));
}

export function loadPkce(): StoredPkce | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(PKCE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredPkce;
  } catch (error) {
    console.warn("Unable to parse stored PKCE data", error);
    window.sessionStorage.removeItem(PKCE_STORAGE_KEY);
    return null;
  }
}

export function clearPkce() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PKCE_STORAGE_KEY);
}

function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

const PKCE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

export function createRandomString(length = 128) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let output = "";
  for (let i = 0; i < array.length; i += 1) {
    output += PKCE_CHARSET[array[i] % PKCE_CHARSET.length];
  }
  return output;
}

export function decodeIdToken<T = Record<string, unknown>>(token: string): T {
  const parts = token.split(".");
  if (parts.length < 2) {
    throw new Error("Invalid ID token");
  }
  let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  while (payload.length % 4 !== 0) {
    payload += "=";
  }
  const decoded = atob(payload);
  try {
    return JSON.parse(decoded) as T;
  } catch {
    throw new Error("Unable to decode ID token payload");
  }
}
