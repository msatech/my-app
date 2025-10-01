"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const err = searchParams.get("error");

  const onOktaLogin = () => {
    setLoading(true);
    void signIn("okta", { callbackUrl: "/after-login" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Sign in securely with Okta to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={onOktaLogin} className="w-full" disabled={loading}>
            {loading ? "Redirecting to Okta..." : "Sign in with Okta"}
          </Button>
          {err && <p className="text-sm text-red-600">Authentication failed. Please try again.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
