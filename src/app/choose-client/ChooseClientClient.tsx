"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOkta } from "@/providers/OktaProvider";

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
  const { chooseClient } = useOkta();

  const pick = async (client: "mars" | "santender") => {
    chooseClient(client);
    router.replace(`/${client}`);
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
