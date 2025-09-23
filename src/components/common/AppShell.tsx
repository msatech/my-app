import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";

export default function AppShell({
  client,
  children,
}: {
  client: "mars" | "santender";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
          <span className="font-semibold">Client: {client.toUpperCase()}</span>
          <nav className="flex gap-3 text-sm">
            <Link href={`/${client}/dashboard`} className="hover:underline">Dashboard</Link>
            <Link href={`/${client}/routes`} className="hover:underline">Routes</Link>
            <Link href={`/${client}/routes/settings`} className="hover:underline">Settings</Link>
            <Link href={`/${client}/routes/reports`} className="hover:underline">Reports</Link>
          </nav>
          <div className="ml-auto">
            <LogoutButton asChild>
              <Button variant="outline" size="sm">Logout</Button>
            </LogoutButton>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
