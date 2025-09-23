// src/types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      ohr: string;
      clientId?: string;                         // chosen clientId (after pick)
      client?: "mars" | "santender";             // chosen client (may be undefined right after login)
      clients?: ("mars" | "santender")[];        // all available clients for this OHR
      email?: string | null;
    };
  }

  // (Optional) if you use `User` anywhere (e.g., in authorize() returns)
  interface User {
    id: string;
    name: string;
    ohr: string;
    clientId?: string;
    client?: "mars" | "santender";
    clients?: ("mars" | "santender")[];
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string;
    ohr?: string;
    clientId?: string;
    client?: "mars" | "santender";
    clients?: ("mars" | "santender")[];
  }
}
