import { randomUUID } from "crypto";
import type { NextAuthOptions, User } from "next-auth";
import OktaProvider from "next-auth/providers/okta";
import type { ClientKey } from "@/lib/client/constants";
import { DUMMY_USERS_BY_OHR } from "./dummyUsers";

type OktaProfile = Record<string, unknown> & {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  login?: string;
  employeeNumber?: string;
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

const { OKTA_CLIENT_ID, OKTA_CLIENT_SECRET, OKTA_ISSUER } = process.env;

if (!OKTA_CLIENT_ID || !OKTA_CLIENT_SECRET || !OKTA_ISSUER) {
  throw new Error("Missing Okta environment variables. Please set OKTA_CLIENT_ID, OKTA_CLIENT_SECRET and OKTA_ISSUER.");
}

function buildUserFromProfile(profile: OktaProfile) {
  const ohr = String(
    (profile.employeeNumber || profile.preferred_username || profile.login || profile.sub || "")
  ).trim();

  const matches = ohr ? DUMMY_USERS_BY_OHR[ohr] || [] : [];

  const baseUser: AppUser = {
    id: String(profile.sub || ohr || profile.email || randomUUID()),
    name: (profile.name || profile.preferred_username || profile.login || "") as string,
    email: profile.email,
    ohr,
    clientId: "",
    client: undefined,
    clients: [],
  };

  if (matches.length === 1) {
    const match = matches[0];
    return {
      ...baseUser,
      name: match.name ?? baseUser.name,
      clientId: match.clientId,
      client: match.client,
      clients: [match.client],
    };
  }

  if (matches.length > 1) {
    const match = matches[0];
    return {
      ...baseUser,
      name: match.name || baseUser.name,
      clients: matches.map((m) => m.client),
    };
  }

  return baseUser;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    OktaProvider({
      clientId: OKTA_CLIENT_ID,
      clientSecret: OKTA_CLIENT_SECRET,
      issuer: OKTA_ISSUER,
      profile(profile) {
        return buildUserFromProfile(profile as OktaProfile);
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On initial sign in, copy fields from "user"
      if (user) {
        const appUser = user as User;
        token.name = appUser.name;
        token.ohr = appUser.ohr;
        token.clientId = appUser.clientId;
        token.client = appUser.client;
        token.clients = appUser.clients;
      }

      // When the client is chosen from /choose-client
      if (trigger === "update" && session?.client) {
        token.client = session.client as ClientKey;
        // If you want a per-client ID, you can look it up here using token.ohr
        // For demo we just clear/set a basic value:
        token.clientId = `${token.client}-selected`;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name ?? session.user?.name ?? "",
        ohr: token.ohr ?? "",
        clientId: token.clientId ?? "",
        client: token.client as ClientKey | undefined,
        clients: (token.clients as ClientKey[] | undefined) ?? [],
      };
      return session;
    },
  },

  pages: { signIn: "/login" },
};
