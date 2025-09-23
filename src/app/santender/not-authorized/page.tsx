import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SantenderNA() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">Not authorized</h1>
        <p className="text-muted-foreground">
          Your account is not mapped to the Santender workspace.
        </p>
        <Button asChild><Link href="/login">Go to Login</Link></Button>
      </div>
    </div>
  );
}
