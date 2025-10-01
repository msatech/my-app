"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOkta } from "@/providers/OktaProvider";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const callbackUrl = searchParams.get("callbackUrl") || "/after-login";
  const { signIn, isAuthenticated, isLoading, error: oktaError } = useOkta();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, isLoading, router, callbackUrl]);

  const onOktaLogin = () => {
    setLoading(true);
    setError(null);
    void signIn({ redirectTo: callbackUrl }).catch((err) => {
      setError(err instanceof Error ? err.message : "Unable to start Okta sign-in.");
      setLoading(false);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Sign in securely with Okta to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={onOktaLogin}
            className="w-full"
            disabled={loading || isLoading}
          >
            {loading ? "Redirecting to Okta..." : "Sign in with Okta"}
          </Button>
          {(error || oktaError) && (
            <p className="text-sm text-red-600">
              {error || oktaError || "Authentication failed. Please try again."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
