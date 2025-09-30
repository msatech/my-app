import { OktaAuth } from "@okta/okta-auth-js";

export const oktaAuth = new OktaAuth({
  issuer: process.env.NEXT_PUBLIC_OKTA_ISSUER as string,
  clientId: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID,
  redirectUri: typeof window !== "undefined" ? window.location.origin + "/callback" : "",
  scopes: ["openid", "profile", "email"],
  pkce: true,
});
