import { getSession } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MarsLanding() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>``
        <h1 className="text-2xl font-semibold">Welcome, {session?.user.name} 👋</h1>
        <p className="text-sm text-muted-foreground">Client: Mars • OHR: {session?.user.ohr}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Session</CardTitle></CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">
            {JSON.stringify(session?.user, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
