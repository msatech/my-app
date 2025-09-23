"use client";

import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/common/LogoutButton";

export default function MarsHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Mars</span>
        </div>
        <div className="ml-auto">
          <LogoutButton asChild>
            <Button variant="outline" size="sm">Logout</Button>
          </LogoutButton>
        </div>
      </div>
    </header>
  );
}
