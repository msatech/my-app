"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ClientKey } from "@/lib/client/constants";
import { ALLOWED_CLIENTS } from "@/lib/client/constants";
import { DUMMY_USERS_BY_OHR } from "@/lib/auth/dummyUsers";
import {
  clearPkce,
  clearTokens,
  createCodeChallenge,
  createRandomString,
  decodeIdToken,
  getOktaConfig,
  loadTokens,
  savePkce,
  type StoredTokens,
} from "@/lib/auth/okta";

const CLIENT_STORAGE_KEY = "app:selected-client";

const isClientKey = (value: string | null): value is ClientKey =>
  value !== null && (ALLOWED_CLIENTS as readonly string[]).includes(value);

type OktaClaims = Record<string, unknown> & {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  login?: string;
  employeeNumber?: string;
  nonce?: string;
};

type AppUser = {
  id: string;
  name: string;
  email?: string;
  ohr: string;
  clientId: string;
  client?: ClientKey;
  clients: ClientKey[];
};

type OktaContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AppUser | null;
  error: string | null;
  signIn: (options?: { redirectTo?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  chooseClient: (client: ClientKey) => void;
  clearChosenClient: () => void;
};

const OktaContext = createContext<OktaContextValue | undefined>(undefined);

export function useOkta() {
  const context = useContext(OktaContext);
  if (!context) {
    throw new Error("useOkta must be used within an OktaProvider");
  }
  return context;
}

type BuildResult = {
  user: AppUser;
  validClient: ClientKey | null;
};

function buildUserFromClaims(
  claims: OktaClaims,
  requestedClient: ClientKey | null
): BuildResult {
  const ohr = String(
    (claims.employeeNumber || claims.preferred_username || claims.login || claims.sub || "").toString().trim()
  );

  const matches = ohr ? DUMMY_USERS_BY_OHR[ohr] || [] : [];

  const fallbackId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const baseUser: AppUser = {
    id: String(claims.sub || ohr || claims.email || fallbackId),
    name: (claims.name || claims.preferred_username || claims.login || "") as string,
    email: (claims.email as string | undefined) ?? undefined,
    ohr,
    clientId: "",
    client: undefined,
    clients: [],
  };

  if (matches.length === 0) {
    return { user: baseUser, validClient: null };
  }

  const availableClients = matches.map((match) => match.client);
  const normalizedRequested = requestedClient && availableClients.includes(requestedClient)
    ? requestedClient
    : null;

  const selectedRecord = normalizedRequested
    ? matches.find((match) => match.client === normalizedRequested) ?? matches[0]
    : matches[0];

  const effectiveClient = normalizedRequested
    ? normalizedRequested
    : matches.length === 1
    ? matches[0].client
    : undefined;

  return {
    user: {
      ...baseUser,
      name: selectedRecord?.name ?? baseUser.name,
      clientId: effectiveClient ? selectedRecord?.clientId ?? "" : "",
      client: effectiveClient,
      clients: availableClients,
    },
    validClient: normalizedRequested ?? (matches.length === 1 ? matches[0].client : null),
  };
}

export default function OktaProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<StoredTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chosenClient, setChosenClient] = useState<ClientKey | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CLIENT_STORAGE_KEY);
    if (isClientKey(stored)) {
      setChosenClient(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTokens = loadTokens();
    if (storedTokens && storedTokens.expiresAt > Date.now()) {
      setTokens(storedTokens);
    } else if (storedTokens) {
      clearTokens();
    }
    setIsLoading(false);

    const handleUpdate = () => {
      const latest = loadTokens();
      if (latest && latest.expiresAt > Date.now()) {
        setTokens(latest);
      } else {
        setTokens(null);
        clearTokens();
      }
    };

    window.addEventListener("okta:tokens-updated", handleUpdate);
    return () => {
      window.removeEventListener("okta:tokens-updated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!chosenClient) {
      window.localStorage.removeItem(CLIENT_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(CLIENT_STORAGE_KEY, chosenClient);
  }, [chosenClient]);

  useEffect(() => {
    if (!tokens) {
      setChosenClient(null);
    }
  }, [tokens]);

  const buildResult = useMemo(() => {
    if (!tokens) return null;
    try {
      const claims = decodeIdToken<OktaClaims>(tokens.idToken);
      return buildUserFromClaims(claims, chosenClient);
    } catch (err) {
      console.error("Unable to parse Okta ID token", err);
      setError("Failed to read sign-in information. Please sign in again.");
      return null;
    }
  }, [tokens, chosenClient]);

  useEffect(() => {
    if (!buildResult) return;
    const { validClient } = buildResult;
    if (!validClient && chosenClient) {
      setChosenClient(null);
    }
    if (validClient && validClient !== chosenClient) {
      setChosenClient(validClient);
    }
  }, [buildResult, chosenClient]);

  const user = buildResult?.user ?? null;

  const signIn = useCallback(
    async (options?: { redirectTo?: string }) => {
      try {
        const config = getOktaConfig();
        const codeVerifier = createRandomString(128);
        const codeChallenge = await createCodeChallenge(codeVerifier);
        const state = createRandomString(32);
        const nonce = createRandomString(32);

        savePkce({ codeVerifier, state, nonce, redirectTo: options?.redirectTo });

        const params = new URLSearchParams({
          client_id: config.clientId,
          response_type: "code",
          response_mode: "query",
          scope: "openid profile email",
          redirect_uri: config.redirectUri,
          state,
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
          nonce,
        });

        window.location.assign(`${config.authorizeUrl}?${params.toString()}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to start Okta sign-in.";
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      const config = getOktaConfig();
      const currentTokens = loadTokens();
      clearTokens();
      clearPkce();
      setTokens(null);
      setChosenClient(null);

      if (currentTokens?.idToken) {
        const params = new URLSearchParams({
          id_token_hint: currentTokens.idToken,
          post_logout_redirect_uri: config.logoutRedirectUri,
        });
        window.location.assign(`${config.logoutUrl}?${params.toString()}`);
      } else {
        window.location.assign(config.logoutRedirectUri);
      }
    } catch (err) {
      console.error("Failed to sign out", err);
      clearTokens();
      setTokens(null);
      setChosenClient(null);
      window.location.assign("/login");
    }
  }, []);

  const chooseClient = useCallback(
    (client: ClientKey) => {
      if (!user) return;
      if (!user.clients.includes(client)) return;
      setChosenClient(client);
    },
    [user]
  );

  const clearChosenClient = useCallback(() => {
    setChosenClient(null);
  }, []);

  const value = useMemo<OktaContextValue>(
    () => ({
      isAuthenticated: Boolean(tokens),
      isLoading,
      user,
      error,
      signIn,
      signOut,
      chooseClient,
      clearChosenClient,
    }),
    [tokens, isLoading, user, error, signIn, signOut, chooseClient, clearChosenClient]
  );

  useEffect(() => {
    if (!tokens) return;
    const timeout = tokens.expiresAt - Date.now();
    if (timeout <= 0) {
      clearTokens();
      setTokens(null);
      setChosenClient(null);
      return;
    }
    const handle = window.setTimeout(() => {
      clearTokens();
      setTokens(null);
      setChosenClient(null);
    }, timeout);
    return () => window.clearTimeout(handle);
  }, [tokens]);

  return <OktaContext.Provider value={value}>{children}</OktaContext.Provider>;
}
