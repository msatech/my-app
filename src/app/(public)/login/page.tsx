"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    
  const [ohr, setOhr] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    // No client decision here. Just log in and then bounce to a server page.
    const res = await signIn("credentials", {
      redirect: false,
      ohr,
    });

    if (!res || !res.ok) {
      setLoading(false);
      setErr("Invalid OHR. Please try again.");
      return;
    }

    // Let the server read the session and redirect appropriately.
    router.replace("/after-login");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Login with your OHR</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ohr">OHR</Label>
            <Input
              id="ohr"
              value={ohr}
              onChange={(e) => setOhr(e.target.value)}
              placeholder="Enter your OHR"
              autoFocus
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
