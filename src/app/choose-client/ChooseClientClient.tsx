"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LABELS: Record<"mars" | "santender", string> = {
  mars: "Mars",
  santender: "Santander",
};

export default function ChooseClientClient({
  name,
  clients,
}: {
  name: string;
  clients: ("mars" | "santender")[];
}) {
  const router = useRouter();
  const { update } = useSession();

  const pick = async (client: "mars" | "santender") => {
    await update({ client });          // stores chosen client in JWT/session
    router.replace(`/${client}`);      // go to that client's landing
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {name} — choose a client</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clients.map((client) => (
          <Card key={client} className="transition hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{LABELS[client]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Continue to the {LABELS[client]} experience.
              </p>
              <Button onClick={() => pick(client)} className="w-full">
                Use {LABELS[client]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
