import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DUMMY_USERS_BY_OHR } from "./dummyUsers";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: { ohr: { label: "OHR", type: "text" } },
      async authorize(credentials) {
        const ohr = (credentials?.ohr || "").trim();
        const matches = DUMMY_USERS_BY_OHR[ohr] || [];
        if (matches.length === 0) return null;

        // If 1 mapping → return full user with selected client
        if (matches.length === 1) {
          const u = matches[0];
          return {
            id: u.ohr,
            name: u.name,
            ohr: u.ohr,
            clientId: u.clientId,
            client: u.client,            // selected
            clients: [u.client],         // all available
            email: `${u.ohr}@example.com`,
          } as any;
        }

        // If multiple mappings → return base user, NO selected client yet
        const base = matches[0];
        return {
          id: base.ohr,
          name: base.name,
          ohr: base.ohr,
          clientId: "",                 // not chosen yet
          client: undefined,            // not chosen yet
          clients: matches.map(m => m.client),
          email: `${base.ohr}@example.com`,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On initial sign in, copy fields from "user"
      if (user) {
        token.name     = (user as any).name;
        token.ohr      = (user as any).ohr;
        token.clientId = (user as any).clientId;
        token.client   = (user as any).client;   // may be undefined
        token.clients  = (user as any).clients;  // array of allowed clients
      }

      // When the client is chosen from /choose-client
      if (trigger === "update" && session?.client) {
        token.client = (session as any).client;
        // If you want a per-client ID, you can look it up here using token.ohr
        // For demo we just clear/set a basic value:
        token.clientId = `${token.client}-selected`;
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).user = {
        name:      (token.name as string) ?? "",
        ohr:       (token.ohr as string) ?? "",
        clientId:  (token.clientId as string) ?? "",
        client:    (token.client as "mars" | "santender" | undefined),
        clients:   (token.clients as ("mars" | "santender")[]) ?? [],
      };
      return session;
    },
  },

  pages: { signIn: "/login" },
};
