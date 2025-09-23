"use client";

import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/common/LogoutButton";

export default function SantenderHeader({ initial }: { initial: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* left: tiny brand row */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md border border-border grid place-items-center text-[10px] font-semibold">
            G
          </div>
          <span className="font-medium">genpact</span>
        </div>
        <span className="text-[rgb(var(--muted-foreground))]">|</span>
        <span className="font-medium">Santander</span>
      </div>

      {/* right: bell, avatar, logout */}
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="h-9 w-9 grid place-items-center rounded-full border border-border bg-transparent"
          title="Notifications"
        >
          🔔
        </div>
        <div className="h-9 w-9 grid place-items-center rounded-full border border-border bg-transparent text-xs font-medium">
          {initial}
        </div>
        <LogoutButton asChild>
          <Button variant="outline" size="sm">Logout</Button>
        </LogoutButton>
      </div>
    </div>
  );
}
