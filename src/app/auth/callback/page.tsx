"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  clearPkce,
  decodeIdToken,
  getOktaConfig,
  loadPkce,
  saveTokens,
  type StoredTokens,
} from "@/lib/auth/okta";
import type { OktaConfig } from "@/lib/auth/okta";

type TokenResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
};

export default function OktaCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleError = (message: string) => {
      console.error(message);
      if (isMounted) setError(message);
    };

    const processRedirect = async () => {
      if (errorParam) {
        handleError(`Authentication failed: ${errorParam}`);
        return;
      }

      if (!code || !state) {
        handleError("Missing authorization code.");
        return;
      }

      const pkce = loadPkce();
      if (!pkce) {
        handleError("Missing PKCE verifier. Please restart the sign-in flow.");
        return;
      }

      if (pkce.state !== state) {
        handleError("State mismatch detected. Please try signing in again.");
        clearPkce();
        return;
      }

      try {
        const config: OktaConfig = getOktaConfig();
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: config.clientId,
          code,
          redirect_uri: config.redirectUri,
          code_verifier: pkce.codeVerifier,
        });

        const response = await fetch(config.tokenUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to exchange authorization code.");
        }

        const data = (await response.json()) as TokenResponse;
        const expiresIn = Number(data.expires_in ?? 3600);
        const expiresAt = Date.now() + (Number.isFinite(expiresIn) ? expiresIn : 3600) * 1000;

        const claims = decodeIdToken<Record<string, unknown> & { nonce?: string }>(data.id_token);
        if (pkce.nonce && claims.nonce !== pkce.nonce) {
          throw new Error("Nonce mismatch detected. Aborting sign-in.");
        }

        const tokenSet: StoredTokens = {
          idToken: data.id_token,
          accessToken: data.access_token,
          expiresAt,
        };

        saveTokens(tokenSet);
        clearPkce();
        window.dispatchEvent(new Event("okta:tokens-updated"));

        if (!isMounted) return;
        const redirectTo = pkce.redirectTo || "/after-login";
        router.replace(redirectTo);
      } catch (err) {
        console.error("Failed to process Okta redirect", err);
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unable to process sign-in callback.");
        clearPkce();
      }
    };

    void processRedirect();

    return () => {
      isMounted = false;
    };
  }, [router, errorParam, code, state]);

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p>Completing sign-in…</p>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
