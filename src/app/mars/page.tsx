"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOkta } from "@/providers/OktaProvider";

export default function MarsLanding() {
  const { user, isAuthenticated, isLoading } = useOkta();

  if (isLoading || !isAuthenticated || user?.client !== "mars") {
    return <div className="text-sm text-muted-foreground">Loading Mars experience…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user?.name} 👋</h1>
        <p className="text-sm text-muted-foreground">Client: Mars • OHR: {user?.ohr}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Session</CardTitle></CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
